import { describe, expect, test } from "@jest/globals";

import { ExpectEqual } from "./utilities";

import { reshaperBuilder, Schema } from "@";

describe("union input types", () => {
  describe("standard", () => {
    describe("primitives", () => {
      type Data = {
        id: number | string;
      };

      test("should return both types", () => {
        const schema = {
          new: "id",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number | string;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: 1 })).toEqual({ new: 1 });
        expect(reshaper({ id: "string" })).toEqual({ new: "string" });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("objects", () => {
      type Data = {
        id: { first: number } | { second: string };
      };

      test("should return both types", () => {
        const schema = {
          new: "id",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: { first: number } | { second: string };
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: { first: 1 } })).toEqual({ new: { first: 1 } });
        expect(reshaper({ id: { second: "string" } })).toEqual({ new: { second: "string" } });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return property type or undefined", () => {
        const schema = {
          new: "id.first",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: { first: 1 } })).toEqual({ new: 1 });
        expect(reshaper({ id: { second: "string" } })).toEqual({ new: undefined });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("nested objects", () => {
      type Data = {
        id: { first: { inner: number } } | { second: { inner: string } };
      };

      test("should return outer property type or undefined", () => {
        const schema = {
          new: "id.first",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: { inner: number } | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: { first: { inner: 1 } } })).toEqual({ new: { inner: 1 } });
        expect(reshaper({ id: { second: { inner: "string" } } })).toEqual({ new: undefined });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return inner property type or undefined", () => {
        const schema = {
          new: "id.first.inner",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: { first: { inner: 1 } } })).toEqual({ new: 1 });
        expect(reshaper({ id: { second: { inner: "string" } } })).toEqual({ new: undefined });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("primitive arrays", () => {
      type Data = {
        id: number[] | string[];
      };

      test("should return both types", () => {
        const schema = {
          new: "id",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[] | string[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [1] })).toEqual({ new: [1] });
        expect(reshaper({ id: ["string"] })).toEqual({ new: ["string"] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return arrays of both types", () => {
        const schema = {
          new: "id[*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[] | string[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [1] })).toEqual({ new: [1] });
        expect(reshaper({ id: ["string"] })).toEqual({ new: ["string"] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return both element types", () => {
        const schema = {
          new: "id[0]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number | string | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [1] })).toEqual({ new: 1 });
        expect(reshaper({ id: ["string"] })).toEqual({ new: "string" });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("object arrays", () => {
      type Data = {
        id: { first: number }[] | { second: string }[];
      };

      test("should return array of property type or undefined", () => {
        const schema = {
          new: "id[*].first",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ first: 1 }] })).toEqual({ new: [1] });
        expect(reshaper({ id: [{ second: "string" }] })).toEqual({ new: [] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return property type or undefined", () => {
        const schema = {
          new: "id[0].first",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ first: 1 }] })).toEqual({ new: 1 });
        expect(reshaper({ id: [{ second: "string" }] })).toEqual({ new: undefined });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("primitive and object", () => {
      type Data = {
        id: string | { name: number };
      };

      test("should return both types", () => {
        const schema = {
          new: "id",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: string | { name: number };
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: "string" })).toEqual({ new: "string" });
        expect(reshaper({ id: { name: 1 } })).toEqual({ new: { name: 1 } });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return element type or undefined", () => {
        const schema = {
          new: "id.name",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: "string" })).toEqual({ new: undefined });
        expect(reshaper({ id: { name: 1 } })).toEqual({ new: 1 });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("primitive and primitive array", () => {
      type Data = {
        id: string | number[];
      };

      test("should return both types", () => {
        const schema = {
          new: "id",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: string | number[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: "string" })).toEqual({ new: "string" });
        expect(reshaper({ id: [1, 2] })).toEqual({ new: [1, 2] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return array of element type or undefined", () => {
        const schema = {
          new: "id[*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[] | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: "string" })).toEqual({ new: undefined });
        expect(reshaper({ id: [1, 2] })).toEqual({ new: [1, 2] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("primitive and object array", () => {
      type Data = {
        id: string | { name: number }[];
      };

      test("should return array of element type or undefined", () => {
        const schema = {
          new: "id[*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: { name: number }[] | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: "string" })).toEqual({ new: undefined });
        expect(reshaper({ id: [{ name: 1 }] })).toEqual({ new: [{ name: 1 }] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return array of property type or undefined", () => {
        const schema = {
          new: "id[*].name",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[] | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: "string" })).toEqual({ new: undefined });
        expect(reshaper({ id: [{ name: 1 }] })).toEqual({ new: [1] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("object and primitive array", () => {
      type Data = {
        id: { name: number } | string[];
      };

      test("should return both types", () => {
        const schema = {
          new: "id",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: { name: number } | string[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: { name: 1 } })).toEqual({ new: { name: 1 } });
        expect(reshaper({ id: ["1", "2"] })).toEqual({ new: ["1", "2"] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return array of element type or undefined", () => {
        const schema = {
          new: "id[*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: string[] | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: { name: 1 } })).toEqual({ new: undefined });
        expect(reshaper({ id: ["1", "2"] })).toEqual({ new: ["1", "2"] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return element type or undefined", () => {
        const schema = {
          new: "id[0]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: string | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: { name: 1 } })).toEqual({ new: undefined });
        expect(reshaper({ id: ["1", "2"] })).toEqual({ new: "1" });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return property type or undefined", () => {
        const schema = {
          new: "id.name",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: { name: 1 } })).toEqual({ new: 1 });
        expect(reshaper({ id: ["1", "2"] })).toEqual({ new: undefined });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("object and object array", () => {
      type Data = {
        id: { name: number } | { name: string }[];
      };

      test("should return both types", () => {
        const schema = {
          new: "id",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: { name: number } | { name: string }[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: { name: 1 } })).toEqual({ new: { name: 1 } });
        expect(reshaper({ id: [{ name: "string" }] })).toEqual({ new: [{ name: "string" }] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return property type or undefined", () => {
        const schema = {
          new: "id.name",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: { name: 1 } })).toEqual({ new: 1 });
        expect(reshaper({ id: [{ name: "string" }] })).toEqual({ new: undefined });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return array of property type or undefined", () => {
        const schema = {
          new: "id[*].name",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: string[] | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: { name: 1 } })).toEqual({ new: undefined });
        expect(reshaper({ id: [{ name: "string" }] })).toEqual({ new: ["string"] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return property type or undefined", () => {
        const schema = {
          new: "id[*].name",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: string[] | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: { name: 1 } })).toEqual({ new: undefined });
        expect(reshaper({ id: [{ name: "string" }] })).toEqual({ new: ["string"] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("primitive array and object array", () => {
      type Data = {
        id: number[] | { name: string }[];
      };

      test("should return arrays of element types", () => {
        const schema = {
          new: "id[*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[] | { name: string }[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [1] })).toEqual({ new: [1] });
        expect(reshaper({ id: [{ name: "string" }] })).toEqual({ new: [{ name: "string" }] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return array of property type", () => {
        const schema = {
          new: "id[*].name",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: string[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [1] })).toEqual({ new: [] });
        expect(reshaper({ id: [{ name: "string" }] })).toEqual({ new: ["string"] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("array of primitives", () => {
      type Data = {
        id: (number | string)[];
      };

      test("should return array of both element types", () => {
        const schema = {
          new: "id[*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: (number | string)[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [1, "string"] })).toEqual({ new: [1, "string"] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return both element types or undefined", () => {
        const schema = {
          new: "id[0]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number | string | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [1, "string"] })).toEqual({ new: 1 });
        expect(reshaper({ id: ["string", 1] })).toEqual({ new: "string" });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("array of objects", () => {
      type Data = {
        id: ({ first: number } | { second: string })[];
      };

      test("should return array of both element types", () => {
        const schema = {
          new: "id[*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: ({ first: number } | { second: string })[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ first: 1 }, { second: "string" }] })).toEqual({
          new: [{ first: 1 }, { second: "string" }],
        });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return array of both element types", () => {
        const schema = {
          new: "id[*].first",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ first: 1 }, { second: "string" }] })).toEqual({
          new: [1],
        });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("overlapping objects", () => {
      type Data = {
        id: { name: number } | { name: string };
      };

      test("should return union property types", () => {
        const schema = {
          new: "id.name",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number | string;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: { name: 1 } })).toEqual({ new: 1 });
        expect(reshaper({ id: { name: "string" } })).toEqual({ new: "string" });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("overlapping object arrays", () => {
      type Data = {
        id: { name: string }[] | { name: number }[];
      };

      test("should return arrays of both types", () => {
        const schema = {
          new: "id[*].name",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[] | string[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ name: "string" }] })).toEqual({ new: ["string"] });
        expect(reshaper({ id: [{ name: 1 }] })).toEqual({ new: [1] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return both property types or undefined", () => {
        const schema = {
          new: "id[0].name",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number | string | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ name: "string" }] })).toEqual({ new: "string" });
        expect(reshaper({ id: [{ name: 1 }] })).toEqual({ new: 1 });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("array of overlapping objects", () => {
      type Data = {
        id: ({ name: string } | { name: number })[];
      };

      test("should return array of both property types", () => {
        const schema = {
          new: "id[*].name",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: (number | string)[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ name: 1 }, { name: "string" }] })).toEqual({ new: [1, "string"] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return both property types or undefined", () => {
        const schema = {
          new: "id[0].name",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number | string | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ name: "string" }] })).toEqual({ new: "string" });
        expect(reshaper({ id: [{ name: 1 }] })).toEqual({ new: 1 });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });
  });

  describe("nested arrays", () => {
    describe("nested object arrays", () => {
      type Data = {
        id: { array: { first: number }[] }[] | { array: { second: number }[] }[];
      };

      test("should return arrays of element types", () => {
        const schema = {
          new: "id[*].array[*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: { first: number }[] | { second: number }[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ array: [{ first: 1 }] }] })).toEqual({ new: [{ first: 1 }] });
        expect(reshaper({ id: [{ array: [{ second: 1 }] }] })).toEqual({ new: [{ second: 1 }] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return array of property type", () => {
        const schema = {
          new: "id[*].array[*].first",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ array: [{ first: 1 }] }] })).toEqual({ new: [1] });
        expect(reshaper({ id: [{ array: [{ second: 1 }] }] })).toEqual({ new: [] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared arrays of element types", () => {
        const schema = {
          new: ["id[*]", "array[*]"],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: { first: number }[][] | { second: number }[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ array: [{ first: 1 }] }] })).toEqual({ new: [[{ first: 1 }]] });
        expect(reshaper({ id: [{ array: [{ second: 1 }] }] })).toEqual({ new: [[{ second: 1 }]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared array of property type", () => {
        const schema = {
          new: ["id[*]", ["array[*]", "first"]],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ array: [{ first: 1 }] }] })).toEqual({ new: [[1]] });
        expect(reshaper({ id: [{ array: [{ second: 1 }] }] })).toEqual({ new: [[]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("object and nested object array", () => {
      type Data = {
        id: { name: number } | { array: { name: number }[] }[];
      };

      test("should return property type or undefined", () => {
        const schema = {
          new: "id.name",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: { name: 1 } })).toEqual({ new: 1 });
        expect(reshaper({ id: [{ array: [{ name: 1 }] }] })).toEqual({ new: undefined });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return array of property type or undefined", () => {
        const schema = {
          new: "id[*].array[*].name",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[] | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: { name: 1 } })).toEqual({ new: undefined });
        expect(reshaper({ id: [{ array: [{ name: 1 }] }] })).toEqual({ new: [1] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared array of element type or undefined", () => {
        const schema = {
          new: ["id[*]", "array[*]"],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: { name: number }[][] | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: { name: 1 } })).toEqual({ new: undefined });
        expect(reshaper({ id: [{ array: [{ name: 1 }] }] })).toEqual({ new: [[{ name: 1 }]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared array of property type or undefined", () => {
        const schema = {
          new: ["id[*]", ["array[*]", "name"]],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[][] | undefined;
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: { name: 1 } })).toEqual({ new: undefined });
        expect(reshaper({ id: [{ array: [{ name: 1 }] }] })).toEqual({ new: [[1]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("object array and nested object array", () => {
      type Data = {
        id: { name: number }[] | { array: { name: number }[] }[];
      };

      test("should return array of property type", () => {
        const schema = {
          new: "id[*].name",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ name: 1 }] })).toEqual({ new: [1] });
        expect(reshaper({ id: [{ array: [{ name: 1 }] }] })).toEqual({ new: [] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return array of property type", () => {
        const schema = {
          new: "id[*].array[*].name",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ name: 1 }] })).toEqual({ new: [] });
        expect(reshaper({ id: [{ array: [{ name: 1 }] }] })).toEqual({ new: [1] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared array of property type", () => {
        const schema = {
          new: ["id[*]", "name"],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ name: 1 }] })).toEqual({ new: [1] });
        expect(reshaper({ id: [{ array: [{ name: 1 }] }] })).toEqual({ new: [] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared array of element type", () => {
        const schema = {
          new: ["id[*]", "array[*]"],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: { name: number }[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ name: 1 }] })).toEqual({ new: [] });
        expect(reshaper({ id: [{ array: [{ name: 1 }] }] })).toEqual({ new: [[{ name: 1 }]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared array of property type of nested array element", () => {
        const schema = {
          new: ["id[*]", ["array[*]", "name"]],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ name: 1 }] })).toEqual({ new: [] });
        expect(reshaper({ id: [{ array: [{ name: 1 }] }] })).toEqual({ new: [[1]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("overlapping nested object arrays", () => {
      type Data = {
        id: { array: { name: string }[] }[] | { array: { name: number }[] }[];
      };

      test("should return arrays of property types", () => {
        const schema = {
          new: "id[*].array[*].name",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[] | string[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ array: [{ name: "string" }] }] })).toEqual({ new: ["string"] });
        expect(reshaper({ id: [{ array: [{ name: 1 }] }] })).toEqual({ new: [1] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared arrays of element types", () => {
        const schema = {
          new: ["id[*]", "array[*]"],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: { name: number }[][] | { name: string }[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ array: [{ name: "string" }] }] })).toEqual({
          new: [[{ name: "string" }]],
        });
        expect(reshaper({ id: [{ array: [{ name: 1 }] }] })).toEqual({ new: [[{ name: 1 }]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared arrays of property types", () => {
        const schema = {
          new: ["id[*]", ["array[*]", "name"]],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[][] | string[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ array: [{ name: "string" }] }] })).toEqual({ new: [["string"]] });
        expect(reshaper({ id: [{ array: [{ name: 1 }] }] })).toEqual({ new: [[1]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("array of nested object arrays", () => {
      type Data = {
        id: { array: { first: number }[] | { second: number }[] }[];
      };

      test("should return array of element type", () => {
        const schema = {
          new: "id[*].array[*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: ({ first: number } | { second: number })[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ array: [{ first: 1 }] }, { array: [{ second: 1 }] }] })).toEqual({
          new: [{ first: 1 }, { second: 1 }],
        });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return array of property type", () => {
        const schema = {
          new: "id[*].array[*].first",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ array: [{ first: 1 }] }] })).toEqual({ new: [1] });
        expect(reshaper({ id: [{ array: [{ second: 1 }] }] })).toEqual({ new: [] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared array of element type", () => {
        const schema = {
          new: ["id[*]", "array[*]"],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: ({ first: number }[] | { second: number }[])[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ array: [{ first: 1 }] }] })).toEqual({ new: [[{ first: 1 }]] });
        expect(reshaper({ id: [{ array: [{ second: 1 }] }] })).toEqual({ new: [[{ second: 1 }]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared array of property type", () => {
        const schema = {
          new: ["id[*]", ["array[*]", "first"]],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ array: [{ first: 1 }] }] })).toEqual({ new: [[1]] });
        expect(reshaper({ id: [{ array: [{ second: 1 }] }] })).toEqual({ new: [[]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("array of object and nested object array", () => {
      type Data = {
        id: ({ name: number } | { array: { name: number }[] })[];
      };

      test("", () => {
        const schema = {
          new: "id[*].name",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ name: 1 }] })).toEqual({ new: [1] });
        expect(reshaper({ id: [{ array: [{ name: 1 }] }] })).toEqual({ new: [] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("", () => {
        const schema = {
          new: "id[*].array[*].name",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ name: 1 }] })).toEqual({ new: [] });
        expect(reshaper({ id: [{ array: [{ name: 1 }] }] })).toEqual({ new: [1] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("", () => {
        const schema = {
          new: ["id[*]", "name"],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ name: 1 }] })).toEqual({ new: [1] });
        expect(reshaper({ id: [{ array: [{ name: 1 }] }] })).toEqual({ new: [] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("", () => {
        const schema = {
          new: ["id[*]", "array[*]"],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: { name: number }[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ name: 1 }] })).toEqual({ new: [] });
        expect(reshaper({ id: [{ array: [{ name: 1 }] }] })).toEqual({ new: [[{ name: 1 }]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("", () => {
        const schema = {
          new: ["id[*]", ["array[*]", "name"]],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [{ name: 1 }] })).toEqual({ new: [] });
        expect(reshaper({ id: [{ array: [{ name: 1 }] }] })).toEqual({ new: [[1]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });
  });

  describe("multidimensional arrays", () => {
    describe("multidimensional primitive arrays", () => {
      type Data = {
        id: number[][] | string[][];
      };

      test("should return arrays of element of outer array types", () => {
        const schema = {
          new: "id[*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[][] | string[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[1]] })).toEqual({ new: [[1]] });
        expect(reshaper({ id: [["string"]] })).toEqual({ new: [["string"]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return arrays of element of inner arrray types", () => {
        const schema = {
          new: "id[*][*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[] | string[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[1]] })).toEqual({ new: [1] });
        expect(reshaper({ id: [["string"]] })).toEqual({ new: ["string"] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared arrays of arrays of element of inner arrray types", () => {
        const schema = {
          new: ["id[*]", "[*]"],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[][] | string[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[1]] })).toEqual({ new: [[1]] });
        expect(reshaper({ id: [["string"]] })).toEqual({ new: [["string"]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("multidimensional object arrays", () => {
      type Data = {
        id: { first: number }[][] | { second: string }[][];
      };

      test("should return arrays of element type of outer array", () => {
        const schema = {
          new: "id[*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: { first: number }[][] | { second: string }[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[{ first: 1 }]] })).toEqual({ new: [[{ first: 1 }]] });
        expect(reshaper({ id: [[{ second: "string" }]] })).toEqual({
          new: [[{ second: "string" }]],
        });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return arrays of element type of inner array", () => {
        const schema = {
          new: "id[*][*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: { first: number }[] | { second: string }[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[{ first: 1 }]] })).toEqual({ new: [{ first: 1 }] });
        expect(reshaper({ id: [[{ second: "string" }]] })).toEqual({ new: [{ second: "string" }] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return array of element type of inner array", () => {
        const schema = {
          new: "id[*][*].first",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[{ first: 1 }]] })).toEqual({ new: [1] });
        expect(reshaper({ id: [[{ second: "string" }]] })).toEqual({ new: [] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared arrays of arrays of element types of inner array", () => {
        const schema = {
          new: ["id[*]", "[*].first"],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[{ first: 1 }]] })).toEqual({ new: [[1]] });
        expect(reshaper({ id: [[{ second: "string" }]] })).toEqual({ new: [[]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared arrays of arrays of property type of inner array element", () => {
        const schema = {
          new: ["id[*]", ["[*]", "first"]],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[{ first: 1 }]] })).toEqual({ new: [[1]] });
        expect(reshaper({ id: [[{ second: "string" }]] })).toEqual({ new: [[]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("primitive array and multidimensional primitive array", () => {
      type Data = {
        id: string[] | number[][];
      };

      test("should return arrays of element types of outer array", () => {
        const schema = {
          new: "id[*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: string[] | number[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: ["string"] })).toEqual({ new: ["string"] });
        expect(reshaper({ id: [[1]] })).toEqual({ new: [[1]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return array of element type of inner array", () => {
        const schema = {
          new: "id[*][*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: ["string"] })).toEqual({ new: [] });
        expect(reshaper({ id: [[1]] })).toEqual({ new: [1] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared array of array of element type of inner array", () => {
        const schema = {
          new: ["id[*]", "[*]"],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: ["string"] })).toEqual({ new: [] });
        expect(reshaper({ id: [[1]] })).toEqual({ new: [[1]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("overlapping multidimensional object arrays", () => {
      type Data = {
        id: { name: number }[][] | { name: string }[][];
      };

      test("should return arrays of element type of outer array", () => {
        const schema = {
          new: "id[*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: { name: number }[][] | { name: string }[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[{ name: 1 }]] })).toEqual({ new: [[{ name: 1 }]] });
        expect(reshaper({ id: [[{ name: "string" }]] })).toEqual({
          new: [[{ name: "string" }]],
        });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return arrays of element type of inner array", () => {
        const schema = {
          new: "id[*][*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: { name: number }[] | { name: string }[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[{ name: 1 }]] })).toEqual({ new: [{ name: 1 }] });
        expect(reshaper({ id: [[{ name: "string" }]] })).toEqual({
          new: [{ name: "string" }],
        });
        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return array of element type of inner array", () => {
        const schema = {
          new: "id[*][*].name",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[] | string[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[{ name: 1 }]] })).toEqual({ new: [1] });
        expect(reshaper({ id: [[{ name: "string" }]] })).toEqual({ new: ["string"] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared arrays of array of element types of inner array", () => {
        const schema = {
          new: ["id[*]", "[*].name"],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[][] | string[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[{ name: 1 }]] })).toEqual({ new: [[1]] });
        expect(reshaper({ id: [[{ name: "string" }]] })).toEqual({ new: [["string"]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared arrays of array of property types of inner array element", () => {
        const schema = {
          new: ["id[*]", ["[*]", "name"]],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[][] | string[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[{ name: 1 }]] })).toEqual({ new: [[1]] });
        expect(reshaper({ id: [[{ name: "string" }]] })).toEqual({ new: [["string"]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("array of primitive arrays", () => {
      type Data = {
        id: (number[] | string[])[];
      };

      test("should return array of element types of outer array", () => {
        const schema = {
          new: "id[*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: (number[] | string[])[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[1], ["string"]] })).toEqual({ new: [[1], ["string"]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return array of element types of inner arrays", () => {
        const schema = {
          new: "id[*][*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: (number | string)[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[1], ["string"]] })).toEqual({ new: [1, "string"] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared arrays of array of element types of inner arrays", () => {
        const schema = {
          new: ["id[*]", "[*]"],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: (number[] | string[])[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[1], ["string"]] })).toEqual({ new: [[1], ["string"]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("array of object arrays", () => {
      type Data = {
        id: ({ first: number }[] | { second: string }[])[];
      };

      test("should return arrays of element type of outer array", () => {
        const schema = {
          new: "id[*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: ({ first: number }[] | { second: string }[])[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[{ first: 1 }], [{ second: "string" }]] })).toEqual({
          new: [[{ first: 1 }], [{ second: "string" }]],
        });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return arrays of element type of inner array", () => {
        const schema = {
          new: "id[*][*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: ({ first: number } | { second: string })[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[{ first: 1 }], [{ second: "string" }]] })).toEqual({
          new: [{ first: 1 }, { second: "string" }],
        });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return array of element type of inner array", () => {
        const schema = {
          new: "id[*][*].first",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[{ first: 1 }], [{ second: "string" }]] })).toEqual({ new: [1] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared arrays of arrays of element types of inner array", () => {
        const schema = {
          new: ["id[*]", "[*].first"],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[{ first: 1 }], [{ second: "string" }]] })).toEqual({
          new: [[1], []],
        });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared arrays of arrays of property type of inner array element", () => {
        const schema = {
          new: ["id[*]", ["[*]", "first"]],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[{ first: 1 }], [{ second: "string" }]] })).toEqual({
          new: [[1], []],
        });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("array of primitive and primitive array", () => {
      type Data = {
        id: (string | number[])[];
      };

      test("should return array of element types of outer array", () => {
        const schema = {
          new: "id[*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: (string | number[])[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[1], "string"] })).toEqual({ new: [[1], "string"] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return array of element types of inner arrays", () => {
        const schema = {
          new: "id[*][*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[1], "string"] })).toEqual({ new: [1] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared arrays of array of element types of inner arrays", () => {
        const schema = {
          new: ["id[*]", "[*]"],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: number[][];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[1], "string"] })).toEqual({ new: [[1]] });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });

    describe("array of overlapping object arrays", () => {
      type Data = {
        id: ({ name: number }[] | { name: string }[])[];
      };

      test("should return arrays of element type of outer array", () => {
        const schema = {
          new: "id[*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: ({ name: number }[] | { name: string }[])[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[{ name: 1 }], [{ name: "string" }]] })).toEqual({
          new: [[{ name: 1 }], [{ name: "string" }]],
        });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return arrays of element type of inner array", () => {
        const schema = {
          new: "id[*][*]",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: ({ name: number } | { name: string })[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[{ name: 1 }], [{ name: "string" }]] })).toEqual({
          new: [{ name: 1 }, { name: "string" }],
        });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return array of element type of inner array", () => {
        const schema = {
          new: "id[*][*].name",
        } as const satisfies Schema<Data>;

        type Expected = {
          new: (number | string)[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[{ name: 1 }], [{ name: "string" }]] })).toEqual({
          new: [1, "string"],
        });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared arrays of arrays of element types of inner array", () => {
        const schema = {
          new: ["id[*]", "[*].name"],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: (number[] | string[])[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[{ name: 1 }], [{ name: "string" }]] })).toEqual({
          new: [[1], ["string"]],
        });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });

      test("should return declared arrays of arrays of property type of inner array element", () => {
        const schema = {
          new: ["id[*]", ["[*]", "name"]],
        } as const satisfies Schema<Data>;

        type Expected = {
          new: (number[] | string[])[];
        };

        const reshaper = reshaperBuilder<Data, typeof schema>(schema);
        expect(reshaper({ id: [[{ name: 1 }], [{ name: "string" }]] })).toEqual({
          new: [[1], ["string"]],
        });

        const typecheck: ExpectEqual<ReturnType<typeof reshaper>, Expected> = true;
        [typecheck];
      });
    });
  });
});
