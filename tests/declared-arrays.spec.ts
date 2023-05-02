import { describe, expect, test } from "@jest/globals";

import { ExpectEqual } from "./utilities";

import { reshaperBuilder, Schema } from "@";

describe("declared arrays", () => {
  describe("element array", () => {
    test("should create array of values", () => {
      type Data = {
        array: { id: number }[];
      };
      const data: Data = {
        array: [{ id: 1 }, { id: 2 }, { id: 3 }],
      };
      const schema = {
        new: ["array[*]", "id"],
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

    test("should flatten multidimensional primitive array", () => {
      type Data = {
        array: number[][][];
      };
      const data: Data = {
        array: [[[1], [2]], [[3, 4]]],
      };
      const schema = {
        new: ["array[*]", "[*][*]"],
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[][];
      };
      const expected: Expected = {
        new: [
          [1, 2],
          [3, 4],
        ],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should access multidimensional object array", () => {
      type Data = {
        array: { id: number }[][];
      };
      const data: Data = {
        array: [
          [{ id: 1 }, { id: 2 }],
          [{ id: 3 }, { id: 4 }],
        ],
      };
      const schema = {
        new: ["array[*]", "[*].id"],
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[][];
      };
      const expected: Expected = {
        new: [
          [1, 2],
          [3, 4],
        ],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return undefined if outer array is undefined", () => {
      type Data = {
        array?: { id: number }[];
      };
      const data: Data = {
        array: undefined,
      };
      const schema = {
        new: ["array[*]", "id"],
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

    test("should return undefined if outer array is null", () => {
      type Data = {
        array: { id: number }[] | null;
      };
      const data: Data = {
        array: null,
      };
      const schema = {
        new: ["array[*]", "id"],
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

    test("should ignore undefined inner arrays", () => {
      type Data = {
        array: (number[] | undefined)[];
      };
      const data: Data = {
        array: [[1], undefined, [2]],
      };
      const schema = {
        new: ["array[*]", "[*]"],
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[][];
      };
      const expected: Expected = {
        new: [[1], [2]],
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
        array: [[1], null, [2]],
      };
      const schema = {
        new: ["array[*]", "[*]"],
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[][];
      };
      const expected: Expected = {
        new: [[1], [2]],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });
  });

  describe("object array", () => {
    test("should return array of objects", () => {
      type Data = {
        array: { id: number }[];
      };
      const data: Data = {
        array: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
      };
      const schema = {
        new: [
          "array[*]",
          {
            element: "id",
          },
        ],
      } as const satisfies Schema<Data>;

      type Expected = {
        new: { element: number }[];
      };
      const expected: Expected = {
        new: [{ element: 1 }, { element: 2 }, { element: 3 }, { element: 4 }],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return array of objects containing declared arrays", () => {
      type Data = {
        array: { nested: { id: number }[] }[];
      };
      const data: Data = {
        array: [{ nested: [{ id: 1 }, { id: 2 }] }, { nested: [{ id: 3 }, { id: 4 }] }],
      };
      const schema = {
        new: [
          "array[*]",
          {
            nested: ["nested[*]", "id"],
          },
        ],
      } as const satisfies Schema<Data>;

      type Expected = {
        new: { nested: number[] }[];
      };
      const expected: Expected = {
        new: [{ nested: [1, 2] }, { nested: [3, 4] }],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return array of objects containing nested object", () => {
      type Data = {
        array: { id: number }[];
      };
      const data: Data = {
        array: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
      };
      const schema = {
        new: [
          "array[*]",
          {
            nested: { element: "id" },
          },
        ],
      } as const satisfies Schema<Data>;

      type Expected = {
        new: { nested: { element: number } }[];
      };
      const expected: Expected = {
        new: [
          { nested: { element: 1 } },
          { nested: { element: 2 } },
          { nested: { element: 3 } },
          { nested: { element: 4 } },
        ],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });
  });

  describe("multidimensional array", () => {
    test("should return two dimensional array", () => {
      type Data = {
        array: { id: number }[][];
      };
      const data: Data = {
        array: [[{ id: 1 }], [{ id: 2 }], [{ id: 3 }, { id: 4 }]],
      };
      const schema = {
        new: ["array[*]", ["[*]", "id"]],
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number[][];
      };
      const expected: Expected = {
        new: [[1], [2], [3, 4]],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return two dimensional array of objects", () => {
      type Data = {
        array: { id: number }[][];
      };
      const data: Data = {
        array: [[{ id: 1 }], [{ id: 2 }], [{ id: 3 }, { id: 4 }]],
      };
      const schema = {
        new: ["array[*]", ["[*]", { element: "id" }]],
      } as const satisfies Schema<Data>;

      type Expected = {
        new: { element: number }[][];
      };
      const expected: Expected = {
        new: [[{ element: 1 }], [{ element: 2 }], [{ element: 3 }, { element: 4 }]],
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });
  });
});
