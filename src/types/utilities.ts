export type IsAny<T> = unknown extends T ? (keyof T extends never ? false : true) : false;

export type ExcludeArrayKeys<T> = T extends ArrayLike<unknown>
  ? Exclude<keyof T, keyof unknown[]>
  : keyof T;

export type Defined<T> = Exclude<T, undefined | null>;

export type DefinedArrayElement<A extends unknown[] | undefined | null> = Defined<
  Defined<A>[number]
>;

/**
 * Returns `Result` unioned with undefined if `Check` is undefined or null.
 *
 * @typeparam `Check` - The type to check.
 * @typeparam `Result` - The type to return.
 */
export type OptionalWrapper<Check, Result> = [undefined] extends [Check]
  ? Result | undefined
  : [null] extends [Check]
  ? Result | undefined
  : Result;

/**
 * Returns `P` after normalization to remove any leading dots.
 *
 * @typeparam `P` - The path to normalize.
 */
export type NormalizePath<P extends string> = P extends `.${infer N extends string}`
  ? NormalizePath<N>
  : P;

/**
 * Returns true if T contains U, otherwise false.
 */
export type Contains<T extends string, U extends string> = T extends `${string}${U}${string}`
  ? true
  : false;

export type NeverArrayRemover<T> = T extends never[] ? never : T;
