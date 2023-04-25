# Object Reshaper

[![CI](https://github.com/dextertanyj/object-reshaper/actions/workflows/ci.yml/badge.svg)](https://github.com/dextertanyj/object-reshaper/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/dextertanyj/object-reshaper/badge.svg?branch=master)](https://coveralls.io/github/dextertanyj/object-reshaper?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/dextertanyj/object-reshaper/badge.svg)](https://snyk.io/test/github/dextertanyj/object-reshaper)

TypeScript-first schema-based object transformation.

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
reshaper({ user: { address: { street: "home" } } }); // => { new: "home" } (Type: { new: string })
```
