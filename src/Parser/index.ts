export {
  $number,
  $string,
  $boolean,
  $object,
  $array,
  $literal,
  $optional,
} from "./PrimitiveType";

export { $union, $intersection } from "./CompositeType";

export type { Infer, Parser, Result } from "./type";
