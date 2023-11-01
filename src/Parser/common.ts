import { AccessPath, ParseError, ParseNode, Parser, Result } from "./type";

export type ParseContext = {
  name: undefined | string | symbol | number;
  errors: Array<ParseError>;
  parent: ParseNode | undefined;
};

export function createParseContext(
  ctx: ParseContext | undefined
): ParseContext {
  return ctx ?? { name: undefined, errors: [], parent: undefined };
}

function getPath(ctx: ParseContext): AccessPath {
  const path: AccessPath = [];
  if (ctx.name !== undefined) {
    path.push(ctx.name);
  }
  let node = ctx.parent;
  while (node?.name !== undefined) {
    path.unshift(node.name);

    node = node.parent;
  }

  return path;
}

export function pushParent(ctx: ParseContext, value: unknown): void {
  ctx.parent = {
    name: ctx.name,
    parent: ctx.parent,
    value: value,
  };
}

export function popParent(ctx: ParseContext): void {
  ctx.name = ctx.parent!.name;
  ctx.parent = ctx.parent!.parent;
}

export type NullableOptions = {
  ifnull?: never;
  nullable: true;
};

export type ParseFuncInternal<T = any> = (
  input: unknown,
  ctx: ParseContext | undefined
) => Result<T>;

export type NullableParser<T> = Parser<T | null>;
export type NullableResult<T> = Result<T | null>;

export type MaybeNullableParser<T> = Parser<T> | NullableParser<T>;
export type MaybeNullableResult<T> = Result<T> | NullableResult<T>;

export function createError(
  ctx: ParseContext,
  kind: Exclude<ParseError["kind"], "optional_validation_failure">
): Array<ParseError> {
  ctx.errors.push({
    path: getPath(ctx),
    kind: kind,
  });

  return ctx.errors;
}

export function createOptionalError(
  ctx: ParseContext,
  option: string,
  optionValue: any
): Array<ParseError> {
  ctx.errors.push({
    path: getPath(ctx),
    kind: "optional_validation_failure",
    option: option,
    optionValue: optionValue,
  });

  return ctx.errors;
}

export function success<T>(ctx: ParseContext, value: T): Result<T> {
  return {
    success: true,
    value: value,
  };
}

export function isUndefined(input: unknown): input is undefined {
  return typeof input === "undefined";
}

export function stringToBoolean(str: string): boolean | null {
  if (str.toLocaleLowerCase() === "true") {
    return true;
  } else if (str.toLocaleLowerCase() === "false") {
    return false;
  } else {
    return null;
  }
}
