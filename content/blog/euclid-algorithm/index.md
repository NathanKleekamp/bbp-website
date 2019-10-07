---
title: "Euclid's Algorithm"
description: "My implementation of Euclid's algorithm to find the greatest common divisor of two positive integers"
date: 2019-10-07T12:42:01.828Z
---

I've recently begun working my way through Donald E. Knuth's seminal computer science work, "[The Art of Computer Programming](https://www-cs-faculty.stanford.edu/~knuth/taocp.html)", and the first [algorithm](/glossary/algorithm/) introduced is Euclid's Algorithm to find the greatest common divisor of two positive integers.

What follows is my (recursive) implementation.

```js
const gcd = (x, y) => {
  // Our integers much be positive, i.e. natural/counting numbers
  if (x < 0 || y < 0) {
    return;
  }

  // Ensure m is assigned the large value (and n the small) of
  // the passed arguments
  const m = x > y ? x : y;
  const n = x > y ? y : x;

  const remainder = m % n;

  if (remainder === 0) {
    // This is our answer
    return n;
  }

  return gcd(n, remainder);
};

console.log(gcd(119, 544)) // 17
```
