import { Reshaper, Schema, Transformed } from "./types";

const fieldAccessor = <T>(data: T, path: string[]): unknown => {
  let field: unknown = data;
  let fieldName = path.shift();
  while (fieldName !== undefined) {
    if (fieldName.endsWith("]")) {
      const arrayAccessor = fieldName.split("[");
      const arrayName = arrayAccessor[0];
      const arrayIndex = arrayAccessor[1].split("]")[0];
      if (typeof field !== "object" || field === null) {
        throw new Error(`Field is not an object`);
      }
      if (!Object.prototype.hasOwnProperty.call(field, arrayName)) {
        throw new Error(`Field ${arrayName} does not exist`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      const array = (field as any)[arrayName] as unknown;
      if (!Array.isArray(array)) {
        throw new Error(`Field ${arrayName} is not an array`);
      }
      if (arrayIndex === "*") {
        const result = array.map((item) => fieldAccessor(item, [...path]));
        if (path.find((item) => item.endsWith("[*]"))) {
          return result.flatMap((item) => item);
        }
        return result;
      } else {
        if (array.length < parseInt(arrayIndex)) {
          throw new Error(`Array index ${arrayIndex} does not exist`);
        }
        return fieldAccessor(array[parseInt(arrayIndex)], path);
      }
    } else {
      if (typeof field !== "object" || field === null) {
        throw new Error(`Field is not an object`);
      }
      if (!Object.prototype.hasOwnProperty.call(field, fieldName)) {
        throw new Error(`Field ${fieldName} does not exist`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      field = (field as any)[fieldName] as unknown;
    }
    fieldName = path.shift();
  }
  return field;
};

const objectConstructor = <T, S extends Schema<T>>(
  data: T,
  schema: S
): Transformed<T, S> => {
  const result: Record<string, unknown> = {};

  for (const key in schema) {
    const item = schema[key];
    if (typeof item === "string") {
      result[key] = fieldAccessor(data, item.split("."));
    } else if (typeof item === "object" && !Array.isArray(item)) {
      result[key] = objectConstructor(data, item as Schema<unknown>);
    } else {
      const fieldName = item[0] as string;
      const subSchema = item[1] as Schema<unknown>;
      const array = fieldAccessor(data, fieldName.split("."));
      if (!Array.isArray(array)) {
        throw new Error(`Field ${fieldName} is not an array`);
      }
      result[key] = array.map((item: unknown) => {
        if (typeof item !== "object") {
          throw new Error(`Field is not an object`);
        }
        return objectConstructor(item, subSchema);
      });
    }
  }
  return result as Transformed<T, S>;
};

export const reshaperBuilder: <T extends object, S extends Schema<T>>(
  schema: S
) => Reshaper<T, S> = <T extends object, S extends Schema<T>>(
  schema: S
): ((data: T) => Transformed<T, S>) => {
  return (data: T) => objectConstructor(data, schema);
};
