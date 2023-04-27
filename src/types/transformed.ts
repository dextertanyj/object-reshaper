import { Schema } from "./schema";
import { Defined, OptionalWrapper } from "./utilities";

type CheckAndGetSubFieldType<T, Path> = T extends
  | Record<string, unknown>
  | undefined
  | null
  ? OptionalWrapper<T, GetFieldType<Defined<T>, Path>>
  : never;

type CheckAndGetArraySubFieldType<
  Array,
  Index extends number | "*",
  Path
> = Array extends unknown[] | undefined | null
  ? Defined<Array>[number] extends infer E
    ? GetFieldType<Defined<E>, Path> extends infer DefinedE
      ? Index extends number
        ? OptionalWrapper<E, DefinedE> | undefined
        : Path extends `${string}[*]${string | ""}`
        ? OptionalWrapper<Array, DefinedE>
        : OptionalWrapper<Array, DefinedE[]>
      : never
    : never
  : never;

// Guaranteed to be invoked only once in a path and is the last key.
type CheckAndGetArrayFieldType<
  T,
  Key extends keyof T,
  Index extends number | "*"
> = T[Key] extends unknown[] | undefined | null
  ? Index extends number
    ? OptionalWrapper<T[Key], Defined<T[Key]>[number]> | undefined
    : OptionalWrapper<T[Key], Defined<Defined<T[Key]>[number]>[]>
  : never;

type GetFieldType<T, Path> = Path extends keyof T
  ? T[Path]
  : Path extends `${infer PartialPath}[${infer Index extends
      | number
      | "*"}].${infer Rest}`
  ? GetFieldType<T, PartialPath> extends infer Field
    ? CheckAndGetArraySubFieldType<Field, Index, Rest>
    : never
  : Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? CheckAndGetSubFieldType<T[Key], Rest>
    : never
  : Path extends `${infer Key}[${infer Index extends number | "*"}]`
  ? Key extends keyof T
    ? CheckAndGetArrayFieldType<T, Key, Index>
    : never
  : T;

type SubArrayTransformed<T, ArrayPath extends string, Value> = GetFieldType<
  T,
  ArrayPath
> extends infer Array
  ? Array extends unknown[] | undefined | null
    ? Defined<Array>[number] extends infer E
      ? OptionalWrapper<
          Array,
          Value extends Schema<Defined<E>>
            ? OptionalWrapper<E, Transformed<Defined<E>, Value>>[]
            : never
        >
      : never
    : never
  : never;

export type Transformed<T, S extends Schema<T>> = {
  -readonly [Key in keyof S]: S[Key] extends string
    ? GetFieldType<T, S[Key]>
    : S[Key] extends Schema<T>
    ? Transformed<T, S[Key]>
    : S[Key] extends readonly [infer ArrayPath, infer Value]
    ? ArrayPath extends string
      ? SubArrayTransformed<T, ArrayPath, Value> extends infer NestedResult
        ? NestedResult extends never[]
          ? never
          : NestedResult
        : never
      : never
    : never;
};
