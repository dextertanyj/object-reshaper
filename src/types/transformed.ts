import { Schema } from "./schema";
import { Contains, Defined, NeverArrayRemover, NormalizePath, OptionalWrapper } from "./utilities";

export type Transformed<T, S extends Schema<T>> = {
  -readonly [Key in keyof S]: S[Key] extends string
    ? GetFieldType<T, S[Key]>
    : S[Key] extends Schema<T>
    ? Transformed<T, S[Key]>
    : S[Key] extends readonly [infer ArrayPath, infer Value]
    ? ArrayPath extends string
      ? NestedArrayTransformed<T, ArrayPath, Value>
      : never
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
  : never;

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
    : Path extends keyof Defined<T>
    ? OptionalWrapper<T, Defined<T>[Path]>
    : Path extends `${infer Key extends string}${"." | `[${number | "*"}]`}${string}`
    ? Key extends keyof T // Key extends keyof T & string causes Key to take on any keyof T.
      ? Path extends `${Key}${infer Rest extends string}`
        ? OptionalWrapper<T, GetFieldType<T[Key], NormalizePath<Rest>>>
        : never
      : never
    : never
  : never;

/**
 * Returns the type of the field defined by `Path`, resolved with respect to the array `Array`.
 *
 * If `Array` is optional, then the resulting type is also optional.
 *
 * @typeparam `Array` - The current array type.
 * @typeparam `Path` - The path to the field.
 */
type GetArrayFieldType<Array, Path extends string> = Array extends unknown[] | undefined | null
  ? Path extends ""
    ? Array
    : Path extends `[${infer Index extends number | "*"}]${infer Next}`
    ? Defined<Array>[number] extends infer Element
      ? GetFieldType<Element, Next> extends infer Result
        ? WrapArrayResult<Array, Result, Index, Next>
        : never
      : never
    : never
  : never;

/**
 * Returns `Result` wrapped in an array if Index is a wildcard and no other wildcards are present in `Path`.
 * Adds the necessary optional modifiers to the returned type.
 */
type WrapArrayResult<Array, Result, Index, Path extends string> = Index extends number
  ? OptionalWrapper<Array, Result> | undefined
  : NormalizePath<Path> extends ""
  ? // TypeScript condenses never | T to T but does not condense never[] | T[] to T[].
    NeverArrayRemover<OptionalWrapper<Array, Exclude<Result, undefined>[]>>
  : Contains<NormalizePath<Path>, "[*]"> extends true
  ? OptionalWrapper<Array, Exclude<Result, undefined>>
  : NeverArrayRemover<OptionalWrapper<Array, Exclude<Result, undefined>[]>>;

type NestedArrayTransformed<T, ArrayPath extends string, Value> = GetFieldType<
  T,
  ArrayPath
> extends infer Array
  ? Array extends unknown[] | undefined | null
    ? Defined<Array>[number] extends infer Element
      ? // Array looses optionality after Value is checked against Schema<Defined<Element>>.
        // So OptionalWrapper is called before the check is performed.
        OptionalWrapper<
          Array,
          Value extends Schema<Defined<Element>>
            ? NeverArrayRemover<OptionalWrapper<Element, Transformed<Defined<Element>, Value>>[]>
            : never
        >
      : never
    : never
  : never;
