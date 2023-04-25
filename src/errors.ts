export type ErrorCode =
  | "ArrayIndexOutOfBounds"
  | "MissingField"
  | "FieldNotObject"
  | "FieldNotArray";

export class ReshapeError extends Error {
  code: ErrorCode;

  constructor(code: ErrorCode, message?: string) {
    super(message ?? code);
    this.code = code;
    this.name = "ReshapeError";
  }
}
