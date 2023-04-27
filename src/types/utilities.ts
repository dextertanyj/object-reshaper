export type IsAny<T> = unknown extends T
  ? keyof T extends never
    ? false
    : true
  : false;

export type ExcludeArrayKeys<T> = T extends ArrayLike<unknown>
  ? Exclude<keyof T, keyof unknown[]>
  : keyof T;

export type Defined<T> = Exclude<T, undefined | null>;

export type DefinedArrayElement<A extends unknown[] | undefined | null> =
  Defined<Defined<A>[number]>;

export type OptionalWrapper<Check, Result> = [undefined | null] extends [Check]
  ? Result | undefined | null
  : [undefined] extends [Check]
  ? Result | undefined
  : [null] extends [Check]
  ? Result | null
  : Result;
