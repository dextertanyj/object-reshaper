import { Schema } from "./schema";
import { Transformed } from "./transformed";

export type Reshaper<T, S extends Schema<T>> = (data: T) => Transformed<T, S>;
