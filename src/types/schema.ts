import {
  Defined,
  DefinedArrayElement,
  ExcludeArrayKeys,
  IsAny,
} from "./utilities";

type ArrayProperty<T> = T extends unknown[] | undefined | null
  ? DefinedArrayElement<T> extends infer E
    ? E extends Record<string, unknown> | undefined | null
      ?
          | `[${number | "*"}].${PathElement<E, ExcludeArrayKeys<E>> & string}`
          | `[${number | "*"}]`
      : `[${number | "*"}]`
    : never
  : never;

type RecordProperty<T> = T extends Record<string, unknown> | undefined | null
  ?
      | `.${PathElement<Defined<T>, ExcludeArrayKeys<T>> & string}`
      | `.${ExcludeArrayKeys<Defined<T>> & string}`
  : never;

type PathElement<T, Key extends keyof T> = Key extends string
  ? IsAny<T[Key]> extends true
    ? never
    :
        | `${Key}`
        | `${Key}${ArrayProperty<T[Key]>}`
        | `${Key}${RecordProperty<T[Key]>}`
  : never;

type Path<T> = keyof T extends string
  ? PathElement<T, keyof T> | keyof T extends infer P
    ? P extends string | keyof T
      ? P
      : keyof T
    : keyof T
  : never;

type ArrayTerminal<Paths> = Extract<Paths, `${string}[*]`>;

type ArrayChildren<
  ArrayPath extends ArrayTerminal<Paths>,
  Paths
> = Paths extends `${ArrayPath}.${infer Child}` ? Child : never;

type SubArrayDefinition<Key extends ArrayTerminal<Paths>, Paths> = {
  readonly 0: Key;
  readonly 1: Record<
    string,
    | ArrayChildren<Key, Paths>
    | NestedSchema<ArrayChildren<Key, Paths>>
    | SubArraySchema<
        ArrayTerminal<ArrayChildren<Key, Paths>>,
        ArrayChildren<Key, Paths>
      >
  >;
};

type SubArraySchema<
  Key extends ArrayTerminal<Paths>,
  Paths
> = SubArrayDefinition<Key, Paths>;

type NestedSchema<Path> = Readonly<{
  [key: string]:
    | Path
    | NestedSchema<Path>
    | SubArraySchema<ArrayTerminal<Path>, Path>;
}>;

export type Schema<T> = NestedSchema<Path<T>>;
