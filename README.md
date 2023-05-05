# Object Reshaper

[![CI](https://github.com/dextertanyj/object-reshaper/actions/workflows/ci.yml/badge.svg)](https://github.com/dextertanyj/object-reshaper/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/dextertanyj/object-reshaper/badge.svg?branch=master)](https://coveralls.io/github/dextertanyj/object-reshaper?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/dextertanyj/object-reshaper/badge.svg)](https://snyk.io/test/github/dextertanyj/object-reshaper)

TypeScript-first schema-based object transformation.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
  - [Requirements](#requirements)
- [Usage](#usage)
  - [Property Access](#property-access)
  - [Declaring Multidimensional or Nested Arrays](#declaring-multidimensional-or-nested-arrays)
- [Examples](#examples)
- [Specification](#specification)
  - [`undefined` & `null` Inputs](#undefined--null-inputs)
  - [Union Input Types (Experimental)](#union-input-types-experimental)

## Introduction

Object Reshaper provides a type-safe interface for transforming objects using a schema, allowing users to easily transform objects without having to write boilerplate code.
It supports renaming fields, extracting nested objects, and flattening nested arrays.
Simply define a schema that describes the desired output using dot notation and Object Reshaper will generate a function that transforms input objects into the desired shape.

> :warning: **What Object Reshaper is not**
>
> Object Reshaper is not a replacement for existing object validation libraries.
> It is strongly recommended that any inputs from users or external sources be validated before being passed to Object Reshaper.
> Object Reshaper does not perform any validation of object properties at runtime and supplying any inputs that do not conform to the expected type will result in undefined behaviour.

## Installation

```sh
$ npm install object-reshaper
```

### Requirements

- TypeScript 4.9+

## Usage

Object Reshaper provides a `reshaperBuilder` function that takes in a schema and returns a function that transforms input objects into the desired shape.

The schema is a JavaScript object that should have the same structure as the desired output object, including any nested structures.
The values of each property should be a string that describes the path to the desired property in the input object.

```ts
import { reshaperBuilder, Schema } from "object-reshaper";

type Input = {
  id: number;
  name: string;
};

const schema = {
  uin: "id",
  username: "name",
} as const satisfies Schema<Input>;

const reshaper = reshaperBuilder<Input, typeof schema>(schema);
reshaper({ id: 1, name: "John" }); // => { uin: 1, username: "John" } (Type: { uin: number, username: string })
```

> To provide type safety, schemas must be declared with a `const` assertion so that TypeScript can retrieve the type of each property being accessed.<br>
> Optionally, the `satisfies` operator can be used to ensure that the schema is valid for the input type during declaration.

### Property Access

Properties in nested objects can be accessed using dot notation and elements in arrays can be accessed using the `[*]` operator.

The `[*]` operator, when chained with a dot and a property name, returns an array containing the value of the property for each element in the array.
The `[*]` operator also automatically flattens the result of chained `[*]` operators.

Object Reshaper also supports accessing single elements within arrays by referencing their index.

```ts
type User = {
  id: number;
  name: {
    first: string;
    last?: string;
  };
  contact: number[];
  posts: {
    title: string;
    tags: string[];
  }[];
};

const user: User = {
  id: 1,
  name: {
    first: "John",
  },
  contact: [12345678],
  posts: [
    { title: "Hello World", tags: ["hello", "world"] },
    { title: "My Second Post", tags: ["diary"] },
  ],
};
```

<table>
<tr>
<th>Path</th>
<th>Type</th>
<th>Value</th>
</tr>
<tr>
<td>

```ts
id
```

</td>
<td>

```ts
number
```

</td>
<td>

```ts
1
```

</td>

</tr>
<tr>
<td>

```ts
name
```

</td>
<td>

```ts
{
  first: string;
  last?: string;
}
```

</td>
<td>

```ts
{ first: "John" }
```

</td>
</tr>
<tr>
<td>

```ts
name.first
```

</td>
<td>

```ts
string
```

</td>
<td>

```ts
"John"
```

</td>
</tr>
<tr>
<td>

```ts
name.last
```

</td>
<td>

```ts
string | undefined
```

</td>
<td>

```ts
undefined
```

</td>
</tr>
<tr>
<td>

```ts
contact or contact[*]
```

</td>
<td>

```ts
number[]
```

</td>
<td>

```ts
[12345678]
```

</td>
</tr>
<tr>
<td>

```ts
contact[0]
```

</td>
<td>

```ts
number | undefined
```

</td>
<td>

```ts
12345678
```

</td>
</tr>
<tr>
<td>

```ts
contact[1]
```

</td>
<td>

```ts
number | undefined
```

</td>
<td>

```ts
undefined
```

</td>

</tr>
<tr>
<td>

```ts
posts or posts[*]
```

</td>
<td>

```ts
{
  title: string;
  tags: string[];
}[]
```

</td>
<td>

```ts
[
  {
    title: "Hello World",
    tags: ["hello", "world"],
  },
  {
    title: "My Second Post",
    tags: ["diary"],
  },
]
```

</td>
</tr>
<tr>
<td>

```ts
posts[*].title
```

</td>
<td>

```ts
string[]
```

</td>
<td>

```ts
["Hello World", "My Second Post"]
```

</td>
</tr>
<tr>
<td>

```ts
posts[*].tags
```

</td>
<td>

```ts
string[][]
```

</td>
<td>

```ts
[["hello", "world"], ["diary"]]
```

</td>
</tr>
<tr>
<td>

```ts
posts[*].tags[*]
```

</td>
<td>

```ts
string[]
```

</td>
<td>

```ts
["hello", "world", "diary"]
```

</td>
</tr>
</table>

_\*The above list is not exhaustive._

### Declaring Multidimensional or Nested Arrays

Object Reshaper also supports the creation of multidimensional or nested arrays using a 2-tuple syntax, `[<path>, <element definition>]`.

- The first element of the 2-tuple must be a path to the array containing elements to be iterated. _(Chained `[*]` operators are supported.)_
- The second element of the 2-tuple contains the definition of the elements in the array.
  - The second element may either be a path, a 2-tuple, or an object.
  - Paths within the element definition are relative to the array element being iterated.

```ts
const schema = {
  posts: ["posts[*]", { title: "title", category: "tags[0]" }],
} as const satisfies Schema<User>;

const reshaper = reshaperBuilder<User, typeof schema>(schema);
reshaper(user);
// => {
//      posts: [
//        { title: "Hello World", category: "hello" },
//        { title: "My Second Post", category: "diary" },
//      ],
//    }
```

## Examples

### Basic Usage

Renaming property names

```ts
import { reshaperBuilder, Schema } from "object-reshaper";

type Input = {
  id: number;
};
const schema = {
  new: "id",
} as const satisfies Schema<Input>;
const reshaper = reshaperBuilder<Input, typeof schema>(schema);
reshaper({ id: 1 }); // => { new: 1 } (Type: { new: number })
```

Extracting nested properties

```ts
import { reshaperBuilder, Schema } from "object-reshaper";

type Input = {
  user: {
    address: {
      street: string;
    };
  };
};
const schema = {
  street: "user.address.street",
} as const satisfies Schema<Input>;
const reshaper = reshaperBuilder<Input, typeof schema>(schema);
reshaper({ user: { address: { street: "home" } } }); // => { street: "home" } (Type: { street: string })
```

### Manipulating Arrays

Accessing array elements

```ts
import { reshaperBuilder, Schema } from "object-reshaper";

type Input = {
  data: number[];
};
const schema = {
  new: "data[0]",
} as const satisfies Schema<Input>;
const reshaper = reshaperBuilder<Input, typeof schema>(schema);
reshaper({ data: [1, 2, 3] }); // => { new: 1 } (Type: { new: number | undefined })
```

Extracting fields from array elements

```ts
import { reshaperBuilder, Schema } from "object-reshaper";

type Input = {
  array: { nested: { within: string } }[];
};
const schema = {
  new: "array[*].nested.within",
} as const satisfies Schema<Input>;
const reshaper = reshaperBuilder<Input, typeof schema>(schema);
reshaper({
  array: [{ nested: { within: "first" } }, { nested: { within: "second" } }],
}); // => { new: ["first", "second"] } (Type: { new: string[] })
```

Flattening nested arrays

```ts
import { reshaperBuilder, Schema } from "object-reshaper";

type Input = {
  data: { nested: number[] }[];
};
const schema = {
  new: "data[*].nested[*]",
} as const satisfies Schema<Input>;
const reshaper = reshaperBuilder<Input, typeof schema>(schema);
reshaper({ data: [{ nested: [1, 2] }, { nested: [3, 4] }] });
// => { new: [1,2,3,4] } (Type: { new: number[] })
```

### Transforming Objects Within Arrays

Flatten nested arrays and transform elements

```ts
import { reshaperBuilder, Schema } from "object-reshaper";

type Input = {
  data: { nested: { item: { id: number; name: string } }[] }[];
};
const schema = {
  new: [
    "data[*].nested[*]",
    {
      new: "item.id",
    },
  ],
} as const satisfies Schema<Input>;
const reshaper = reshaperBuilder<Input, typeof schema>(schema);
reshaper({
  data: [
    { nested: [{ item: { id: 1, name: "first" } }] },
    {
      nested: [{ item: { id: 2, name: "second" } }, { item: { id: 3, name: "third" } }],
    },
  ],
}); // => { new: [{ new: 1 }, { new: 2 }, { new: 3 }] } (Type: { new: { new: number }[] })
```

## Specification

### `undefined` & `null` Inputs

Object Reshaper supports `undefined` or `null` inputs and follows the same behaviour as the optional-chaining operator, `?.`, in JavaScript.

When using the `[*]` operator, `undefined` values are removed from the resulting array.

### Union Input Types (Experimental)

Object Reshaper has experimental support for input types that contain union types.

The current implementation supports most union types but has known limitations when dealing with arrays.

In particular, arrays containing objects of different types cannot be perfectly distinguished from each other at runtime,
resulting in an empty array always being returned, rather than `undefined`.

For example, the two different possible types of the `array` property cannot be distinguished at runtime since Object Reshaper
does not record the type of the input object for use during runtime. As a result, Object Reshaper cannot determine if the object
in the array is of type `{ id: number; a?: number }` or `{ id: number; b?: string }`, since both need not contain `a`.

```ts
type Input = {
  array: { id: number; a?: number }[] | { id: number; b?: string }[];
};

const schema = {
  new: "array[*].a",
} as const satisfies Schema<Input>;

const reshaper = reshaperBuilder<Input, typeof schema>(schema);
reshaper({ array: [{ id: 1, b: "hello world" }] }); // => { new: [] } (Type: { new: number[] })
```
