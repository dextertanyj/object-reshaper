import { describe, expect, test } from "@jest/globals";

import { reshaperBuilder } from "../reshape";
import { Schema } from "../types/schema";

describe("reshape (undefined inputs)", () => {
  describe("basic objects", () => {
    test("should copy undefined values", () => {
      const data: {
        id?: number;
      } = {
        id: undefined,
      };
      const schema = {
        new: "id",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: number | undefined;
      } = {
        new: undefined,
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should not fail if parent object is undefined", () => {
      const data: {
        sub?: {
          id: number;
        };
      } = {
        sub: undefined,
      };
      const schema = {
        new: "sub.id",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: number | undefined;
      } = {
        new: undefined,
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });
  });

  describe("simple arrays", () => {
    test("should not fail if element array is undefined", () => {
      const data: {
        array?: number[];
      } = {
        array: undefined,
      };
      const schema = {
        new: "array[*]",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: number[] | undefined;
      } = {
        new: undefined,
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should not fail if object array is undefined", () => {
      const data: {
        array?: {
          id: number;
        }[];
      } = {
        array: undefined,
      };
      const schema = {
        new: "array[*].id",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: number[] | undefined;
      } = {
        new: undefined,
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should not fail if array element is undefined", () => {
      const data: {
        array: (number | undefined)[];
      } = {
        array: [undefined, 1],
      };
      const schema = {
        new: "array[*]",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: number[];
      } = {
        new: [1],
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should not fail if array object is undefined", () => {
      const data: {
        array: (
          | {
              id: number;
            }
          | undefined
        )[];
      } = {
        array: [undefined, { id: 1 }],
      };
      const schema = {
        new: "array[*].id",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: number[];
      } = {
        new: [1],
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should not fail if field in array object is undefined", () => {
      const data: {
        array: {
          id?: number;
        }[];
      } = {
        array: [{ id: undefined }, { id: 1 }],
      };
      const schema = {
        new: "array[*].id",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: number[];
      } = {
        new: [1],
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should not fail on out of bounds access", () => {
      const data = {
        sub: {
          array: [{ id: 1 }, { id: 2 }],
        },
      };
      const schema = {
        new: "sub.array[10].id",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: number | undefined;
      } = {
        new: undefined,
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });
  });

  describe("secondary arrays", () => {
    test("should not fail if primary array is undefined", () => {
      const data: {
        array?: {
          subarray: number[];
        }[];
      } = {
        array: undefined,
      };
      const schema = {
        new: "array[*].subarray",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: number[][] | undefined;
      } = {
        new: undefined,
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should not fail if secondary array is partially undefined", () => {
      const data: {
        array: {
          subarray?: number[];
        }[];
      } = {
        array: [{ subarray: undefined }, { subarray: [1] }],
      };
      const schema = {
        new: "array[*].subarray",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: number[][];
      } = {
        new: [[1]],
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should not fail if element in secondary array is undefined", () => {
      const data: {
        array: {
          subarray?: (number | undefined)[];
        }[];
      } = {
        array: [{ subarray: undefined }, { subarray: [undefined] }],
      };
      const schema = {
        new: "array[*].subarray",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: (number | undefined)[][];
      } = {
        new: [[undefined]],
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should not fail if both arrays can be undefined", () => {
      const data: {
        array?: {
          subarray?: number[];
        }[];
      } = {
        array: undefined,
      };
      const schema = {
        new: "array[*].subarray",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: number[][] | undefined;
      } = {
        new: undefined,
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });
  });

  describe("secondary arrays with flattening", () => {
    test("should not fail if primary array is undefined", () => {
      const data: {
        array?: {
          subarray: number[];
        }[];
      } = {
        array: undefined,
      };
      const schema = {
        new: "array[*].subarray[*]",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: number[] | undefined;
      } = {
        new: undefined,
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should not fail if secondary array is partially undefined", () => {
      const data: {
        array: {
          subarray?: number[];
        }[];
      } = {
        array: [{ subarray: undefined }, { subarray: [1] }],
      };
      const schema = {
        new: "array[*].subarray[*]",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: number[];
      } = {
        new: [1],
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should not fail if element in secondary array is undefined", () => {
      const data: {
        array: {
          subarray?: (number | undefined)[];
        }[];
      } = {
        array: [{ subarray: undefined }, { subarray: [undefined] }],
      };
      const schema = {
        new: "array[*].subarray[*]",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: number[];
      } = {
        new: [],
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should not fail if both arrays can be undefined", () => {
      const data: {
        array?: {
          subarray?: number[];
        }[];
      } = {
        array: undefined,
      };
      const schema = {
        new: "array[*].subarray[*]",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: number[] | undefined;
      } = {
        new: undefined,
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });
  });

  describe("tertiary arrays", () => {
    test("should not fail if primary array is undefined", () => {
      const data: {
        array?: {
          subarray?: {
            subsubarray: number[];
          }[];
        }[];
      } = {
        array: undefined,
      };
      const schema = {
        new: "array[*].subarray[*].subsubarray",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: number[][] | undefined;
      } = {
        new: undefined,
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should not fail if secondary array is partially undefined", () => {
      const data: {
        array: {
          subarray?: {
            subsubarray: number[];
          }[];
        }[];
      } = {
        array: [{ subarray: undefined }, { subarray: [{ subsubarray: [1] }] }],
      };
      const schema = {
        new: "array[*].subarray[*].subsubarray[*]",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: number[];
      } = {
        new: [1],
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });
  });

  describe("array creation", () => {
    test("should not fail if object field in array is undefined", () => {
      const data: {
        array: {
          id?: number;
        }[];
      } = {
        array: [{ id: undefined }, { id: 2 }],
      };
      const schema = {
        new: [
          "array[*]",
          {
            new: "id",
          },
        ],
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: { new: number | undefined }[];
      } = {
        new: [{ new: undefined }, { new: 2 }],
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should not fail if array is undefined", () => {
      const data: {
        array?: {
          id?: number;
        }[];
      } = {
        array: undefined,
      };
      const schema = {
        new: [
          "array[*]",
          {
            new: "id",
          },
        ],
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: { new: number | undefined }[] | undefined;
      } = {
        new: undefined,
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should not fail if object field in array is undefined", () => {
      const data: {
        array?:
          | (
              | {
                  id?: {
                    subarray?: { id: number }[];
                  };
                }
              | undefined
            )[]
          | undefined;
      } = {
        array: [
          undefined,
          { id: undefined },
          { id: { subarray: [{ id: 1 }] } },
        ],
      };
      const schema = {
        new: [
          "array[*]",
          {
            inner: "id.subarray[*].id",
          },
        ],
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: { inner: number[] | undefined }[] | undefined;
      } = {
        new: [{ inner: undefined }, { inner: [1] }],
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });
  });
});
