import { Schema } from "./schema";
import { ArrayOf, Contains, Defined, NormalizePath, OptionalWrapper } from "./utilities";

export type Transformed<T, S extends Schema<T>> = {
  -readonly [Key in keyof S]: S[Key] extends string
    ? GetFieldType<T, S[Key]>
    : S[Key] extends Schema<T>
    ? Transformed<T, S[Key]>
    : S[Key] extends readonly [infer ArrayPath extends string, infer Value]
    ? DeclaredArrayTransformed<T, ArrayPath, Value>
    : never;
};

/**
 * Returns the type of the field defined by `Path`, resolved with respect to `T`.
 *
 * If `Path` is empty, `T` is returned.
 *
 * @typeparam `T` - The current type.
 * @typeparam `Path` - The path to the field.
 */
type GetFieldType<T, Path extends string> = NormalizePath<Path> extends ""
  ? T
  : NormalizePath<Path> extends `[${number | "*"}]${string}`
  ? GetArrayFieldType<T, NormalizePath<Path>>
  : NormalizePath<Path> extends `${string}`
  ? GetRecordFieldType<T, NormalizePath<Path>>
  : never; // Invalid Path.

type KeyExtractor<Path> = Path extends `${infer Keys extends string}${
  | "[*]"
  | "."
  | `[${number}]`}${string}`
  ? Keys extends infer Key extends string
    ? Contains<Key, "." | "[*]" | `[${number}]`> extends true
      ? never
      : Key
    : never
  : Path; // Path is not composite

/**
 * Returns the type of the field defined by `Path`, resolved with respect to the record `T`.
 *
 * If `T` is optional, then the resulting type is also optional.
 *
 * @typeparam `T` - The current record type.
 * @typeparam `Path` - The path to the field.
 */
type GetRecordFieldType<T, Path> = T extends Record<string, unknown> | undefined | null
  ? Path extends "" // Preserves original optionality of T.
    ? T
    : [T] extends [undefined | null] // Short circuit if T is only undefined or null.
    ? undefined
    : Path extends keyof Defined<T>
    ? OptionalWrapper<T, Defined<T>[Path]>
    : KeyExtractor<Path> extends infer Key extends string
    ? Key extends keyof T // Key extends keyof T & string causes Key to take on any keyof T.
      ? Path extends `${Key}${infer Rest extends string}`
        ? OptionalWrapper<T, GetFieldType<T[Key], NormalizePath<Rest>>>
        : never // Invalid Path.
      : undefined // Key is not keyof T.
    : undefined // Path is terminal and not keyof T.
  : undefined; // T is not a Record.

/**
 * Returns the type of the field defined by `Path`, resolved with respect to the array `Array`.
 *
 * If `Array` is optional, then the resulting type is also optional.
 *
 * @typeparam `Array` - The current array type.
 * @typeparam `Path` - The path to the field.
 */
type GetArrayFieldType<T, Path extends string> = T extends unknown[] | undefined | null
  ? Path extends ""
    ? T
    : [T] extends [undefined | null] // Short circuit if T is only undefined or null.
    ? undefined
    : Path extends `[${infer Index extends number | "*"}]${infer Next}`
    ? Defined<T>[number] extends infer Element
      ? GetFieldType<Element, Next> extends infer Result
        ? [Result] extends [undefined]
          ? // Element is guaranteed to not be never since T is not undefined or null,
            // but the field cannot exist on any Element.
            //
            // Return never instead of undefined since the field must on elements of some
            // other sibling T (otherwise the Path should not pass typechecking).
            // At runtime, this T and its sibling arrays cannot be fully differentiated
            // since optional and undefined properties of nested objects cannot be
            // differentiated from invalid properties.
            never
          : WrapArrayResult<T, Result, Index, Next> // Field possibly exists on Element.
        : never
      : never
    : never
  : undefined; // T is not an Array.

/**
 * Returns `Result` wrapped in an array if Index is a wildcard and no other wildcards are present in `Path`.
 * Adds the necessary optional modifiers to the returned type.
 */
type WrapArrayResult<Array, Result, Index, Path extends string> = Index extends number
  ? OptionalWrapper<Array, Result> | undefined
  : NormalizePath<Path> extends ""
  ? OptionalWrapper<Array, ArrayOf<Result>>
  : Contains<NormalizePath<Path>, "[*]"> extends true
  ? // Merge flattened array types for results that contain union types.
    Exclude<Result, undefined> extends (infer T)[]
    ? OptionalWrapper<Array, ArrayOf<T>>
    : never
  : OptionalWrapper<Array, ArrayOf<Result>>;

type DeclaredArrayTransformed<T, ArrayPath extends string, Value> = GetFieldType<
  T,
  ArrayPath
> extends infer Array
  ? Array extends unknown[] | undefined | null
    ? Defined<Array>[number] extends infer Element
      ? // Array looses optionality after Value is checked against Schema<Defined<Element>>.
        // So OptionalWrapper is called before the check is performed.
        OptionalWrapper<
          Array,
          Value extends string
            ? ArrayOf<GetFieldType<Element, Value>>
            : Value extends readonly [infer NextArrayPath extends string, infer NextValue]
            ? ArrayOf<
                Exclude<DeclaredArrayTransformed<Element, NextArrayPath, NextValue>, undefined>
              >
            : Value extends Schema<Defined<Element>>
            ? ArrayOf<Transformed<Element, Value>>
            : never
        >
      : never
    : never
  : never;
