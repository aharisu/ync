import {
  ParseContext,
  ParseFuncInternal,
  createError,
  createParseContext,
  isUndefined,
  stringToBoolean,
  success,
} from "./common";

import { Infer, Parser, Result } from "./type";

//
// $union
//

function unionParse<Ts extends Array<Parser<any>>>(
  parsers: readonly [...Ts],
  input: unknown,
  ctx: ParseContext | undefined
): Result<Infer<Ts[number]>> {
  ctx = createParseContext(ctx);

  for (const parser of parsers) {
    const result = (parser.parse as ParseFuncInternal)(input, ctx);
    if (result.success) {
      return result;
    }
  }

  return { success: false, errors: ctx.errors };
}

export function $union<Ts extends Array<Parser<any>>>(
  parsers: readonly [...Ts]
): Parser<Infer<Ts[number]>> {
  const parser = {
    parse: (input: unknown, ctx?: ParseContext) =>
      unionParse(parsers, input, ctx),
  };
  return parser;
}

//
// $intersection
//

// https://stackoverflow.com/questions/75405517/typescript-generic-function-where-parameters-compose-into-the-return-type
type TupleToIntersection<T extends any[]> = {
  [I in keyof T]: (x: T[I]) => void;
}[number] extends (x: infer R) => void
  ? R
  : never;

type ArrayMapInfer<T> = T extends [infer x, ...infer xs]
  ? [Infer<x>, ...ArrayMapInfer<xs>]
  : [];

function objectMerge(
  base: NonNullable<object>,
  other: NonNullable<object>,
  merged: any
) {
  const mergedKeys = new Set([...Object.keys(base), ...Object.keys(other)]);
  for (const key of mergedKeys) {
    const baseValue = (base as any)[key];
    const otherValue = (other as any)[key];
    if (isUndefined(baseValue)) {
      merged[key] = otherValue;
    } else if (isUndefined(otherValue)) {
      merged[key] = baseValue;
    } else {
      const mergedValue = merge(baseValue, otherValue);
      if (mergedValue === MERGE_FAILURE) {
        return MERGE_FAILURE;
      } else {
        merged[key] = mergedValue;
      }
    }
  }

  return merged;
}

const MERGE_FAILURE = {};
function merge(base: unknown, other: unknown): unknown {
  //同じ値であればマージ不要なのでそのまま返す
  if (base === other) {
    return base;
  }

  if (base === MERGE_FAILURE) {
    return other;
  } else if (base === null || other === null) {
    //null同士以外で、一方がnullの場合はマージ不可能なので失敗とする
    return MERGE_FAILURE;
  } else if (typeof base === "object") {
    if (Array.isArray(base)) {
      if (typeof other === "object") {
        const merged: any = Array.isArray(other) ? [] : {};
        return objectMerge(base, other, merged);
      } else {
        //object値とプリミティブ値のマージは不可能なのでnullとする
        return MERGE_FAILURE;
      }
    } else {
      if (typeof other === "object") {
        const merged: any = {};
        return objectMerge(base, other, merged);
      } else {
        //object値とプリミティブ値のマージは不可能なのでnullとする
        return MERGE_FAILURE;
      }
    }
  } else {
    //このパーサーの仕様では、numberはstringの部分集合になるため、numberとstringをマージ可能にする
    if (
      (typeof other === "number" && typeof base === "string") ||
      (typeof other === "string" && typeof base === "number")
    ) {
      const numBase = Number(base);
      const numOther = Number(other);
      if (numBase === numOther) {
        return numBase;
      }
    } else if (
      (typeof other === "boolean" && typeof base === "string") ||
      (typeof other === "string" && typeof base === "boolean")
    ) {
      //このパーサーの仕様では、booleanはstringの部分集合になるため、booleanとstringをマージ可能にする
      const boolBase = typeof base === "boolean" ? base : stringToBoolean(base);
      const boolOther =
        typeof other === "boolean" ? other : stringToBoolean(other);
      if (boolBase !== null && boolBase === boolOther) {
        return boolBase;
      }
    }

    return MERGE_FAILURE;
  }
}

function parseIntersection<Ts extends Array<Parser<any>>>(
  parsers: readonly [...Ts],
  input: unknown,
  ctx: ParseContext | undefined
): Result<TupleToIntersection<ArrayMapInfer<Ts>>> {
  ctx = createParseContext(ctx);

  let value: unknown = MERGE_FAILURE;
  for (const parser of parsers) {
    const result = (parser.parse as ParseFuncInternal)(input, ctx);
    if (!result.success) {
      return result;
    }

    value = merge(value, result.value);
    //マージした結果nullとなった場合は、マージ不可能な型同士であるため、失敗とする
    if (value === MERGE_FAILURE) {
      break;
    }
  }

  if (value === MERGE_FAILURE) {
    return { success: false, errors: createError(ctx, "malformed_value") };
  } else {
    return success(ctx, value as TupleToIntersection<ArrayMapInfer<Ts>>);
  }
}

export function $intersection<Ts extends Array<Parser<any>>>(
  parsers: readonly [...Ts]
): Parser<TupleToIntersection<ArrayMapInfer<Ts>>> {
  const parser = {
    parse: (input: unknown, ctx?: ParseContext) =>
      parseIntersection(parsers, input, ctx),
  };
  return parser;
}
