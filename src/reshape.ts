import { ReshapeError } from "./errors";
import { Reshaper, Schema, Transformed } from "./types";

const fieldAccessorImplementation = <T>(o: T, field: string): unknown => {
  if (typeof o !== "object" || o === null) {
    throw new ReshapeError("FieldNotObject");
  }
  if (!Object.prototype.hasOwnProperty.call(o, field)) {
    throw new ReshapeError("MissingField");
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  return (o as any)[field] as unknown;
};

const fieldAccessor = <T>(data: T, path: string[]): unknown => {
  let field: unknown = data;
  for (
    let fieldName = path.shift();
    fieldName !== undefined;
    fieldName = path.shift()
  ) {
    if (fieldName.endsWith("]")) {
      const arrayAccessor = fieldName.split("[");
      const arrayName = arrayAccessor[0];
      const arrayIndex = arrayAccessor[1].split("]")[0];
      const array = fieldAccessorImplementation(field, arrayName);
      if (!Array.isArray(array)) {
        throw new ReshapeError("FieldNotArray");
      }
      if (arrayIndex === "*") {
        const result = array.map((item) => fieldAccessor(item, [...path]));
        if (path.find((item) => item.endsWith("[*]"))) {
          return result.flatMap((item) => item);
        }
        return result;
      } else {
        if (array.length < parseInt(arrayIndex)) {
          throw new ReshapeError("ArrayIndexOutOfBounds");
        }
        return fieldAccessor(array[parseInt(arrayIndex)], path);
      }
    } else {
      field = fieldAccessorImplementation(field, fieldName);
    }
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
        throw new ReshapeError("FieldNotArray");
      }
      result[key] = array.map((item: unknown) => {
        if (typeof item !== "object") {
          throw new ReshapeError("FieldNotObject");
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
