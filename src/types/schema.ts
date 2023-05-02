import { Defined, DefinedArrayElement, ExcludeArrayKeys, IsAny } from "./utilities";

type ArrayProperty<T> = T extends unknown[] | undefined | null
  ? DefinedArrayElement<T> extends infer E
    ? E extends Record<string, unknown> | undefined | null
      ? `[${number | "*"}].${PathElement<E, ExcludeArrayKeys<E>> & string}` | `[${number | "*"}]`
      : E extends unknown[] | undefined | null
      ? `[${number | "*"}]${ArrayProperty<E>}` | `[${number | "*"}]`
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

type Path<T> = T extends Record<string, unknown> | undefined | null
  ? keyof T extends string
    ? PathElement<T, keyof T> | keyof T extends infer P
      ? P extends string | keyof T
        ? P
        : keyof T
      : keyof T
    : never
  : T extends unknown[] | undefined | null
  ? ArrayProperty<T>
  : never;

// Consider only arrays that have non-primitive elements.
type ArrayTerminal<Paths> = Paths extends `${infer ArrayPath}[*]${infer Rest extends string}`
  ? Rest extends ""
    ? never
    : `${ArrayPath}[*]` | `${ArrayPath}[*]${ArrayTerminal<Rest>}` //
  : never;

type ArrayChildren<
  ArrayPath extends ArrayTerminal<Paths>,
  Paths,
> = ArrayPath extends `${infer FieldName}[*]`
  ? Paths extends `${FieldName}[*].${infer Child}` // Extract nested objects
    ? Child
    : Paths extends `${FieldName}[*]${infer Child}` // Extract nested arrays
    ? Child extends "" | `.${string}`
      ? never
      : Child
    : never
  : never;

type DeclaredArraySchema<Key extends ArrayTerminal<Paths>, Paths> = Key extends ArrayTerminal<Paths> // Force mapping over union type
  ? {
      readonly 0: Key;
      readonly 1:
        | ArrayChildren<Key, Paths>
        | NestedSchema<ArrayChildren<Key, Paths>>
        | DeclaredArraySchema<ArrayTerminal<ArrayChildren<Key, Paths>>, ArrayChildren<Key, Paths>>;
    }
  : never;

type NestedSchema<Path> = Readonly<{
  [key: string]: Path | NestedSchema<Path> | DeclaredArraySchema<ArrayTerminal<Path>, Path>;
}>;

export type Schema<T> = NestedSchema<Path<T>>;
