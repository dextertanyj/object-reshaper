# Object Reshaper

[![CI](https://github.com/dextertanyj/object-reshaper/actions/workflows/ci.yml/badge.svg)](https://github.com/dextertanyj/object-reshaper/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/dextertanyj/object-reshaper/badge.svg?branch=master)](https://coveralls.io/github/dextertanyj/object-reshaper?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/dextertanyj/object-reshaper/badge.svg)](https://snyk.io/test/github/dextertanyj/object-reshaper)

TypeScript-first schema-based object transformation.

## Introduction

Object Reshaper provides a type safe interface for transforming objects using a schema, allowing users to easily transform objects without having to write boilerplate code.
It supports renaming fields, extracting nested objects, and flattening nested arrays.
Simply define a schema that describes the desired output using dot notation and Object Reshaper will generate a function that transforms input objects into the desired shape.

> :warning: **What Object Reshaper is not**
>
> Object Reshaper is not a replacement for existing object validation libraries.
> In fact, it is strongly recommended that any inputs from users or external sources be validated before being passed to Object Reshaper.
> Object Reshaper does not perform any validation of object properties at runtime and supplying any inputs that do not conform to the expected type will result in undefined behaviour.

## Installation

### Requirements

- TypeScript 4.9+

```sh
$ npm install object-reshaper
```

## Basic Usage

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

## Manipulating Arrays

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

_Support for multidimensional arrays coming soon_

## Transforming Objects Within Arrays

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
      nested: [
        { item: { id: 2, name: "second" } },
        { item: { id: 3, name: "third" } },
      ],
    },
  ],
}); // => { new: [{ new: 1 }, { new: 2 }, { new: 3 }] } (Type: { new: { new: number }[] })
```
