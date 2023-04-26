import { describe, expect, test } from "@jest/globals";

import { reshaperBuilder } from "../reshape";
import { Schema } from "../types";

describe("reshape", () => {
  describe("direct field access", () => {
    test("should rename field", () => {
      const data = {
        id: 1,
      };
      const schema = {
        new: "id",
      } as const satisfies Schema<typeof data>;
      const expected = {
        new: data.id,
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      expect(result).toEqual(expected);
    });

    test("should hoist inner field", () => {
      const data = {
        sub: {
          id: 1,
        },
      };
      const schema = {
        new: "sub.id",
      } as const satisfies Schema<typeof data>;
      const expected = {
        new: data.sub.id,
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      expect(result).toEqual(expected);
    });

    test("should hoist inner array", () => {
      const data = {
        sub: {
          array: [1, 2, 3],
        },
      };
      const schema = {
        new: "sub.array",
      } as const satisfies Schema<typeof data>;
      const expected = {
        new: data.sub.array,
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      expect(result).toEqual(expected);
    });

    test("should hoist inner array with [*] syntax", () => {
      const data = {
        sub: {
          array: [1, 2, 3],
        },
      };
      const schema = {
        new: "sub.array[*]",
      } as const satisfies Schema<typeof data>;
      const expected = {
        new: data.sub.array,
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      expect(result).toEqual(expected);
    });

    test("should support declaring new inner fields", () => {
      const data = {
        sub: {
          array: [1, 2, 3],
        },
      };
      const schema = {
        new: {
          new: "sub.array",
        },
      } as const satisfies Schema<typeof data>;
      const expected = {
        new: { new: data.sub.array },
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });
  });

  describe("array access", () => {
    test("should extract inner array element", () => {
      const data = {
        sub: {
          array: [1, 2],
        },
      };
      const schema = {
        new: "sub.array[0]",
      } as const satisfies Schema<typeof data>;
      const expected = {
        new: data.sub.array[0],
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should extract inner array object", () => {
      const data = {
        sub: {
          array: [{ id: 1 }, { id: 2 }],
        },
      };
      const schema = {
        new: "sub.array[0]",
      } as const satisfies Schema<typeof data>;
      const expected = {
        new: data.sub.array[0],
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should extract non-first inner array element", () => {
      const data = {
        sub: {
          array: [{ id: 1 }, { id: 2 }],
        },
      };
      const schema = {
        new: "sub.array[1]",
      } as const satisfies Schema<typeof data>;
      const expected = {
        new: data.sub.array[1],
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should access property in array element", () => {
      const data = {
        sub: {
          array: [{ id: 1 }, { id: 2 }],
        },
      };
      const schema = {
        new: "sub.array[0].id",
      } as const satisfies Schema<typeof data>;
      const expected: {
        new: number | undefined;
      } = {
        new: data.sub.array[0].id,
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });
  });

  describe("direct array mapping", () => {
    test("should map array", () => {
      const data = {
        sub: {
          array: [{ sub: { subarray: [1, 2] } }, { sub: { subarray: [3, 4] } }],
        },
      };
      const schema = {
        new: "sub.array[*].sub",
      } as const satisfies Schema<typeof data>;
      const expected = {
        new: [{ subarray: [1, 2] }, { subarray: [3, 4] }],
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should flatten array", () => {
      const data = {
        sub: {
          array: [{ sub: { subarray: [1, 2] } }, { sub: { subarray: [3, 4] } }],
        },
      };
      const schema = {
        new: "sub.array[*].sub.subarray[*]",
      } as const satisfies Schema<typeof data>;
      const expected = {
        new: [1, 2, 3, 4],
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should flatten array with property", () => {
      const data = {
        sub: {
          array: [
            { sub: { subarray: [{ id: 1 }, { id: 2 }] } },
            { sub: { subarray: [{ id: 3 }, { id: 4 }] } },
          ],
        },
      };
      const schema = {
        new: "sub.array[*].sub.subarray[*].id",
      } as const satisfies Schema<typeof data>;
      const expected = {
        new: [1, 2, 3, 4],
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should not flatten final array without [*]", () => {
      const data = {
        sub: {
          array: [{ sub: { subarray: [1, 2] } }, { sub: { subarray: [3, 4] } }],
        },
      };
      const schema = {
        new: "sub.array[*].sub.subarray",
      } as const satisfies Schema<typeof data>;
      const expected = {
        new: [
          [1, 2],
          [3, 4],
        ],
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
    test("should create mapped array", () => {
      const data = {
        sub: {
          array: [{ id: 1 }, { id: 2 }],
        },
      };
      const schema = {
        new: [
          "sub.array[*]",
          {
            new: "id",
          },
        ],
      } as const satisfies Schema<typeof data>;
      const expected = {
        new: data.sub.array.map((item) => ({ new: item.id })),
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should create mapped array with nested array property", () => {
      const data = {
        sub: {
          array: [{ sub: { subarray: [1, 2] } }, { sub: { subarray: [3, 4] } }],
        },
      };
      const schema = {
        new: [
          "sub.array[*]",
          {
            new: "sub.subarray[*]",
          },
        ],
      } as const satisfies Schema<typeof data>;
      const expected = {
        new: data.sub.array.map((item) => ({ new: item.sub.subarray })),
      };
      const reshaper = reshaperBuilder<typeof data, typeof schema>(schema);
      const result: typeof expected = reshaper(data);
      let typecheck = reshaper(data);
      typecheck = expected;
      [typecheck];
      expect(result).toEqual(expected);
    });

    test("should create nested mapped array", () => {
      const data = {
        sub: {
          array: [
            { sub: { subarray: [{ id: 1 }, { id: 2 }] } },
            { sub: { subarray: [{ id: 3 }, { id: 4 }] } },
          ],
        },
      };
      const schema = {
        new: [
          "sub.array[*]",
          {
            new: ["sub.subarray[*]", { new: "id" }],
          },
        ],
      } as const satisfies Schema<typeof data>;
      const expected = {
        new: [
          { new: [{ new: 1 }, { new: 2 }] },
          { new: [{ new: 3 }, { new: 4 }] },
        ],
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
