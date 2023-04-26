type IsAny<T> = unknown extends T
  ? keyof T extends never
    ? false
    : true
  : false;

type ExcludeArrayKeys<T> = T extends ArrayLike<unknown>
  ? Exclude<keyof T, keyof unknown[]>
  : keyof T;

type ConcreteArrayElement<A extends unknown[] | undefined | null> = Exclude<
  Exclude<A, undefined | null>[number],
  undefined | null
>;

type ArrayProperty<T, Key extends keyof T & string> = T[Key] extends
  | unknown[]
  | undefined
  | null
  ? Exclude<T[Key], undefined | null>[number] extends
      | Record<string, unknown>
      | undefined
      | null
    ?
        | `${Key}[${number | "*"}].${PathElement<
            ConcreteArrayElement<T[Key]>,
            ExcludeArrayKeys<ConcreteArrayElement<T[Key]>>
          > &
            string}`
        | `${Key}[${number | "*"}].${ExcludeArrayKeys<
            ConcreteArrayElement<T[Key]>
          > &
            string}`
        | `${Key}[${number | "*"}]`
        | `${Key}`
    : `${Key}[${number | "*"}]` | `${Key}`
  : never;

type RecordProperty<T, Key extends keyof T & string> = T[Key] extends
  | Record<string, unknown>
  | undefined
  | null
  ?
      | `${Key}.${PathElement<
          Exclude<T[Key], undefined | null>,
          ExcludeArrayKeys<T[Key]>
        > &
          string}`
      | `${Key}.${ExcludeArrayKeys<Exclude<T[Key], undefined | null>> & string}`
  : never;

type PathElement<T, Key extends keyof T> = Key extends string
  ? IsAny<T[Key]> extends true
    ? never
    : ArrayProperty<T, Key> | RecordProperty<T, Key>
  : never;

type Path<T> = keyof T extends string
  ? PathElement<T, keyof T> | keyof T extends infer P
    ? P extends string | keyof T
      ? P
      : keyof T
    : keyof T
  : never;

type ArrayTerminal<P> = Extract<P, `${string}[*]`>;

type ArrayChildren<
  Key extends ArrayTerminal<P>,
  P
> = Key extends `${infer K}[*]`
  ? P extends `${infer Left}[*].${infer Right}`
    ? Left extends K
      ? Right
      : never
    : never
  : never;

type NestedSchema<Path> = Readonly<{
  [key: string]:
    | Path
    | NestedSchema<Path>
    | SubArraySchema<ArrayTerminal<Path>, Path>;
}>;

type SubArrayDefinition<Key extends ArrayTerminal<P>, P> = {
  readonly 0: Key;
  readonly 1: Record<
    string,
    | ArrayChildren<Key, P>
    | NestedSchema<ArrayChildren<Key, P>>
    | SubArraySchema<
        ArrayTerminal<ArrayChildren<Key, P>>,
        ArrayChildren<Key, P>
      >
  >;
};

type SubArraySchema<Key extends ArrayTerminal<P>, P> = SubArrayDefinition<
  Key,
  P
>;

export type Schema<T> = NestedSchema<Path<T>>;

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

export type Reshaper<T, S extends Schema<T>> = (data: T) => Transformed<T, S>;
