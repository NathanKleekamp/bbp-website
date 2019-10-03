---
title: 'The basics of Big O notation'
date: '2019-10-02T20:23:36.093Z'
description: 'A post where I discuss the basics of Big O notation.'
---

For many self-taught developers, or those who do not come from a mathematics background, Big O notation can be an intimidating topic, especially since there are terms like _exponential_, _logarithmic_, _quadratic_, and _factorial_ peppered throughout.

But I'm here to tell you that while intimidating, this is definitely something you can learn.

## What is Big O notation, and why is it useful?

In the software engineering context, Big O notation, at it's core, is a way for developers to describe how efficient an algorithm is in terms of time or some other limited resource, like memory.

While it is a topic that gets asked during the hiring process at some firms, in my experience it doesn't come up often in daily conversation until you start working with a lot of data.

For that reason, I'd recommend having a passable knowledge of some of the most common Big O notations so that you can speak to them if asked during an interview. However, don't try to optimize the efficiency of your code to get a lower Big O notation until there's a proven reason to do so. Readability should come first, optimizations second.

## Common Big O notations from most efficient to least

For what follows, we'll be focusing on Big O notation in terms of how long, or how much _time_, a given algorithm takes to complete.

<table>
  <thead>
    <tr>
      <th>Notation</th>
      <th>Common Name</th>
      <th>Meaning</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>O(1)</td>
      <td>Constant Time</td>
      <td>No matter how many data points you have, the lookup will be constant. This is the most efficient type of algorithm. Accessing an object's property, e.g. <code>nathan.name</code> or an array item by index (<code>someArray[0]</code>) are textbook examples of O(1).</td>
    </tr>
    <tr>
      <td>O(log n)</td>
      <td>Logarithmic Time</td>
      <td>As the input increases, the number of operations decreases by a fraction. The best metaphor I've heard to describe this is looking up someone's name in a directory. Though the dataset is large, you can ignore most inputs and start with the letter with which the person's name begins. A textbook example is the <a href="https://en.wikipedia.org/wiki/Binary_search_algorithm">binary search.</a></td>
    </tr>
    <tr>
      <td>O(n)</td>
      <td>Linear Time</td>
      <td>If you double the amount of data, the algorithm will take 2x longer to complete. In this way, we say it scales linearly. The textbook example is a simple <code>for</code> loop. As you add items to an array, the loop takes that much longer to complete.</td>
    </tr>
    <tr>
      <td>O(n log n)</td>
      <td>🤷‍</td>
      <td>Here you’re doing both O(n) + O(log n) operations. A textbook example is the <a href="https://en.wikipedia.org/wiki/Merge_sort">Merge sort</a> sorting algorithm. In fact, no comparison sort can be faster than O(n log n), unless it's already sorted. I highly recommend Khan Academy's <a href="">Analysis of merge sort</a>.</td>
    </tr>
    <tr>
      <td>O(n²)</td>
      <td>Quadratic Time</td>
      <td>The textbook example if quadratic time is nested <code>for</code> loops where you’re looping over the same array twice or the <a href ="https://en.wikipedia.org/wiki/Bubble_sort">Bubble sort</a> algorithm.</td>
    </tr>
    <tr>
      <td>O(2^n)</td>
      <td>Exponential Time</td>
      <td>An algorithm whose growth doubles with each addition to the input dataset. Time starts shallow, rising to an ever-increasing rate until the end.</td>
    </tr>
    <tr>
      <td>O(n!)</td>
      <td>Factorial Time</td>
      <td>The textbook example is the <a href="https://en.wikipedia.org/wiki/Travelling_salesman_problem">Travelling Salesman problem</a> solved by brute forcing it.</td>
    </tr>
  </tbody>
</table>

You'll likely rarely encounter exponential and factorial time operations; I don't recall seeing anything over O(n log n). Your mileage will vary, though.

