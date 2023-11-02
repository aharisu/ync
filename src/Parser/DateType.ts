import {
  MaybeNullableParser,
  MaybeNullableResult,
  NullableOptions,
  NullableParser,
  ParseContext,
  Pretty,
  createError,
  createOptionalError,
  createParseContext,
  isUndefined,
  success,
} from "./common";

import { parse as parseDateFNS, parseISO as parseISODateFNS } from "date-fns";
import { ParseFunc, Parser, Validator } from "./type";

//
// $date
//

type FormatOptions = Pretty<
  {
    /**
     * This is a format specification for use with the `parse` function of `date-fns`.
     * Specify formats like "yyyy-MM-dd".
     *
     * For a complete explanation, refer to https://date-fns.org/v2.30.0/docs/parse.
     *
     * If not specified, parse using `parseISO`.
     */
    format: string;

    /**
     * This is a reference date for use with the `parse` function of `date-fns`.
     *
     * If not specified, using `Date.now()`.
     */
    referenceDate?: Parameters<typeof parseDateFNS>[2];
  } & Parameters<typeof parseDateFNS>[3]
>;

type DateParserOptions = {
  default?: Date;
  ifnull?: Date;
  nullable?: boolean;
  validate?: Validator<Date>;

  /**
   * If `formatOptions` are specified, use the `parse` function of `date-fns`.
   *
   * If not specified, use the `parseISO` function.
   */
  formatOptions?: FormatOptions;
};

function dateParse(
  options: DateParserOptions,
  input: unknown,
  ctx: ParseContext | undefined
): MaybeNullableResult<Date> {
  ctx = createParseContext(ctx);

  let date: Date | null = null;
  if (input instanceof Date) {
    date = input;
  } else {
    if (typeof input === "number") {
      input = String(input);
    }

    if (isUndefined(input)) {
      if (!isUndefined(options.default)) {
        date = options.default;
      } else {
        return {
          success: false,
          errors: createError(ctx, "required"),
        };
      }
    } else if (input === null) {
      if (!isUndefined(options.ifnull)) {
        date = options.ifnull;
      } else if (options.nullable) {
        return success(ctx, null);
      } else {
        return {
          success: false,
          errors: createError(ctx, "malformed_value"),
        };
      }
    } else if (typeof input === "string") {
      if (!isUndefined(options.formatOptions)) {
        date = parseDateFNS(
          input,
          options.formatOptions.format,
          options.formatOptions.referenceDate ?? Date.now(),
          options.formatOptions
        );
      } else {
        date = parseISODateFNS(input);
      }
      if (Number.isNaN(date.getTime())) {
        return {
          success: false,
          errors: createError(ctx, "malformed_value"),
        };
      }
    }
  }

  if (date === null) {
    return {
      success: false,
      errors: createError(ctx, "malformed_value"),
    };
  } else if (!isUndefined(options.validate)) {
    const result = options.validate(date, ctx);
    if (result !== true) {
      return {
        success: false,
        errors: createOptionalError(ctx, "validate", result),
      };
    }
  }

  return success(ctx, date);
}

export function $date(
  options: NullableOptions & DateParserOptions
): NullableParser<Date>;

export function $date(options?: DateParserOptions): Parser<Date>;

export function $date(options?: DateParserOptions): MaybeNullableParser<Date> {
  const parser = {
    parse: (input: unknown, ctx?: ParseContext) =>
      dateParse(options ?? {}, input, ctx),
  };
  return parser;
}
$date.parse = ((input: unknown, ctx?: ParseContext) =>
  dateParse({}, input, ctx)) as ParseFunc<Date>;
