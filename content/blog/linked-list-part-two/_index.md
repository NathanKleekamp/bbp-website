---
title: 'Linked list implementation in Deno, part 2'
date: '2020-06-07T14:56:15.742Z'
description: "Let's continue our implementation of a linked list in Typescript and Deno!"
---

In my previous post, I implemented some core features necessary for a complete linked list implementation. If you haven't read that post, I would encourage you to do so before moving on.

## Linked list methods, part 2

In part 2 of our linked list implementation, we'll be adding the following public methods:

<dl>
  <dt>LinkedList.prototype.clear</dt>
  <dd>Delete all nodes from the list.</dd>

  <dt>LinkedList.prototype.index</dt>
  <dd>Return the node at the given index.</dd>

  <dt>LinkedList.prototype.insertAt</dt>
  <dd>Insert a node at the given index.</dd>

  <dt>LinkedList.prototype.insert</dt>
  <dd>Insert a node at the head of the list.</dd>

  <dt>LinkedList.prototype.removeAt</dt>
  <dd>Delete a node at the given index.</dd>

  <dt>LinkedList.prototype.removeFirst</dt>
  <dd>Delete the first node in the list.</dd>

  <dt>LinkedList.prototype.removeLast</dt>
  <dd>Delete the last node in the list.</dd>

  <dt>LinkedList.prototype.remove</dt>
  <dd>Delete the node with a given value.</dd>
</dl>

