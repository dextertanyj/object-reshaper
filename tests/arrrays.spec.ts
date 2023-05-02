import { describe, expect, test } from "@jest/globals";

import { ExpectEqual } from "./utilities";

import { reshaperBuilder, Schema } from "@";

describe("arrays", () => {
  describe("primitive arrays", () => {
    test("should return array", () => {
      type Data = {
        array: number[];
      };
      const data: Data = {
        array: [1, 2, 3],
      };
      const schema = {
        new: "array",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: data.array,
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should filter optional values when using [*] syntax", () => {
      type Data = {
        array: (number | undefined)[];
      };
      const data: Data = {
        array: [1, undefined, 2],
      };
      const schema = {
        new: "array[*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: [1, 2],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should not filter null values when using [*] syntax", () => {
      type Data = {
        array: (number | null)[];
      };
      const data: Data = {
        array: [1, null, 2],
      };
      const schema = {
        new: "array[*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: (number | null)[];
      };
      const expected: Expected = {
        new: [1, null, 2],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return undefined when using [*] syntax on undefined array", () => {
      type Data = {
        array?: number[];
      };
      const data: Data = {
        array: undefined,
      };
      const schema = {
        new: "array[*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[] | undefined;
      };
      const expected: Expected = {
        new: undefined,
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return undefined when using [*] syntax on null array", () => {
      type Data = {
        array: number[] | null;
      };
      const data: Data = {
        array: null,
      };
      const schema = {
        new: "array[*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[] | undefined;
      };
      const expected: Expected = {
        new: undefined,
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return value when given index", () => {
      type Data = {
        array: number[] | null;
      };
      const data: Data = {
        array: [1, 2, 3],
      };
      const schema = {
        new: "array[1]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number | undefined;
      };
      const expected: Expected = {
        new: 2,
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return undefined when given out of bounds index", () => {
      type Data = {
        array: number[] | null;
      };
      const data: Data = {
        array: [1, 2, 3],
      };
      const schema = {
        new: "array[10]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number | undefined;
      };
      const expected: Expected = {
        new: undefined,
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });
  });

  describe("object arrays", () => {
    test("should return array of values", () => {
      type Data = {
        array: { id: number }[];
      };
      const data: Data = {
        array: [{ id: 1 }, { id: 2 }, { id: 3 }],
      };
      const schema = {
        new: "array[*].id",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: [1, 2, 3],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should filter optional objects when using [*] syntax", () => {
      type Data = {
        array: ({ id: number } | undefined)[];
      };
      const data: Data = {
        array: [{ id: 1 }, undefined, { id: 2 }],
      };
      const schema = {
        new: "array[*].id",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: [1, 2],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should filter null objects when using [*] syntax", () => {
      type Data = {
        array: ({ id: number } | null)[];
      };
      const data: Data = {
        array: [{ id: 1 }, null, { id: 2 }],
      };
      const schema = {
        new: "array[*].id",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: [1, 2],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should filter undefined values when using [*] syntax", () => {
      type Data = {
        array: { id: number | undefined }[];
      };
      const data: Data = {
        array: [{ id: 1 }, { id: undefined }, { id: 2 }],
      };
      const schema = {
        new: "array[*].id",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: [1, 2],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should not filter null values when using [*] syntax", () => {
      type Data = {
        array: { id: number | null }[];
      };
      const data: Data = {
        array: [{ id: 1 }, { id: null }, { id: 2 }],
      };
      const schema = {
        new: "array[*].id",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: (number | null)[];
      };
      const expected: Expected = {
        new: [1, null, 2],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return undefined when using [*] syntax on undefined array", () => {
      type Data = {
        array?: { id: number }[];
      };
      const data: Data = {
        array: undefined,
      };
      const schema = {
        new: "array[*].id",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[] | undefined;
      };
      const expected: Expected = {
        new: undefined,
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return undefined when using [*] syntax on null array", () => {
      type Data = {
        array: { id: number }[] | null;
      };
      const data: Data = {
        array: null,
      };
      const schema = {
        new: "array[*].id",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[] | undefined;
      };
      const expected: Expected = {
        new: undefined,
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });
  });

  describe("nested arrays", () => {
    test("should flatten nested array with [*] syntax", () => {
      type Data = {
        array: { nested: number[] }[];
      };
      const data: Data = {
        array: [{ nested: [1, 2] }, { nested: [3, 4] }],
      };
      const schema = {
        new: "array[*].nested[*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: [1, 2, 3, 4],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return undefined when outer array is undefined", () => {
      type Data = {
        array?: { nested: number[] }[];
      };
      const data: Data = {
        array: undefined,
      };
      const schema = {
        new: "array[*].nested[*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[] | undefined;
      };
      const expected: Expected = {
        new: undefined,
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return undefined when outer array is null", () => {
      type Data = {
        array: { nested: number[] }[] | null;
      };
      const data: Data = {
        array: null,
      };
      const schema = {
        new: "array[*].nested[*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[] | undefined;
      };
      const expected: Expected = {
        new: undefined,
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return empty array when all inner arrays are undefined", () => {
      type Data = {
        array: { nested?: number[] }[];
      };
      const data: Data = {
        array: [{ nested: undefined }],
      };
      const schema = {
        new: "array[*].nested[*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: [],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return empty array when all inner arrays are null", () => {
      type Data = {
        array: { nested: number[] | null }[];
      };
      const data: Data = {
        array: [{ nested: null }],
      };
      const schema = {
        new: "array[*].nested[*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: [],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should ignore undefined inner arrays", () => {
      type Data = {
        array: { nested?: number[] }[];
      };
      const data: Data = {
        array: [{ nested: undefined }, { nested: [1] }],
      };
      const schema = {
        new: "array[*].nested[*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: [1],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should ignore null inner arrays", () => {
      type Data = {
        array: { nested: number[] | null }[];
      };
      const data: Data = {
        array: [{ nested: null }, { nested: [1] }],
      };
      const schema = {
        new: "array[*].nested[*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: [1],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return empty array if outer array contains no elements", () => {
      type Data = {
        array: { nested: number[] }[];
      };
      const data: Data = {
        array: [],
      };
      const schema = {
        new: "array[*].nested[*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: [],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return empty array if inner array contains no elements", () => {
      type Data = {
        array: { nested: number[] }[];
      };
      const data: Data = {
        array: [{ nested: [] }],
      };
      const schema = {
        new: "array[*].nested[*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: [],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should filter undefined from outer array", () => {
      type Data = {
        array: ({ nested: number[] } | undefined)[];
      };
      const data: Data = {
        array: [undefined, { nested: [1, 2, 3] }],
      };
      const schema = {
        new: "array[*].nested[*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: [1, 2, 3],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should filter null from outer array", () => {
      type Data = {
        array: ({ nested: number[] } | null)[];
      };
      const data: Data = {
        array: [null, { nested: [1, 2, 3] }],
      };
      const schema = {
        new: "array[*].nested[*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: [1, 2, 3],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should not flatten array without [*] syntax", () => {
      type Data = {
        array: { nested: number[] }[];
      };
      const data: Data = {
        array: [{ nested: [1, 2, 3] }],
      };
      const schema = {
        new: "array[*].nested",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[][];
      };
      const expected: Expected = {
        new: [[1, 2, 3]],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });
  });

  describe("multidimensional arrays", () => {
    test("should flatten multidimensional array with [*] syntax", () => {
      type Data = {
        array: number[][];
      };
      const data: Data = {
        array: [
          [1, 2],
          [3, 4],
        ],
      };
      const schema = {
        new: "array[*][*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: [1, 2, 3, 4],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return undefined when outer array is undefined", () => {
      type Data = {
        array?: number[][];
      };
      const data: Data = {
        array: undefined,
      };
      const schema = {
        new: "array[*][*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[] | undefined;
      };
      const expected: Expected = {
        new: undefined,
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return undefined when outer array is null", () => {
      type Data = {
        array: number[][] | null;
      };
      const data: Data = {
        array: null,
      };
      const schema = {
        new: "array[*][*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[] | undefined;
      };
      const expected: Expected = {
        new: undefined,
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return empty array when all inner arrays are undefined", () => {
      type Data = {
        array: (number[] | undefined)[];
      };
      const data: Data = {
        array: [undefined],
      };
      const schema = {
        new: "array[*][*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: [],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return empty array when all inner arrays are null", () => {
      type Data = {
        array: (number[] | null)[];
      };
      const data: Data = {
        array: [null],
      };
      const schema = {
        new: "array[*][*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: [],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should ignore undefined inner arrays", () => {
      type Data = {
        array: (number[] | undefined)[];
      };
      const data: Data = {
        array: [undefined, [1]],
      };
      const schema = {
        new: "array[*][*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: [1],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should ignore null inner arrays", () => {
      type Data = {
        array: (number[] | null)[];
      };
      const data: Data = {
        array: [null, [1]],
      };
      const schema = {
        new: "array[*][*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: [1],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return empty array if outer array contains no elements", () => {
      type Data = {
        array: number[][];
      };
      const data: Data = {
        array: [],
      };
      const schema = {
        new: "array[*][*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: [],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return empty array if inner array contains no elements", () => {
      type Data = {
        array: number[][];
      };
      const data: Data = {
        array: [[]],
      };
      const schema = {
        new: "array[*][*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[];
      };
      const expected: Expected = {
        new: [],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should not flatten array without [*] syntax", () => {
      type Data = {
        array: number[][];
      };
      const data: Data = {
        array: [[1, 2, 3]],
      };
      const schema = {
        new: "array[*]",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[][];
      };
      const expected: Expected = {
        new: [[1, 2, 3]],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });
  });
});
