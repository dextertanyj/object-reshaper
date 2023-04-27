import { describe, expect, test } from "@jest/globals";

import { reshaperBuilder } from "../reshape";
import { Schema } from "../types/schema";

describe("invalid inputs", () => {
  test("should not fail for non-existent field", () => {
    type Data = {
      id: number;
    };
    const schema = {
      new: "id",
    } as const satisfies Schema<Data>;
    const reshaper = reshaperBuilder<Data, typeof schema>(schema);
    // @ts-expect-error id is not a field of input
    expect(() => reshaper({ other: 1 })).not.toThrow();
  });

  test("should not fail for field that is not object", () => {
    type Data = {
      id: {
        name: string;
      };
    };
    const schema = {
      new: "id.name",
    } as const satisfies Schema<Data>;
    const reshaper = reshaperBuilder<Data, typeof schema>(schema);
    // @ts-expect-error id is not a field of input
    expect(() => reshaper({ id: "string" })).not.toThrow();
  });

  test("should not fail for field that is not array", () => {
    type Data = {
      id: string[];
    };
    const schema = {
      new: "id[0]",
    } as const satisfies Schema<Data>;
    const reshaper = reshaperBuilder<Data, typeof schema>(schema);
    // @ts-expect-error id is not a field of input
    expect(() => reshaper({ id: "string" })).not.toThrow();
  });

  test("should not fail for non-object elements in mapped array creation", () => {
    type Data = {
      id: { name: string }[];
    };
    const schema = {
      new: ["id[*]", { new: "name" }],
    } as const satisfies Schema<Data>;
    const reshaper = reshaperBuilder<Data, typeof schema>(schema);
    // @ts-expect-error id is not a field of input
    expect(() => reshaper({ id: ["string"] })).not.toThrow();
  });
});
