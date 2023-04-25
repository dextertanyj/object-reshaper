import { describe, expect, test } from "@jest/globals";

import { ReshapeError } from "../errors";
import { reshaperBuilder } from "../reshape";
import { Schema } from "../types";

describe("errors", () => {
  test("should throw error when field is not an object", () => {
    type Data = {
      id: { id: number };
    };
    const schema = {
      new: "id.id",
    } as const satisfies Schema<Data>;
    const reshaper = reshaperBuilder<Data, typeof schema>(schema);
    // @ts-expect-error access field on non-object field
    expect(() => reshaper({ id: 1 })).toThrowError(ReshapeError);
    // @ts-expect-error access field on non-object field
    expect(() => reshaper({ id: 1 })).toThrowError("FieldNotObject");
  });

  test("should throw error when field is missing", () => {
    type Data = {
      sub: number;
    };
    const schema = {
      new: "sub",
    } as const satisfies Schema<Data>;
    const reshaper = reshaperBuilder<Data, typeof schema>(schema);
    // @ts-expect-error access non-existent field
    expect(() => reshaper({ id: 1 })).toThrowError(ReshapeError);
    // @ts-expect-error access non-existent field
    expect(() => reshaper({ id: 1 })).toThrowError("MissingField");
  });

  test("should throw error when field is not an array", () => {
    type Data = {
      id: number[];
    };
    const schema = {
      new: "id[0]",
    } as const satisfies Schema<Data>;
    const reshaper = reshaperBuilder<Data, typeof schema>(schema);
    // @ts-expect-error access index on non-array field
    expect(() => reshaper({ id: 1 })).toThrowError(ReshapeError);
    // @ts-expect-error access index on non-array field
    expect(() => reshaper({ id: 1 })).toThrowError("FieldNotArray");
  });

  test("should throw error when array index is out of bounds", () => {
    type Data = {
      id: number[];
    };
    const schema = {
      new: "id[10]",
    } as const satisfies Schema<Data>;
    const reshaper = reshaperBuilder<Data, typeof schema>(schema);
    expect(() => reshaper({ id: [1, 2, 3] })).toThrowError(ReshapeError);
    expect(() => reshaper({ id: [1, 2, 3] })).toThrowError(
      "ArrayIndexOutOfBounds"
    );
  });

  test("should throw error when creating array from non-array field", () => {
    type Data = {
      sub: { id: number }[];
    };
    const schema = {
      new: [
        "sub[*]",
        {
          new: "id",
        },
      ],
    } as const satisfies Schema<Data>;
    const reshaper = reshaperBuilder<Data, typeof schema>(schema);
    // @ts-expect-error creating array from non-array field
    expect(() => reshaper({ sub: 1 })).toThrowError(ReshapeError);
    // @ts-expect-error creating array from non-array field
    expect(() => reshaper({ sub: 1 })).toThrowError("FieldNotArray");
  });

  test("should throw error when creating array from array of non-objects", () => {
    type Data = {
      sub: { id: number }[];
    };
    const schema = {
      new: [
        "sub[*]",
        {
          new: "id",
        },
      ],
    } as const satisfies Schema<Data>;
    const reshaper = reshaperBuilder<Data, typeof schema>(schema);
    // @ts-expect-error creating array from array of non-objects
    expect(() => reshaper({ sub: [1, 2, 3] })).toThrowError(ReshapeError);
    // @ts-expect-error creating array from array of non-objects
    expect(() => reshaper({ sub: [1, 2, 3] })).toThrowError("FieldNotObject");
  });
});
