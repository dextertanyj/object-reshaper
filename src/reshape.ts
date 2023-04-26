import { Reshaper, Schema, Transformed } from "./types";

const readField = <T>(o: T, field: string): unknown => {
  if (typeof o !== "object") {
    return undefined;
  }
  if (o === null) {
    return o;
  }
  if (!Object.prototype.hasOwnProperty.call(o, field)) {
    return undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  return (o as any)[field] as unknown;
};

const handleArrayAccess = (
  field: unknown,
  fieldName: string,
  path: string[]
) => {
  const arrayAccessor = fieldName.split("[");
  const arrayName = arrayAccessor[0];
  const arrayIndex = arrayAccessor[1].split("]")[0];
  const array = readField(field, arrayName);
  if (array === undefined || array === null) {
    return array;
  }
  if (!Array.isArray(array)) {
    return undefined;
  }
  if (arrayIndex === "*") {
    const result = handleFlattenedArrayAccess(array, [...path]);
    if (path.find((item) => item.endsWith("[*]"))) {
      return result.flatMap((item) =>
        item === undefined || item === null ? [] : item
      );
    }
    return result;
  } else {
    return handleIndexedArrayAccess(array, parseInt(arrayIndex), [...path]);
  }
};

const handleIndexedArrayAccess = (
  array: unknown[],
  index: number,
  path: string[]
): unknown => {
  if (array.length <= index) {
    return undefined;
  }
  const result = fieldAccessor(array[index], [...path]);
  return result;
};

const handleFlattenedArrayAccess = (
  array: unknown[],
  path: string[]
): unknown[] => {
  return array
    .filter((item) => item !== undefined && item !== null)
    .map((item) => fieldAccessor(item, [...path]));
};

const fieldAccessor = <T>(data: T, path: string[]): unknown => {
  let field: unknown = data;
  for (
    let fieldName = path.shift();
    fieldName !== undefined && field !== undefined;
    fieldName = path.shift()
  ) {
    if (fieldName.endsWith("]")) {
      return handleArrayAccess(field, fieldName, [...path]);
    } else {
      field = readField(field, fieldName);
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
        result[key] = undefined;
      } else {
        result[key] = array.map((item: unknown) => {
          if (typeof item !== "object") {
            return undefined;
          }
          return objectConstructor(item, subSchema);
        });
      }
    }
  }
  return result as Transformed<T, S>;
};

export const reshaperBuilder: <T, S extends Schema<T>>(
  schema: S
) => Reshaper<T, S> = <T, S extends Schema<T>>(
  schema: S
): ((data: T) => Transformed<T, S>) => {
  return (data: T) => objectConstructor(data, schema);
};
