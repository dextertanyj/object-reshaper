import { describe, expect, test } from "@jest/globals";

import { reshaperBuilder } from "../reshape";
import { Schema } from "../types/schema";

describe("reshape (null inputs)", () => {
  describe("basic objects", () => {
    test("should copy null values", () => {
      const data: {
        id: number | null;
      } = {
        id: null,
      };
      const schema = {
        new: "id",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: number | null;
      } = {
        new: null,
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should not fail if parent object is null", () => {
      const data: {
        sub: {
          id: number;
        } | null;
      } = {
        sub: null,
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
    test("should not fail if element array is null", () => {
      const data: {
        array: number[] | null;
      } = {
        array: null,
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

    test("should not fail if object array is null", () => {
      const data: {
        array:
          | {
              id: number;
            }[]
          | null;
      } = {
        array: null,
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

    test("should not fail if array element is null", () => {
      const data: {
        array: (number | null)[];
      } = {
        array: [null, 1],
      };
      const schema = {
        new: "array[*]",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: (number | null)[];
      } = {
        new: [null, 1],
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should not fail if array object is null", () => {
      const data: {
        array: ({
          id: number;
        } | null)[];
      } = {
        array: [null, { id: 1 }],
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

    test("should not fail if field in array object is null", () => {
      const data: {
        array: {
          id: number | null;
        }[];
      } = {
        array: [{ id: null }, { id: 1 }],
      };
      const schema = {
        new: "array[*].id",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: (number | null)[];
      } = {
        new: [null, 1],
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
    test("should not fail if primary array is null", () => {
      const data: {
        array:
          | {
              subarray: number[];
            }[]
          | null;
      } = {
        array: null,
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

    test("should not fail if secondary array is partially null", () => {
      const data: {
        array: {
          subarray: number[] | null;
        }[];
      } = {
        array: [{ subarray: null }, { subarray: [1] }],
      };
      const schema = {
        new: "array[*].subarray",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: (number[] | null)[];
      } = {
        new: [null, [1]],
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should not fail if element in secondary array is null", () => {
      const data: {
        array: {
          subarray: (number | null)[] | null;
        }[];
      } = {
        array: [{ subarray: null }, { subarray: [null] }],
      };
      const schema = {
        new: "array[*].subarray",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: ((number | null)[] | null)[];
      } = {
        new: [null, [null]],
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should not fail if both arrays can be null", () => {
      const data: {
        array:
          | {
              subarray: number[] | null;
            }[]
          | null;
      } = {
        array: null,
      };
      const schema = {
        new: "array[*].subarray",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: (number[] | null)[] | undefined;
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
    test("should not fail if primary array is null", () => {
      const data: {
        array:
          | {
              subarray: number[];
            }[]
          | null;
      } = {
        array: null,
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

    test("should not fail if secondary array is partially null", () => {
      const data: {
        array: {
          subarray: number[] | null;
        }[];
      } = {
        array: [{ subarray: null }, { subarray: [1] }],
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

    test("should not fail if element in secondary array is null", () => {
      const data: {
        array: {
          subarray: (number | null)[] | null;
        }[];
      } = {
        array: [{ subarray: null }, { subarray: [null] }],
      };
      const schema = {
        new: "array[*].subarray[*]",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: (number | null)[];
      } = {
        new: [null],
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should not fail if both arrays can be null", () => {
      const data: {
        array:
          | {
              subarray: number[] | null;
            }[]
          | null;
      } = {
        array: null,
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
    test("should not fail if primary array is null", () => {
      const data: {
        array:
          | {
              subarray:
                | {
                    subsubarray: number[];
                  }[]
                | null;
            }[]
          | null;
      } = {
        array: null,
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

    test("should not fail if secondary array is partially null", () => {
      const data: {
        array: {
          subarray:
            | {
                subsubarray: number[];
              }[]
            | null;
        }[];
      } = {
        array: [{ subarray: null }, { subarray: [{ subsubarray: [1] }] }],
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
});
