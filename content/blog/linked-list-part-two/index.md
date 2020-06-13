---
title: "Linked list implementation in Deno, part 2"
date: "2020-06-13T17:04:54Z"
description: "Let's continue our implementation of a linked list in Typescript and Deno!"
---

In the [previous post](/linked-list/), we implemented some core features necessary to build a linked list in Typescript. If you haven't read it, go check it out.

## A (short) detour into Typescript: type assertion functions

Before jumping into the remaining methods of our linked list, let's examine a helper function we'll use a bit later that makes working with possibly nullish values a little nicer.

The Typescript dev team introduced type assertion functions in Typescript 3.7. One of my favorite ways to use type assertion functions is the `assertIsDefined` helper:

```ts
export function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`AssertionError: expected value ${value} to be NonNullable.`);
  }
}

type Example = {
  name: string;
  address?: {
    city: string;
    postalCode?: string;
  }
};

const nathan: Example = {
  name: "nathan",
  address: { city: "Washington" },
};

assertIsDefined(nathan.address);

// No Typescript errors that "nathan.address" is possibly undefined
console.log(nathan.address.city)
```

Type assertion functions eliminate clumsy conditional code, like:

```ts
if (nathan.address) {
  console.log(nathan.address.city);
}
```

If you're interested in reading more about type assertion functions, check out:

* The [release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions) for 3.7
* The [PR](https://github.com/microsoft/TypeScript/pull/32695) implementing type assertion functions

With that, let's resume our linked list implementation!

## Linked list methods, part 2

In part 2 of our linked list implementation, we'll be adding the following public methods:

<dl>
  <dt>LinkedList.prototype.clear</dt>
  <dd>Delete all nodes from the list.</dd>

  <dt>LinkedList.prototype.index</dt>

  <dd>Retrieve the node at the given index.</dd>
  <dt>LinkedList.prototype.insert</dt>
  <dd>Insert a node at the head of the list.</dd>

  <dt>LinkedList.prototype.insertAt</dt>
  <dd>Insert a node at the given index.</dd>

  <dt>LinkedList.prototype.remove</dt>
  <dd>Delete the given node.</dd>

  <dt>LinkedList.prototype.removeAt</dt>
  <dd>Delete a node at the given index.</dd>

  <dt>LinkedList.prototype.removeFirst</dt>
  <dd>Delete the first node (a.k.a. <code>head</code>) in the list.</dd>

  <dt>LinkedList.prototype.removeLast</dt>
  <dd>Delete the last node (a.k.a. <code>tail</code>) in the list.</dd>
</dl>

### LinkedList.prototype.clear

Emptying a link list is easy; just reset all the stateful properties in the class to their original values. The garbage collector will do the rest!

```ts
class LinkedList<T> {
  ...
  clear(): void {
    this.#head = undefined;
    this.#tail = undefined;
    this.#count = 0;
  }
  ...
}

// LinkedList.prototype.clear
(() => {
  const list = new LinkedList<string>();
  list.append("foo");
  list.append("bar");
  assertEquals(list.count(), 2);

  list.clear()
  assertEquals(list.count(), 0);
  assertEquals(list.head(), undefined);
  assertEquals(list.tail(), undefined);
})();

```

### LinkedList.prototype.index

Finding a node at a given index takes a little more work. We've made some optimizations to our linked list by keeping track of our `head` and `tail` nodes. Accessing each of those is an __O(1)__ operation. Since we are also tracking how many nodes our list has in the `count` property, we can easily tell if a provided index is out-of-bounds. That means the most expensive lookup, __O(n)__, will be accessing the node just before the `tail` because we have to cycle through each node until we reach it.

```ts
class LinkedList {
  ...
  index(index: number): Node<T> | undefined {
    if (index < 0) {
      throw new IndexError(
        "IndexError: Index cannot be a negative number."
      );
    }

    if (this.isEmpty()) {
      throw new IndexError(
        "IndexError: Cannot index an empty list."
      );
    }

    if (index === 0) {
      return this.head();
    }

    const lastIndex = this.count() - 1;

    if (index > lastIndex) {
      throw new IndexError(
        "IndexError: Index exceeds the number of nodes in the list."
      );
    }

    if (index === lastIndex) {
      return this.tail();
    }

    let node = this.head();

    for (let i = 0; i !== index; i++) {
      node = node!.next;
    }

    return node;
  }
  ...
}

// LinkedList.prototype.index
(() => {
  const list = new LinkedList<string>();

  // Throws when a negative number is passed
  assertThrows(() => list.index(-1));

  // Throws when an index larger than count is passed
  assertThrows(() => list.index(1));

  list.append("foo");
  list.append("bar");
  list.append("baz");

  assertEquals(list.index(0)!.value, "foo");
  assertEquals(list.index(1)!.value, "bar");
  assertEquals(list.index(2)!.value, "baz");
})();
```

### LinkedList.prototype.insert

With the `insert` method, we can insert a new node at the head of the list. Insert is an __O(1)__ operation because the head of the list is always known. Insertion is as simple as instantiating a new node and updating the pointers on the new node and the previous `head`. Not too different, conceptually, from our append method from part one!

```ts
class LinkedList {
  ...
  insert(value: T): void {
    const node = new Node<T>(value);
    const head = this.head();
    if (head) {
      head.previous = node;
      node.next = head;
      this.#head = node;
    } else {
      this.#head = node;
      this.#tail = node;
    }
    this.#count++;
  }
  ...
}

// LinkedList.prototype.insert
(() => {
  const list = new LinkedList<string>();
  list.insert("foo");
  list.insert("bar");
  const head = list.head();
  const tail = list.tail();
  assertEquals(head!.value, "bar");
  assertEquals(tail!.value, "foo");
})();
```

### LinkedList.prototype.insertAt

The `inserAt` method uses the index method from earlier to grab a reference to the current node occupying the index where we want to insert the new node (notice the use of `assertIsDefined`!). Then it's just a matter of updating pointers and incrementing the `count` property.

```ts
class LinkedList {
  ...
  insertAt(index: number, value: T) {
    const node = new Node<T>(value);
    const current = this.index(index);
    assertIsDefined(current);
    const previous = current.previous;
    if (previous) {
      previous.next = node;
      node.previous = previous;
    }
    node.next = current;
    current.previous = node;
    this.#count++;
  }
  ...
}

// LinkedList.prototype.insertAt
(() => {
  const list = new LinkedList<string>();

  // Cannot use LinkedList.prototype.insertAt on an empty list
  assertThrows(() => list.insertAt(0, "foo"));

  // [foo]
  list.insert("foo");

  // Cannot use LinkedList.prototype.insertAt to append to a list
  assertThrows(() => { list.insertAt(1, "bar") });

  // [baz] => [foo]
  list.insert("baz");

  // [baz] => [bar] => [foo]
  list.insertAt(1, "bar");

  assertEquals(list.index(1)!.value, "bar");
  assertEquals(list.index(1)!.previous!.value, "baz");
  assertEquals(list.index(1)!.next!.value, "foo");

  // [baz] => [bar] => [qux] => [foo]
  list.insertAt(2, "qux");

  assertEquals(list.index(2)!.value, "qux");
  assertEquals(list.index(2)!.previous!.value, "bar");
  assertEquals(list.index(2)!.next!.value, "foo");
})();
```

### LinkedList.prototype.remove

Now that we have a couple methods for adding nodes to the linked list, we also need a way to remove a node. We'll start with the `remove` method, because it will get reused in the other "remove" convenience methods.

To remove a node, we first need a reference to it. For the sake of clarity, let's refer to the node being removed as the _removed node_.

First, we'll grab the `previous` and `next` properties of the _removed node_. If the `previous` property points to a node, we update the previous' node's `next` property to point the _removed node_'s `next` node.

If the _remove node_'s `previous` property does not contain a pointer to node, that means it's the list's current head. So we'll have to update the `head` property of the list to point to the _removed node_'s `next` node.

If the _remove node_'s `next` property points to a node, we'll update it so that the next node's `previous` property points to the _removed node_'s `previous` node.

If the _remove node_'s `next` property does not contain a pointer to a node, that means it's the list's current `tail`. So we need to update the `tail` property of the list to point to the _removed node_'s `previous` node.

Finally, we'll decrement the count property to reflect the removal of the node.

Phew, that's a lot of words! The code expresses the same idea much more succinctly!

```ts
class LinkedList {
  ...
  remove(node: Node<T>) {
    const { previous, next } = node;

    if (previous) {
      previous.next = next;
    } else {
      this.#head = next;
    }

    if (next) {
      next.previous = previous;
    } else {
      this.#tail = previous;
    }

    this.#count--;
  }
  ...
}

// LinkedList.prototype.remove
(() => {
  const list = new LinkedList<string>();
  list.append("foo");
  list.append("bar");
  list.append("baz");

  const head = list.head();
  const bar = list.index(1);
  const tail = list.tail();

  assertIsDefined(bar);
  assertIsDefined(head);
  assertIsDefined(tail);

  list.remove(bar);

  assertEquals(head.next!.value, "baz");
  assertEquals(tail.previous!.value, "foo");

  list.remove(tail);

  assertEquals(head.next, undefined);

  list.remove(head);
  assertEquals(list.isEmpty(), true);
})();
```

### LinkedList.prototype.removeAt

Now that we have `index` and `remove` methods, removing a node at a given index is very easy.

```ts
class LinkedList {
  ...
  removeAt(index: number) {
    const node = this.index(index);
    assertIsDefined(node);
    this.remove(node);
  }
  ...
}

// LinkedList.prototype.removeAt
(() => {
  const list = new LinkedList<string>();
  assertThrows(() => list.removeAt(0));

  list.append("foo");
  list.append("bar");
  list.append("baz");
  list.append("qux");
  list.removeAt(2);

  const bar = list.index(1);
  assertIsDefined(bar);

  assertEquals(list.count(), 3);
  assertEquals(bar.value, "bar");
  assertEquals(bar.previous!.value, "foo");
  assertEquals(bar.next!.value, "qux");
})();
```

### LinkedList.prototype.removeFirst

Likewise, `removeFirst` is an easy implementation.

```ts
class LinkedList {
  ...
  removeFirst() {
    const node = this.head();
    assertIsDefined(node);
    this.remove(node);
  }
  ...
}

// LinkedList.prototype.removeFirst
(() => {
  const list = new LinkedList<string>();
  assertThrows(() => list.removeFirst());

  list.insert("foo");
  list.insert("bar");
  list.removeFirst();

  assertEquals(list.count(), 1);
  assertEquals(list.head()!.value, "foo");
})();
```

### LinkedList.prototype.removeLast

So is `removeLast`.

```ts
class LinkedList {
  ...
  removeLast() {
    const node = this.tail();
    assertIsDefined(node);
    this.remove(node);
  }
  ...
}

// LinkedList.prototype.removeLast
(() => {
  const list = new LinkedList<string>();
  assertThrows(() => list.removeLast());

  list.insert("foo");
  list.insert("bar");
  list.removeLast();

  assertEquals(list.count(), 1);
  assertEquals(list.head()!.value, "bar");
})();
```
And with that our doubly linked list is complete!

The complete code for this linked list implementation is available on [Github](https://github.com/NathanKleekamp/algorithm-typescript/blob/master/algos/linked-list/linked-list.ts).
