import { Schema } from "./schema";

type UndefinedNullWrapper<C, R> = [undefined | null] extends [C]
  ? R | undefined | null
  : [undefined] extends [C]
  ? R | undefined
  : [null] extends [C]
  ? R | null
  : R;

type CheckAndGetSubFieldType<T, U extends keyof T, V> = T[U] extends
  | Record<string, unknown>
  | undefined
  | null
  ? UndefinedNullWrapper<T[U], GetFieldType<Exclude<T[U], undefined | null>, V>>
  : never;

type CheckAndGetArraySubFieldType<A, V extends number | "*", P> = A extends
  | unknown[]
  | undefined
  | null
  ? Exclude<A, undefined | null>[number] extends infer O
    ? GetFieldType<Exclude<O, undefined | null>, P> extends infer E
      ? V extends number
        ? UndefinedNullWrapper<O, E> | undefined
        : P extends `${string}[*]${string | ""}`
        ? UndefinedNullWrapper<A, E>
        : UndefinedNullWrapper<A, E[]>
      : never
    : never
  : never;

// Guaranteed to be invoked only once in a path and is the last key.
type CheckAndGetArrayFieldType<
  T,
  U extends keyof T,
  V extends number | "*"
> = T[U] extends unknown[] | undefined | null
  ? V extends number
    ?
        | UndefinedNullWrapper<T[U], Exclude<T[U], undefined | null>[number]>
        | undefined
    : UndefinedNullWrapper<
        T[U],
        Exclude<Exclude<T[U], undefined | null>[number], undefined | null>[]
      >
  : never;

type GetFieldType<T, P> = P extends keyof T
  ? T[P]
  : P extends `${infer U}[${infer V extends number | "*"}].${infer W}`
  ? GetFieldType<T, U> extends infer X
    ? CheckAndGetArraySubFieldType<X, V, W>
    : never
  : P extends `${infer U}.${infer V}`
  ? U extends keyof T
    ? CheckAndGetSubFieldType<T, U, V>
    : never
  : P extends `${infer U}[${infer V extends number | "*"}]`
  ? U extends keyof T
    ? CheckAndGetArrayFieldType<T, U, V>
    : never
  : T;

type SubArrayTransformed<T, P extends string, V> = GetFieldType<
  T,
  P
> extends infer W
  ? W extends unknown[] | undefined | null
    ? Exclude<W, undefined | null>[number] extends infer O
      ? Exclude<O, undefined | null> extends infer E
        ? UndefinedNullWrapper<
            W,
            V extends Schema<E>
              ? UndefinedNullWrapper<O, Transformed<E, V>>[]
              : never
          >
        : never
      : never
    : never
  : never;

export type Transformed<T, S extends Schema<T>> = {
  -readonly [Key in keyof S]: S[Key] extends string
    ? GetFieldType<T, S[Key]>
    : S[Key] extends Schema<T>
    ? Transformed<T, S[Key]>
    : S[Key] extends readonly [infer U, infer V]
    ? U extends string
      ? SubArrayTransformed<T, U, V> extends infer X
        ? X extends never[]
          ? never
          : X
        : never
      : never
    : never;
};
