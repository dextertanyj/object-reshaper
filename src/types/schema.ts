import { Defined, DefinedArrayElement, ExcludeArrayKeys, IsAny } from "./utilities";

type ArrayProperty<T> = T extends unknown[] | undefined | null
  ? DefinedArrayElement<T> extends infer E
    ? E extends Record<string, unknown> | undefined | null
      ? `[${number | "*"}].${PathElement<E, ExcludeArrayKeys<E>> & string}` | `[${number | "*"}]`
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
    : `${Key}` | `${Key}${ArrayProperty<T[Key]>}` | `${Key}${RecordProperty<T[Key]>}`
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
  Paths,
> = Paths extends `${ArrayPath}.${infer Child}` ? Child : never;

type NestedArraySchema<Key extends ArrayTerminal<Paths>, Paths> = Key extends ArrayTerminal<Paths> // Force mapping over union type
  ? {
      readonly 0: Key;
      readonly 1: NestedSchema<ArrayChildren<Key, Paths>>;
    }
  : never;

type NestedSchema<Path> = Readonly<{
  [key: string]: Path | NestedSchema<Path> | NestedArraySchema<ArrayTerminal<Path>, Path>;
}>;

export type Schema<T> = NestedSchema<Path<T>>;
