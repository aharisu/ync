import {
  ParseContext,
  ParseError,
  createParseContext,
  getPath,
  popParent,
  pushParent,
} from "./ParseContext";

import deepEqual from 'fast-deep-equal';

type Result<T> =
  | {
      success: true;
      value: T;
    }
  | {
      success: false;
      errors: Array<ParseError>;
    };

type NullableOptions = {
  ifnull?: never;
  nullable: true;
};

type ParseFunc<T> = (input: unknown) => Result<T>;
type ParseFuncInternal<T = any> = (
  input: unknown,
  ctx: ParseContext | undefined,
) => Result<T>;

export interface Parser<T> {
  parse: ParseFunc<T>;
}

type NullableParser<T> = Parser<T | null>;
type NullableResult<T> = Result<T | null>;

type MaybeNullableParser<T> = Parser<T> | NullableParser<T>;
type MaybeNullableResult<T> = Result<T> | NullableResult<T>;

export type Infer<T> = T extends Parser<infer U> ? U : unknown;

function isUndefined(input: unknown): input is undefined {
  return typeof input === "undefined";
}

function createError(
  ctx: ParseContext,
  kind: Exclude<ParseError["kind"], "optional_validation_failure">,
): Array<ParseError> {
  ctx.errors.push({
    path: getPath(ctx),
    kind: kind,
  });

  return ctx.errors;
}

function createOptionalError(
  ctx: ParseContext,
  option: string,
  optionValue: any,
): Array<ParseError> {
  ctx.errors.push({
    path: getPath(ctx),
    kind: "optional_validation_failure",
    option: option,
    optionValue: optionValue,
  });

  return ctx.errors;
}

function success<T>(ctx: ParseContext, value: T): Result<T> {
  return {
    success: true,
    value: value,
  };
}

type ValidateContext = Pick<ParseContext, "parent">;

/**
 * Validation is considered successful only when the return value is true.
 * Any other return value will result in an error.
 */
type Validator<T> = (value: T, ctx: ValidateContext) => true | unknown;

//
// $number
//

type NumberParserOptions = {
  default?: number;
  ifnull?: number;
  nullable?: boolean;
  min?: number;
  max?: number;
  allowNan?: boolean;
  validate?: Validator<number>;
};

function numberParse(
  options: NumberParserOptions,
  input: unknown,
  ctx: ParseContext | undefined,
): MaybeNullableResult<number> {
  ctx = createParseContext(ctx);

  let num;
  if (typeof input === "number") {
    if (!options.allowNan && Number.isNaN(input)) {
      return {
        success: false,
        errors: createError(ctx, "malformed_value"),
      };
    }

    num = input;
  } else if (isUndefined(input)) {
    if (options.default !== undefined) {
      num = options.default;
    } else {
      return {
        success: false,
        errors: createError(ctx, "required"),
      };
    }
  } else if (input === null) {
    if(!isUndefined(options.ifnull)) {
      num = options.ifnull;
    } else if (options.nullable) {
      return success(ctx, input);
    } else {
      return {
        success: false,
        errors: createError(ctx, "malformed_value"),
      };
    }
  } else if (typeof input === "string") {
    const number = Number(input);
    if (!options.allowNan && Number.isNaN(number)) {
      return {
        success: false,
        errors: createError(ctx, "malformed_value"),
      };
    }

    num = number;
  } else {
    //illegal input
    return {
      success: false,
      errors: createError(ctx, "malformed_value"),
    };
  }

  if (options.min !== undefined && num < options.min) {
    return {
      success: false,
      errors: createOptionalError(ctx, "min", options.min),
    };
  } else if (options.max !== undefined && num > options.max) {
    return {
      success: false,
      errors: createOptionalError(ctx, "max", options.max),
    };
  } else if (options.validate !== undefined) {
    const result = options.validate(num, ctx);
    if (result !== true) {
      return {
        success: false,
        errors: createOptionalError(ctx, "validate", result),
      };
    }
  }

  return success(ctx, num);
}

export function $number(
  options: NullableOptions & NumberParserOptions,
): NullableParser<number>;

export function $number(options?: NumberParserOptions): Parser<number>;

export function $number(
  options?: NumberParserOptions,
): MaybeNullableParser<number> {
  const parser = {
    parse: (input: unknown, ctx?: ParseContext) =>
      numberParse(options ?? {}, input, ctx),
  };
  return parser;
}
$number.parse = ((input: unknown, ctx?: ParseContext) =>
  numberParse({}, input, ctx)) as ParseFunc<number>;

//
// $string
//

type StringParserOptions = {
  default?: string;
  ifnull?: string;
  nullable?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  validate?: Validator<string>;
};

function stringParse(
  options: StringParserOptions,
  input: unknown,
  ctx: ParseContext | undefined,
): MaybeNullableResult<string> {
  ctx = createParseContext(ctx);

  let str;
  if (typeof input === "string") {
    str = input;
  } else if (isUndefined(input)) {
    if (options.default !== undefined) {
      return success(ctx, options.default);
    } else {
      return { success: false, errors: createError(ctx, "required") };
    }

  } else if (input === null) {
    if(!isUndefined(options.ifnull)) {
      str = options.ifnull;
    } else if (options.nullable) {
      return success(ctx, input);
    } else {
      return {
        success: false,
        errors: createError(ctx, "malformed_value"),
      }; //illegal input
    }
  } else if (typeof input === "object") {
    return {
      success: false,
      errors: createError(ctx, "malformed_value"),
    }; //illegal input
  } else {
    str = String(input);
  }

  if (options.min !== undefined && str.length < options.min) {
    return {
      success: false,
      errors: createOptionalError(ctx, "min", options.min),
    };
  } else if (options.max !== undefined && str.length > options.max) {
    return {
      success: false,
      errors: createOptionalError(ctx, "max", options.max),
    };
  } else if (options.pattern !== undefined && !options.pattern.test(str)) {
    return {
      success: false,
      errors: createOptionalError(ctx, "pattern", options.pattern),
    };
  } else if (options.validate !== undefined) {
    const result = options.validate(str, ctx);
    if (result !== true) {
      return {
        success: false,
        errors: createOptionalError(ctx, "validate", result),
      };
    }
  }

  return success(ctx, str);
}

export function $string(
  options: NullableOptions & StringParserOptions,
): NullableParser<string>;

export function $string(options?: StringParserOptions): Parser<string>;

export function $string(
  options?: StringParserOptions,
): MaybeNullableParser<string> {
  const parser = {
    parse: (input: unknown, ctx?: ParseContext) =>
      stringParse(options ?? {}, input, ctx),
  };
  return parser;
}
$string.parse = ((input: unknown, ctx?: ParseContext) =>
  stringParse({}, input, ctx)) as ParseFunc<string>;

//
// $boolean
//

type BooleanParserOptions = {
  default?: boolean;
  ifnull?: boolean;
  nullable?: boolean;
  validate?: Validator<boolean>;
};

function stringToBoolean(str: string): boolean | null {
  if (str.toLocaleLowerCase() === "true") {
    return true;
  } else if (str.toLocaleLowerCase() === "false") {
    return false;
  } else {
    return null;
  }
}

function booleanParse(
  options: BooleanParserOptions,
  input: unknown,
  ctx: ParseContext | undefined,
): MaybeNullableResult<boolean> {
  ctx = createParseContext(ctx);

  let value = undefined;
  if (typeof input === "boolean") {
    value = input;
  } else if (typeof input === "string") {
    const result = stringToBoolean(input);
    if (result !== null) {
      value = result;
    }

  } else if (isUndefined(input)) {
    if (options.default !== undefined) {
      value = options.default;
    } else {
      return {
        success: false,
        errors: createError(ctx, "required"),
      };
    }
  } else if (input === null) {
    if(!isUndefined(options.ifnull)) {
      value = options.ifnull;
    } else if (options.nullable) {
      return success(ctx, input);
    } else {
      return {
        success: false,
        errors: createError(ctx, "malformed_value"),
      };
    }
  }

  if (value === undefined) {
    return { success: false, errors: createError(ctx, "malformed_value") };
  } else if (options.validate !== undefined) {
    const result = options.validate(value, ctx);
    if (result !== true) {
      return {
        success: false,
        errors: createOptionalError(ctx, "validate", result),
      };
    }
  }

  return success(ctx, value);
}

export function $boolean(
  options: NullableOptions & BooleanParserOptions,
): NullableParser<boolean>;

export function $boolean(options?: BooleanParserOptions): Parser<boolean>;

export function $boolean(
  options?: BooleanParserOptions,
): MaybeNullableParser<boolean> {
  const parser = {
    parse: (input: unknown, ctx?: ParseContext) =>
      booleanParse(options ?? {}, input, ctx),
  };
  return parser;
}
$boolean.parse = ((input: unknown, ctx?: ParseContext) =>
  booleanParse({}, input, ctx)) as ParseFunc<boolean>;

//
// $object
//

// Hack to get TypeScript to show simplified types in error messages
type Pretty<T> = { [K in keyof T]: T[K] } & {};

type ObjectMapInfer<Map extends Record<string, Parser<any>>> = Pretty<
  { [K in keyof Map as Map[K] extends OptionalParser<any> ? never : K]: Infer<Map[K]> } &
  { [K in keyof Map as Map[K] extends OptionalParser<any> ? K : never]?: Infer<Map[K]> }
>;

type ObjectParserOptions<Map extends Record<string, Parser<any>>> = {
  default?: ObjectMapInfer<Map>;
  ifnull?: ObjectMapInfer<Map>;
  nullable?: boolean;
  exact?: boolean;
  validate?: Validator<ObjectMapInfer<Map>>;
};

function objectParse<Map extends Record<string, Parser<any>>>(
  map: Map,
  options: ObjectParserOptions<Map>,
  input: unknown,
  ctx: ParseContext | undefined,
): MaybeNullableResult<ObjectMapInfer<Map>> {
  ctx = createParseContext(ctx);

  const doValidate = (value: ObjectMapInfer<Map>) => {
    if(options.validate !== undefined) {
      const result = options.validate(value, ctx!);
      if (result !== true) {
        return {
          success: false as const,
          errors: createOptionalError(ctx!, "validate", result),
        };
      }
    }
    return true;
  };

  if (isUndefined(input)) {
    if (options.default !== undefined) {
      const validationResult = doValidate(options.default);
      if (validationResult !== true) {
        return validationResult;
      }
      return success(ctx, options.default);
    } else {
      return { success: false, errors: createError(ctx, "required") };
    }
  } else if(input === null) {
    if(!isUndefined(options.ifnull)) {
      const validationResult = doValidate(options.ifnull);
      if (validationResult !== true) {
        return validationResult;
      }
      return success(ctx, options.ifnull);
    } else if (options.nullable) {
      return success(ctx, input);
    } else {
      return { success: false, errors: createError(ctx, "malformed_value") };
    }
  }

  if (typeof input !== "object") {
    return { success: false, errors: createError(ctx, "malformed_value") };
  }

  const parsedObj = {} as ObjectMapInfer<Map>;
  pushParent(ctx, parsedObj);

  const unchecked = new Set(Object.keys(input!));
  let failed = false;

  for (const [key, parser] of Object.entries(map)) {
    if (key === "__proto__") {
      continue;
    }

    if(isOptionalParser(parser) && (key in (input as Record<string, any>)) === false) {
      //optionalなプロパティに対して、対応する入力フィールドが存在しなくてもOKなのでここでは何もしない
    } else {
      const item = (input as Record<string, any>)[key];
      ctx.name = key;
      const result = (parser.parse as ParseFuncInternal)(item, ctx);
      if (result.success) {
        parsedObj[key as keyof ObjectMapInfer<Map>] = result.value;
      } else {
        failed = true;
      }
    }
    unchecked.delete(key);
  }
  popParent(ctx);

  if (failed) {
    return { success: false, errors: ctx.errors };
  }
  if ((options.exact ?? true) && unchecked.size > 0) {
    return { success: false, errors: createError(ctx, "malformed_value") };
  } else {
    const validationResult = doValidate(parsedObj);
    if (validationResult !== true) {
      return validationResult;
    }
  }

  return success(ctx, parsedObj);
}

export function $object<Map extends Record<string, Parser<any>>>(
  map: Map,
  options: NullableOptions & ObjectParserOptions<Map>,
): NullableParser<ObjectMapInfer<Map>>;

export function $object<Map extends Record<string, Parser<any>>>(
  map: Map,
  options?: ObjectParserOptions<Map>,
): Parser<ObjectMapInfer<Map>>;

export function $object<Map extends Record<string, Parser<any>>>(
  map: Map,
  options?: ObjectParserOptions<Map>,
): MaybeNullableParser<ObjectMapInfer<Map>> {
  const parser = {
    parse: (input: unknown, ctx?: ParseContext) =>
      objectParse(map, options ?? {}, input, ctx),
  };
  return parser;
}

//
// $array
//

type ArrayParserOptions<T extends Parser<any>> = {
  default?: Array<Infer<T>>;
  ifnull?: Array<Infer<T>>;
  nullable?: boolean;
  min?: number;
  max?: number;
  validate?: Validator<Array<Infer<T>>>;
};

function arrayParse<T extends Parser<any>>(
  item: T,
  options: ArrayParserOptions<T>,
  input: unknown,
  ctx: ParseContext | undefined,
): NullableResult<Array<Infer<T>>> {
  ctx = createParseContext(ctx);

  const doValidate = (value: Array<Infer<T>>) => {
    if (options.min !== undefined && value.length < options.min) {
      return {
        success: false as const,
        errors: createOptionalError(ctx!, "min", options.min),
      };
    } else if (options.max !== undefined && value.length > options.max) {
      return {
        success: false as const,
        errors: createOptionalError(ctx!, "max", options.max),
      };
    } else if (options.validate !== undefined) {
      const result = options.validate(value, ctx!);
      if (result !== true) {
        return {
          success: false as const,
          errors: createOptionalError(ctx!, "validate", result),
        };
      }
    }
    return true;
  }

  if (isUndefined(input)) {
    if (options.default !== undefined) {
      const validationResult = doValidate(options.default);
      if (validationResult !== true) {
        return validationResult;
      }

      return success(ctx, options.default);
    } else {
      return { success: false, errors: createError(ctx, "required") };
    }
  } else if(input === null) {
    if(!isUndefined(options.ifnull)) {
      const validationResult = doValidate(options.ifnull);
      if (validationResult !== true) {
        return validationResult;
      }

      return success(ctx, options.ifnull);
    } else if (options.nullable) {
      return success(ctx, input);
    } else {
      return { success: false, errors: createError(ctx, "malformed_value") };
    }
  }

  if (!Array.isArray(input)) {
    return { success: false, errors: createError(ctx, "malformed_value") };
  }

  const parsed = [] as Array<Infer<T>>;
  pushParent(ctx, parsed);

  let failed = false;

  for (let i = 0; i < input.length; ++i) {
    ctx.name = i;
    const result = (item.parse as ParseFuncInternal)(input[i], ctx);
    if (result.success) {
      parsed.push(result.value);
    } else {
      failed = true;
    }
  }
  popParent(ctx);

  if (failed) {
    return { success: false, errors: ctx.errors };
  }

  const validationResult = doValidate(parsed);
  if (validationResult !== true) {
    return validationResult;
  }

  return success(ctx, parsed);
}

export function $array<T extends Parser<any>>(
  item: T,
  options: NullableOptions & ArrayParserOptions<T>,
): NullableParser<Array<Infer<T>>>;

export function $array<T extends Parser<any>>(
  item: T,
  options?: ArrayParserOptions<T>,
): Parser<Array<Infer<T>>>;

export function $array<T extends Parser<any>>(
  item: T,
  options?: ArrayParserOptions<T>,
): NullableParser<Array<Infer<T>>> {
  const parser = {
    parse: (input: unknown, ctx?: ParseContext) =>
      arrayParse(item, options ?? {}, input, ctx),
  };
  return parser;
}

//
// $union
//

function unionParse<Ts extends Array<Parser<any>>>(
  parsers: readonly [...Ts],
  input: unknown,
  ctx: ParseContext | undefined,
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
  parsers: readonly [...Ts],
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

function merge(base: unknown, other: unknown): unknown {
  if (typeof base === "undefined") {
    return other;
  } else if (base === null) {
    return null;
  } else if (typeof base === "object") {
    if (Array.isArray(base)) {
      if (typeof other === "object") {
        if (Array.isArray(other)) {
          return [...base, ...other];
        } else {
          return { ...base, ...other };
        }
      } else {
        //object値とプリミティブ値のマージは不可能なのでnullとする
        return null;
      }
    } else {
      if (typeof other === "object") {
        return { ...base, ...other };
      } else {
        //object値とプリミティブ値のマージは不可能なのでnullとする
        return null;
      }
    }
  } else {
    //プリミティブ値同士のマージの場合、同じ値以外はnullとする
    if (base === other) {
      return base;
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
        const boolBase =
          typeof base === "boolean" ? base : stringToBoolean(base);
        const boolOther =
          typeof other === "boolean" ? other : stringToBoolean(other);
        if (boolBase !== null && boolBase === boolOther) {
          return boolBase;
        }
      }

      return null;
    }
  }
}

function parseIntersection<Ts extends Array<Parser<any>>>(
  parsers: readonly [...Ts],
  input: unknown,
  ctx: ParseContext | undefined,
): Result<TupleToIntersection<ArrayMapInfer<Ts>>> {
  ctx = createParseContext(ctx);

  let value = undefined;
  for (const parser of parsers) {
    const result = (parser.parse as ParseFuncInternal)(input, ctx);
    if (!result.success) {
      return result;
    }

    value = merge(value, result.value);
    //マージした結果nullとなった場合は、マージ不可能な型同士であるため、失敗とする
    if (value === null) {
      return { success: false, errors: createError(ctx, "malformed_value") };
    }
  }

  if (value === undefined) {
    return { success: false, errors: createError(ctx, "malformed_value") };
  } else {
    return success(ctx, value as TupleToIntersection<ArrayMapInfer<Ts>>);
  }
}

export function $intersection<Ts extends Array<Parser<any>>>(
  parsers: readonly [...Ts],
): Parser<TupleToIntersection<ArrayMapInfer<Ts>>> {
  const parser = {
    parse: (input: unknown, ctx?: ParseContext) =>
      parseIntersection(parsers, input, ctx),
  };
  return parser;
}

//
// $literal
//

function literalParse<T>(
  literal: T,
  input: unknown,
  ctx: ParseContext | undefined,
): Result<T> {
  ctx = createParseContext(ctx);

  let match = false;
  if (Object.is(literal, input)) {
    match = true;
  } else if (input === undefined || input === null) {
    match = false;
  } else if (typeof literal === "object") {
    if (typeof input === "object") {
      match = deepEqual(literal, input);
    }
  } else if (typeof literal === "number") {
    if (typeof input === "string") {
      const number = Number(input);
      match = Object.is(literal, number);
    }
  } else if (typeof literal === "boolean") {
    if (typeof input === "string") {
      const bool = stringToBoolean(input);
      match = Object.is(literal, bool);
    }
  } else if (typeof literal === "string") {
    match = Object.is(literal, String(input));
  }

  if (match) {
    return success(ctx, literal);
  } else {
    return { success: false, errors: createError(ctx, "malformed_value") };
  }
}

type Literal<T> = T extends readonly any[]
  ? T extends [infer Head, ...infer Tail]
    ? [Literal<Head>, ...Literal<Tail>]
    : []
  : T extends object
  ? { [K in keyof T]: Literal<T[K]> }
  : T extends string | number | boolean | undefined | null
  ? T
  : never;

export function $literal<T>(literal: Literal<T>): Parser<Literal<T>> {
  const parser = {
    parse: (input: unknown, ctx?: ParseContext) =>
      literalParse(literal, input, ctx),
  };
  return parser;
}

//
// $optional
//

interface OptionalParser<T> extends Parser<T | undefined> {
  isOptional: true;
}

function isOptionalParser<T>(parser: Parser<T | undefined>): parser is OptionalParser<T> {
  return (parser as OptionalParser<T>).isOptional === true;
}

function parseOptional<T>(
  inner: Parser<T>,
  input: unknown,
  ctx?: ParseContext,
): Result<T | undefined> {
  ctx = createParseContext(ctx);
  if (typeof input === "undefined") {
    //inner.parseがdefault値を持っている可能性があるため、呼び出しを行った上でエラーを返したなら、エラーを無視してsuccessを返す
    const innerResult = (inner.parse as ParseFuncInternal)(input, ctx);
    if (innerResult.success) {
      return innerResult;
    } else {
      return success(ctx, input);
    }
  } else {
    return (inner.parse as ParseFuncInternal)(input, ctx);
  }
}

export function $optional<T>(inner: Parser<T>): OptionalParser<T> {
  const parser = {
    isOptional: true as const,
    parse: (input: unknown, ctx?: ParseContext) => parseOptional(inner, input, ctx),
  };
  return parser;
}
