import { ConcreteArrayElement, ExcludeArrayKeys, IsAny } from "./utilities";

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
