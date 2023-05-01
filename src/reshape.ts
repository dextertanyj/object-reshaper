import { Reshaper } from "./types/core";
import { Schema } from "./types/schema";
import { Transformed } from "./types/transformed";

const isDeclaredArrayTemplate = (template: unknown): template is [string, unknown] => {
  return Array.isArray(template) && template.length === 2 && typeof template[0] === "string";
};

function splitPath(path: string): string[] {
  return path.split(/\.|(\[\*\])|(\[\d+\])/g).filter((item) => item !== undefined && item !== "");
}

const readField = <T>(o: T, field: string): unknown => {
  if (typeof o !== "object" || o === null) {
    return undefined;
  }
  if (!Object.prototype.hasOwnProperty.call(o, field)) {
    return undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  return (o as any)[field] as unknown;
};

const handleArrayAccess = (array: unknown, index: string, path: string[]) => {
  if (array === undefined || array === null || !Array.isArray(array)) {
    return undefined;
  }
  if (index === "[*]") {
    // Copy array to avoid mutation.
    const result = handleFlattenedArrayAccess(array, [...path]);
    if (path.find((item) => item === "[*]")) {
      return result.flatMap((item) => (item === undefined ? [] : item));
    }
    return result.filter((item) => item !== undefined);
  } else {
    return handleIndexedArrayAccess(array, parseInt(index.slice(1, -1)), path);
  }
};

const handleIndexedArrayAccess = (array: unknown[], index: number, path: string[]): unknown => {
  if (array.length <= index) {
    return undefined;
  }
  const result = fieldAccessor(array[index], path);
  return result;
};

const handleFlattenedArrayAccess = (array: unknown[], path: string[]): unknown[] => {
  if (path.length === 0) {
    return array.filter((item) => item !== undefined);
  }
  return (
    array
      .filter((item) => item !== undefined && item !== null)
      // Path is used multiple times and must be copied.
      .map((item) => fieldAccessor(item, [...path]))
  );
};

const fieldAccessor = <T>(data: T, path: string[]): unknown => {
  let field: unknown = data;
  for (
    let fieldName = path.shift();
    fieldName !== undefined && field !== undefined;
    fieldName = path.shift()
  ) {
    if (fieldName.match(/(\[\d+\])|(\[\*\])/g)) {
      // Array flattening is easier to handle recursively.
      return handleArrayAccess(field, fieldName, [...path]);
    } else {
      field = readField(field, fieldName);
    }
  }
  return field;
};

const arrayConstructor = <T>(data: T, template: [string, unknown]): unknown[] | undefined => {
  const path = template[0];
  const array = fieldAccessor(data, splitPath(path));
  if (!Array.isArray(array)) {
    return undefined;
  }

  const schema = template[1];
  if (typeof schema === "string") {
    return array
      .map((item) => fieldAccessor(item, splitPath(schema)))
      .filter((item) => item !== undefined);
  }
  if (typeof schema !== "object" || schema === null) {
    return undefined;
  }
  if (isDeclaredArrayTemplate(schema)) {
    return array.map((item) => arrayConstructor(item, schema)).filter((item) => item !== undefined);
  }
  return array
    .map((item) => objectConstructor(item as never, schema as never))
    .filter((item) => item !== undefined);
};

const objectConstructor = <T extends Record<string, unknown>, S extends Schema<T>>(
  data: T,
  schema: S,
): Transformed<T, S> => {
  const result: Record<string, unknown> = {};
  for (const key in schema) {
    const item = schema[key];
    if (typeof item === "string") {
      result[key] = fieldAccessor(data, splitPath(item));
    } else if (typeof item === "object" && !Array.isArray(item)) {
      result[key] = objectConstructor(data, item as never);
    } else if (isDeclaredArrayTemplate(item)) {
      result[key] = arrayConstructor(data, item);
    }
  }
  return result as Transformed<T, S>;
};

export const reshaperBuilder: <T extends Record<string, unknown>, S extends Schema<T>>(
  schema: S,
) => Reshaper<T, S> = <T extends Record<string, unknown>, S extends Schema<T>>(
  schema: S,
): ((data: T) => Transformed<T, S>) => {
  return (data: T) => objectConstructor(data, schema);
};
