type IsAny<T> = unknown extends T
  ? keyof T extends never
    ? false
    : true
  : false;

type ExcludeArrayKeys<T> = T extends ArrayLike<unknown>
  ? Exclude<keyof T, keyof unknown[]>
  : keyof T;

type ArrayProperty<T, Key extends keyof T & string> = T[Key] extends unknown[]
  ? T[Key][number] extends Record<string, unknown>
    ?
        | `${Key}[${number | "*"}].${PathElement<
            T[Key][number],
            ExcludeArrayKeys<T[Key][number]>
          > &
            string}`
        | `${Key}[${number | "*"}].${ExcludeArrayKeys<T[Key][number]> & string}`
        | `${Key}[${number | "*"}]`
        | `${Key}`
    : `${Key}[${number | "*"}]` | `${Key}`
  : never;

type RecordProperty<T, Key extends keyof T & string> = T[Key] extends Record<
  string,
  unknown
>
  ?
      | `${Key}.${PathElement<T[Key], ExcludeArrayKeys<T[Key]>> & string}`
      | `${Key}.${ExcludeArrayKeys<T[Key]> & string}`
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

type SubArrayDefinition<Key extends ArrayTerminal<P>, P> = {
  readonly 0: Key;
  readonly 1: Record<
    string,
    | ArrayChildren<Key, P>
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

export type Schema<T> = Readonly<{
  [key: string]:
    | Path<T>
    | Schema<T>
    | SubArraySchema<ArrayTerminal<Path<T>>, Path<T>>;
}>;

type GetFieldType<T, P> = P extends keyof T
  ? T[P]
  : P extends `${infer U}[${infer V extends number | "*"}].${infer W}`
  ? GetFieldType<T, U> extends infer X
    ? X extends unknown[]
      ? V extends number
        ? GetFieldType<X[number], W>
        : GetFieldType<X[number], W> extends infer Y
        ? W extends `${string}[*]${string | ""}`
          ? Y
          : Y[]
        : never
      : never
    : never
  : P extends `${infer U}.${infer V}`
  ? U extends keyof T
    ? T[U] extends Record<string, unknown>
      ? GetFieldType<T[U], V>
      : never
    : never
  : P extends `${infer U}[${infer V extends number | "*"}]`
  ? U extends keyof T
    ? T[U] extends unknown[]
      ? V extends number
        ? T[U][number]
        : T[U]
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
      ? GetFieldType<T, U> extends infer W
        ? W extends unknown[]
          ? V extends Schema<W[number]>
            ? Transformed<W[number], V>[]
            : never
          : never
        : never
      : never
    : never;
};

export type Reshaper<T, S extends Schema<T>> = (data: T) => Transformed<T, S>;
