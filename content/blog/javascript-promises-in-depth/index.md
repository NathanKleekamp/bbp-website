---
title: "JavaScript promises in-depth"
description: "An in-depth look at JavaScript's Promise API: the problems it solves, how it work, and gotchas."
date: 2019-10-08T12:55:39.150Z
---

## Putting JavaScript promises in context

For those of you newer to JavaScript, it is important to know that JavaScript runs in a single-threaded environment (ignoring [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) for now). It's not really important that you understand what a CPU thread is, but you do need to realize how JavaScript being executed in a single thread affects your applications.

When evaluating a simple script, like the following, the JavaScript interpreter reads each line of input and executes it in order.

```js
console.log('begin');

// This long running task takes about 5000 miliseconds to complete
someVeryLongRunningTask();

console.log('end');
```

When the interpreter reaches `someVeryLongRunningTask()`, it will execute that function until it completes. While `someVeryLongRunningTask()` is executing, the rest of your application will wait until it finishes. This is called _blocking_. In some rare server-side cases this might be OK, but if this happens in a browser, the entire UI will freeze for 5 seconds.

What we really want is to hand off `someVeryLongRunningTask()` to some other queue to be executed by the browser without blocking the execution of the rest of the application.

### Callbacks

Before the addition of the Promise API to the JavaScript spec, the only method available to developers to write asynchronous operations was the so-called "callback" function. If you've been developing with JavaScript for a while, you've likely encountered something like the following:

```js
const cartPath = 'https://api.example.com/carts/a2b17167-d059-4cc2-8fd9-f404d932d42f';

// Assume the ajax and creditCardLibrary are provided elsewhere
ajax(cartPath, (cart) => creditCardLibrary.charge(cart.total));
```

Here the `ajax` function accepts two parameters, the path from which to request data and a function to call when the request is completed successfully. Though you've likely seen or written code like this thousands of times, there's a lot to unpack in this small example.

The fact that we can even pass a function to another function is somewhat remarkable. While it's growing more common for languages to allow you to pass functions around like any other variable, not all languages give you this ability.

Also, what is it about the `ajax` function that allows our `chargeCreditCard` function be called asynchronously? Why doesn't the `ajax` function block execution like our previous `someVeryLongRunningTask` function?

If I were to write a callback function like the following, it would still block, so there isn't anything special about the callback pattern that allows for the asynchronous execution of code.

```js
const job = (callback) => {
  console.log('begin');
  callback();
  console.log('end');
};

job(someLongRunningTask); // Still blocks for 5 seconds

```

The "short" answer is that the `ajax` function wraps a browser API called `XMLHttpRequest`, which has an event-driven API. In an effort to not get too far off topic, suffice it to say the browser will separately queue event listeners so that they can be called asynchronously. (__Note__: I am planning to write a future post about how the JavaScript engine and browsers work together to execute and queue synchronous and asynchronous code.)

From an application design perspective, let's also point out that we've given control of our application's execution to a third-party. Once we call the `ajax` function and pass it our callback, we're no longer in control of how or when our callback function gets called. This concept is known as _inversion of control_ and can lead to trust issues related to, "will this third party library to do the right thing at the correct time?". Hopefully! However, there's no guarantee.

For something as routine as an `ajax` call, you might be asking yourself, is this a big deal?

I think to answer that question, we should look at the `chargeCreditCard` callback. Is that mission-critical code? It looks like it to me. Are you totally comfortable handing that off to a third-part and hoping there isn't a bug in their implementation? What happens if that callback never runs or it runs too many times? That is going to cost your employer money.

We haven't even touched on how error handling works with callbacks. Unfortunately, there is no prescribed way to handle errors, just a convention to pass the error as the first parameter to the callback. Let's flesh out the `ajax` function we used in our earlier example.

```js
const ajax = (path, callback) => {
  const request = new XMLHttpRequest();
  request.addEventListener('load', () => {
    if (request.status < 600 && request.status > 399) {
      // Here we received an HTTP error code, so we pass the
      // API's error response as the first parameter
      callback(JSON.parse(request.responseText));
    } else {
      // The request was successful, so we pass null as the
      // first parameter and the parsed JSON as the response
      callback(null, JSON.parse(request.responseText));
    }
  });

  // Pass along any network-level error events, too
  request.addEventListener('error', (event) => callback(event));
  request.open('GET', path, true);
  request.send();
};
const path =  'https://api.example.com/carts/a2b17167-d059-4cc2-8fd9-f404d932d42f'
ajax(path, (err, result) => {
  if (err) {
    console.error('error', err);
  } else {
    console.log('result', result);
  }
});
```

## Promises

The JavaScript Promise API was designed to deal with the shortcomings of the callback pattern, especially the inversion of control. With a promise, you can always count on getting either a fulfilled or rejected response, and our code can determine how best to proceed. We're totally in control.

### Promise API

#### Promise constructor

#### Promise static methods

##### Promise.resolve

##### Promise.reject

##### Promise.all

##### Promise.allSettled

##### Promise.race

### Promise error handling and gotchas

