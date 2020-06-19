---
title: "Asynchronous JavaScript, part 1: Callbacks"
description: "Part 1 of our series on writing asynchronous JavaScript."
date: "2020-06-19T21:04:05.355Z"
---

I have been working on this post for a while. Originally, I planned to write a big piece on promises, but given the delays finishing it, I decided to break it into smaller parts. This fist post provides some context around how async code has been written in the past. In future installments, we'll get into promises, generators and how they make async/await possible, and, finally, how JavaScript engines and browsers work together to queue and execute synchronous and asynchronous code.

## Some context

For those of you newer to JavaScript, it is important to know that JavaScript runs in a single-threaded environment (ignoring [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) for now). It's unimportant that you understand CPU threading, however it is vital that you realize how JavaScript execution in a single thread affects your applications.

When evaluating a simple script, like the following, the JavaScript interpreter reads each line of input and executes it in order.

```js
console.log('begin');

// This long running task takes about 5000 miliseconds to complete
someVeryLongRunningTask();

console.log('end');
```

When the interpreter reaches `someVeryLongRunningTask()`, it will execute that function until it completes. While `someVeryLongRunningTask()` executes, the rest of your application will wait until it finishes. This is called _blocking_. In some rare server-side cases this might be OK, but if this happens in a browser, the entire UI will freeze for 5 seconds.

What we really want is a way to hand off `someVeryLongRunningTask()` to some other queue to be executed by the browser without blocking the execution of the rest of the application.

### Callbacks

Before the addition of the promise API to the JavaScript spec, the only method available to developers to write asynchronous operations was the so-called "callback" function. If you've been developing with JavaScript for a while, you've likely encountered something like the following:

```js
const cartPath = 'https://api.example.com/carts/a2b17167-d059-4cc2-8fd9-f404d932d42f';

// Assume the ajax and creditCardLibrary are provided elsewhere
ajax(cartPath, (cart) => creditCardLibrary.charge(cart.total));
```

Here the `ajax` function accepts two parameters, the path from which to request data and a function to call when the request is completed. Though you've likely seen or written code like this thousands of times, there's a lot to unpack in this small example.

The fact that we can even pass a function to another function is somewhat remarkable. While it's growing more common for languages to allow you to pass functions around like variables, not all languages support this functionality.

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

In an effort to stay on topic, the "short" answer is that the `ajax` function wraps a browser API called `XMLHttpRequest`. `XMLHttpRequest` supports an event-driven API. The browser queues the events from `XMLHttpRequest` separately so they can be called asynchronously.

### Problems with Callbacks

From an application design perspective, callbacks give control of our application's execution to a third-party. Once we call the `ajax` function and pass it our callback, we're no longer in control of how or when our callback function gets called. This concept is known as _inversion of control_ and can lead to issues related to trust, e.g. "will this third party library to do the right thing at the correct time?". Hopefully! However, because we're not in control of that code, there's no guarantee.

For something as routine as an `ajax` call you might be asking yourself, is this a big deal? After all, we've all written code like this a million times.

I think to answer that question, we should look at the `chargeCreditCard` callback. Is that mission-critical code? Probably. Are you totally comfortable handing that off to a third-part and hoping there isn't a bug in their implementation? What happens if that callback never runs or it runs too many times? That is going to cost your employer money and credibility.

Another weakness with callbacks is error handling. Unfortunately, there is no prescribed way to handle errors; there is just a convention to pass the error as the first parameter to the callback

From a developer experience, nested callbacks can are a pain. Not only are they ugly, but it is easy to get lost when reading a new piece of code (or one you haven't touched in a while). This is called "callback hell".

### Looking ahead: Promises

Thankfully, with the introduction of promises, many of these issues have been addressed. In part 2, we'll turn our attention to the problems promises solves, how they work, and possible gotchas.
