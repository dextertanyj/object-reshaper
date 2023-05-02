import { describe, expect, test } from "@jest/globals";

import { ExpectEqual } from "./utilities";

import { reshaperBuilder, Schema } from "@";

describe("objects", () => {
  describe("simple objects", () => {
    test("should return field", () => {
      type Data = {
        id: number;
      };
      const data: Data = {
        id: 1,
      };
      const schema = {
        new: "id",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number;
      };
      const expected: Expected = {
        new: data.id,
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return undefined when field is undefined", () => {
      type Data = {
        id?: number;
      };
      const data: Data = {
        id: undefined,
      };
      const schema = {
        new: "id",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number | undefined;
      };
      const expected: Expected = {
        new: data.id,
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return null when field is null", () => {
      type Data = {
        id: number | null;
      };
      const data: Data = {
        id: null,
      };
      const schema = {
        new: "id",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number | null;
      };
      const expected: Expected = {
        new: data.id,
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });
  });

  describe("nested objects", () => {
    test("should return inner field", () => {
      type Data = {
        outer: {
          id: number;
        };
      };
      const data: Data = {
        outer: {
          id: 1,
        },
      };
      const schema = {
        new: "outer.id",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number;
      };
      const expected: Expected = {
        new: data.outer.id,
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should create inner field", () => {
      type Data = {
        id: number;
      };
      const data: Data = {
        id: 1,
      };
      const schema = {
        newouter: {
          newinner: "id",
        },
      } as const satisfies Schema<Data>;

      type Expected = {
        newouter: {
          newinner: number;
        };
      };
      const expected: Expected = {
        newouter: { newinner: data.id },
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];
    });

    test("should return undefined when outer object is undefined", () => {
      type Data = {
        outer?: {
          id: number;
        };
      };
      const data: Data = {
        outer: undefined,
      };
      const schema = {
        new: "outer.id",
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

      // Defined test
      const dataDefined: Data = {
        outer: { id: 1 },
      };
      const expectedDefined: Expected = {
        new: 1,
      };
      const resultDefined: Expected = reshaper(dataDefined);
      expect(resultDefined).toEqual(expectedDefined);
    });

    test("should return undefined when inner field is undefined", () => {
      type Data = {
        outer: {
          id?: number;
        };
      };
      const data: Data = {
        outer: {
          id: undefined,
        },
      };
      const schema = {
        new: "outer.id",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number | undefined;
      };
      const expected: Expected = {
        new: data.outer.id,
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];

      // Defined test
      const dataDefined: Data = {
        outer: { id: 1 },
      };
      const expectedDefined: Expected = {
        new: 1,
      };
      const resultDefined: Expected = reshaper(dataDefined);
      expect(resultDefined).toEqual(expectedDefined);
    });

    test("should return undefined when outer object is null", () => {
      type Data = {
        outer: {
          id: number;
        } | null;
      };
      const data: Data = {
        outer: null,
      };
      const schema = {
        new: "outer.id",
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

      // Defined test
      const dataDefined: Data = {
        outer: { id: 1 },
      };
      const expectedDefined: Expected = {
        new: 1,
      };
      const resultDefined: Expected = reshaper(dataDefined);
      expect(resultDefined).toEqual(expectedDefined);
    });

    test("should return null when inner field is null", () => {
      type Data = {
        outer: {
          id: number | null;
        };
      };
      const data: Data = {
        outer: {
          id: null,
        },
      };
      const schema = {
        new: "outer.id",
      } as const satisfies Schema<Data>;

      type Expected = {
        new: number | null;
      };
      const expected: Expected = {
        new: data.outer.id,
      };

      const reshaper = reshaperBuilder<Data, typeof schema>(schema);
      const result: Expected = reshaper(data);
      expect(result).toEqual(expected);

      const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
      [typecheck];

      // Defined test
      const dataDefined: Data = {
        outer: { id: 1 },
      };
      const expectedDefined: Expected = {
        new: 1,
      };
      const resultDefined: Expected = reshaper(dataDefined);
      expect(resultDefined).toEqual(expectedDefined);
    });
  });
});
