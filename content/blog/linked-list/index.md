---
title: 'Linked list implementation in Deno, part 1'
date: '2020-06-07T14:56:15.742Z'
description: "Let's implement a linked list in Typescript and Deno!"
---

Since Deno has reached 1.0, I thought it might be fun to experiment a little with it, while also creating a linked list implementation in Typescript.

The linked list is often one of the first data structure developers learn because it can serve as the basis for other data structures, like stacks, queues, trees, tries, and graphs.

The concept is simple. You have a node with a value and a pointer to the next (and sometimes previous) node in the list. When a node also points at a previous node in the list, the list is called a doubly linked list.

```
NODE FOO                  NODE BAR                  NODE BAZ
------------------        ------------------        ------------------
| value: "foo"   |        | value: "bar"   |        | value: "baz"   |
| next: BAR      | ---->  | next: BAZ      | ---->  | next: null     |
| previous: null |        | previous: FOO  |        | previous: BAR  |
------------------        ------------------        ------------------
```

## Linked list methods, part 1

In part 1 of our linked list series, we'll create the following public methods:

<dl>
  <dt>LinkedList.prototype.append</dt>
  <dd>Add a node to the end of the list.</dd>

  <dt>LinkedList.prototype.count</dt>
  <dd>Return the number of nodes in the list.</dd>

  <dt>LinkedList.prototype.head</dt>
  <dd>Return the first node in the list.</dd>

  <dt>LinkedList.prototype.isEmpty</dt>
  <dd>Return <code>true</code> if the list has no nodes. <code>false</code> if it does.</dd>

  <dt>LinkedList.prototype.tail</dt>
  <dd>Return the last node in the list.</dd>
</dl>

## Project Setup
Deno supports Typescript as a first class citizen, so for all the code that follows, we do not need a <code>tsconfig.json</code>. I'll work in a single file called `linked-list.ts`.

## Our <code>Node</code> class
Because the list consists of a group of nodes, let's define a generic node class first.

```ts
class Node<T> {
  value: T;
  next?: Node<T>;
  previous?: Node<T>;

  constructor(value: T) {
    this.value = value;
  }
}
```

## Our <code>LinkedList</code> class
Now, let's create our generic <code>LinkedList</code> class. We'll start with a <code>LinkedList.prototype.count</code> method.

Note: the &#65287;<code>#</code>&#65287; here denotes a new ECMAScript syntax for adding private fields to a class, support for which was added in Typescript v3.8.

```ts
class LinkedList<T> {
  #count = 0;

  count(): number {
    return this.#count;
  }
}
```

We will need a few more properties and methods in order to do anything interesting with our linked list, so let's finish laying the ground work by adding the `head` and `tail` private properties, in addition to the `isEmpty`, `head`, and `tail` methods.

```ts
class LinkedList<T> {
  #head?: Node<T>;
  #tail?: Node<T>;
  #count = 0;

  isEmpty() {
    return this.count() === 0;
  }

  head(): Node<T> | undefined {
    return this.#head;
  }

  tail(): Node<T> | undefined {
    return this.#tail;
  }

  count(): number {
    return this.#count;
  }
}
```

With that, let's get started with the adding some real functionality to our implementation. We'll begin with the `append` method.

### LinkedList.prototype.append

```ts
class LinkedList<T> {
...

  append(value: T): void {
    const node = new Node<T>(value);
    const tail = this.tail();
    if (tail) {
      tail.next = node;
      node.previous = tail;
      this.#tail = node;
    } else {
      this.#head = node;
      this.#tail = node;
    }
    this.#count++;
  }

...
}
```

When we append a new node to a list that already contains nodes, there're a few things we need to do, among them, we need to get a reference to the last node in the list, so we can update it's `next` property to point to our new node. Also, we'll set the `previous` property on the new node to point to last node in the list, which effectively means our new node has become the last node in the list. Thus, we update the `tail` property accordingly.

If the list was empty, the new node will become both the `head` and `tail` nodes, so we update both properties, accordingly.

Finally, we increment the `count` property because we've added a new node.

Our `append` method is an __O(1)__ operation because we're keeping track of each node at the end of the list with the `tail` property.

### A (slight) detour into unit testing with Deno

Deno's standard library has some assertion functions to facilitate testing. Let's import `assertEquals`, so we can test our implementation so far. Deno supports ES6 <code>import</code> statements out-of-the-box with one caveat; instead of importing a package from a <code>node_modules</code> directory, you pass it a fully qualified URL.

```ts
import { assertEquals } from "https://deno.land/std@0.53.0/testing/asserts.ts";
```

Let's write some basic unit tests for what we have so far.

```ts
// LinkedList.prototype.append
(() => {
  const list = new LinkedList<string>();

  list.append("foo");
  list.append("bar");

  const head = list.head();
  const tail = list.tail();

  assertEquals(head!.value, "foo");
  assertEquals(head!.next!.value, "bar");
  assertEquals(tail!.value, "bar");
  assertEquals(tail!.previous!.value, "foo");
})();

// LinkedList.prototype.count
(() => {
  const list = new LinkedList<string>();
  list.append("foo");
  assertEquals(list.count(), 1);

  list.append("bar");
  assertEquals(list.count(), 2);
})();

// LinkedList.prototype.isEmpty
(() => {
  const list = new LinkedList<string>();
  assertEquals(list.isEmpty(), true);

  list.append("foo");
  assertEquals(list.isEmpty(), false);
})();

```

To run the tests, type the following in your shell. You should see no output from the command if all goes well and you have no failures.

```
$ deno run linked-list.ts
```

The complete code for this linked list implementation is available on [Github](https://github.com/NathanKleekamp/algorithm-typescript/blob/master/algos/linked-list/linked-list.ts).
