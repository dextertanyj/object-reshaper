export type IsAny<T> = unknown extends T
  ? keyof T extends never
    ? false
    : true
  : false;

export type ExcludeArrayKeys<T> = T extends ArrayLike<unknown>
  ? Exclude<keyof T, keyof unknown[]>
  : keyof T;

export type ConcreteArrayElement<A extends unknown[] | undefined | null> =
  Exclude<Exclude<A, undefined | null>[number], undefined | null>;
