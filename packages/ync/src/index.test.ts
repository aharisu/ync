import { expect, test } from "vitest";

import {
  $number,
  $string,
  $boolean,
  $object,
  $array,
  $intersection,
  $union,
  Infer,
  $literal,
  $optional,
} from "./index";

function success<T>(actual: T) {
  return { success: true, value: actual };
}

function error(
  kind: "malformed_value" | "required" | "optional_validation_failure",
  path?: (string | number)[],
  option?: string,
  optionValue?: any,
) {
  const error = {
    kind: kind,
    path: path ?? [],
  } as any;
  if (option !== undefined) {
    error["option"] = option;
  }
  if (optionValue !== undefined) {
    error["optionValue"] = optionValue;
  }

  return error;
}

function failure(error: any, ...errors: any[]) {
  return { success: false, errors: [error, ...errors] };
}

test("number", () => {
  expect($number.parse(0)).toStrictEqual(success(0));
  expect($number.parse(1)).toStrictEqual(success(1));
  expect($number.parse(-1)).toStrictEqual(success(-1));
  expect($number.parse(1.1)).toStrictEqual(success(1.1));
  expect($number.parse(-1.1)).toStrictEqual(success(-1.1));
  expect($number.parse("0")).toStrictEqual(success(0));
  expect($number.parse("1")).toStrictEqual(success(1));
  expect($number.parse("-1")).toStrictEqual(success(-1));
  expect($number.parse("1.1")).toStrictEqual(success(1.1));
  expect($number.parse("-1.1")).toStrictEqual(success(-1.1));
  expect($number.parse(" 1 ")).toStrictEqual(success(1));
  expect($number.parse(" 1.1 ")).toStrictEqual(success(1.1));
  expect($number.parse("123e-4")).toStrictEqual(success(123e-4));
  expect($number.parse("0x10")).toStrictEqual(success(0x10));
  expect($number.parse("0o10")).toStrictEqual(success(0o10));
  expect($number.parse("0b10")).toStrictEqual(success(0b10));
  expect($number.parse("Infinity")).toStrictEqual(success(Infinity));
  expect($number.parse("-Infinity")).toStrictEqual(success(-Infinity));

  // How should we interpret an empty string?
  expect($number.parse("")).toStrictEqual(success(0));
  expect($number.parse("      ")).toStrictEqual(success(0));

  expect($number.parse("100ABC")).toStrictEqual(
    failure(error("malformed_value")),
  );
  expect($number.parse(undefined)).toStrictEqual(failure(error("required")));
  expect($number.parse(null)).toStrictEqual(failure(error("malformed_value")));
  expect($number.parse(true)).toStrictEqual(failure(error("malformed_value")));
  expect($number.parse(false)).toStrictEqual(failure(error("malformed_value")));
  expect($number.parse([])).toStrictEqual(failure(error("malformed_value")));
  expect($number.parse({})).toStrictEqual(failure(error("malformed_value")));

  expect($number.parse(NaN)).toStrictEqual(failure(error("malformed_value")));
});

test("number with options", () => {
  expect($number({ min: 5 }).parse(4)).toStrictEqual(
    failure(error("optional_validation_failure", [], "min", 5)),
  );
  expect($number({ min: 5 }).parse(5)).toStrictEqual(success(5));
  expect($number({ min: 5 }).parse(6)).toStrictEqual(success(6));

  expect($number({ max: 5 }).parse(4)).toStrictEqual(success(4));
  expect($number({ max: 5 }).parse(5)).toStrictEqual(success(5));
  expect($number({ max: 5 }).parse(6)).toStrictEqual(
    failure(error("optional_validation_failure", [], "max", 5)),
  );

  expect($number({ min: 5, max: 10 }).parse(4)).toStrictEqual(
    failure(error("optional_validation_failure", [], "min", 5)),
  );
  expect($number({ min: 5, max: 10 }).parse(5)).toStrictEqual(success(5));
  expect($number({ min: 5, max: 10 }).parse(10)).toStrictEqual(success(10));
  expect($number({ min: 5, max: 10 }).parse(11)).toStrictEqual(
    failure(error("optional_validation_failure", [], "max", 10)),
  );

  expect($number({ allowNan: true }).parse(NaN)).toStrictEqual(success(NaN));

  expect($number({ default: 10 }).parse(undefined)).toStrictEqual(success(10));

  expect($number({ nullable: true }).parse(undefined)).toStrictEqual(
    failure(error("required"))
  );
  expect($number({ nullable: true }).parse(null)).toStrictEqual(success(null));
  expect($number({ nullable: true }).parse(10)).toStrictEqual(success(10));
  expect(
    $number({ default: 10, nullable: true }).parse(undefined),
  ).toStrictEqual(success(10));
  expect($number({ default: 10, nullable: true }).parse(null)).toStrictEqual(
    success(null),
  );

  expect($number({ ifnull: 10 }).parse(null)).toStrictEqual(
    success(10),
  );
  expect($number({ ifnull: 10, nullable: true }).parse(null)).toStrictEqual(
    success(10),
  );

  expect($number({ nullable: true }).parse([])).toStrictEqual(
    failure(error("malformed_value")),
  );
});

test("number with validate", () => {
  expect($number({ validate: (value) => value > 0 }).parse(0)).toStrictEqual(
    failure(error("optional_validation_failure", [], "validate", false)),
  );

  expect(
    $number({
      validate: (value) => (value > 0 ? true : "error message"),
    }).parse(0),
  ).toStrictEqual(
    failure(
      error("optional_validation_failure", [], "validate", "error message"),
    ),
  );
});

test("string", () => {
  expect($string().parse("")).toStrictEqual(success(""));

  expect($string.parse("")).toStrictEqual(success(""));
  expect($string.parse(" ")).toStrictEqual(success(" "));
  expect($string.parse("hello")).toStrictEqual(success("hello"));
  expect($string.parse(" hello ")).toStrictEqual(success(" hello "));
  expect($string.parse(123)).toStrictEqual(success("123"));
  expect($string.parse(123.45)).toStrictEqual(success("123.45"));
  expect($string.parse(true)).toStrictEqual(success("true"));

  // How should we interpret NaN?
  expect($string.parse(NaN)).toStrictEqual(success("NaN"));

  expect($string.parse(undefined)).toStrictEqual(failure(error("required")));
  expect($string.parse(null)).toStrictEqual(failure(error("malformed_value")));
  expect($string.parse([])).toStrictEqual(failure(error("malformed_value")));
  expect($string.parse({})).toStrictEqual(failure(error("malformed_value")));
});

test("string with options", () => {
  expect($string({ min: 5 }).parse("1234")).toStrictEqual(
    failure(error("optional_validation_failure", [], "min", 5)),
  );
  expect($string({ min: 5 }).parse("12345")).toStrictEqual(success("12345"));
  expect($string({ min: 5 }).parse("123456")).toStrictEqual(success("123456"));

  expect($string({ max: 5 }).parse("1234")).toStrictEqual(success("1234"));
  expect($string({ max: 5 }).parse("12345")).toStrictEqual(success("12345"));
  expect($string({ max: 5 }).parse("123456")).toStrictEqual(
    failure(error("optional_validation_failure", [], "max", 5)),
  );

  expect($string({ min: 5, max: 10 }).parse("1234")).toStrictEqual(
    failure(error("optional_validation_failure", [], "min", 5)),
  );
  expect($string({ min: 5, max: 10 }).parse("12345")).toStrictEqual(
    success("12345"),
  );
  expect($string({ min: 5, max: 10 }).parse("1234567890")).toStrictEqual(
    success("1234567890"),
  );
  expect($string({ min: 5, max: 10 }).parse("12345678901")).toStrictEqual(
    failure(error("optional_validation_failure", [], "max", 10)),
  );

  expect($string({ pattern: /^hello$/ }).parse("hello")).toStrictEqual(
    success("hello"),
  );
  expect($string({ pattern: /^\d+$/ }).parse("123")).toStrictEqual(
    success("123"),
  );

  expect(
    $string({ pattern: /^[-+]?\d+(\.\d+)?$/ }).parse("-123.45"),
  ).toStrictEqual(success("-123.45"));

  expect($string({ pattern: /^\d{5,}$/ }).parse("1234")).toStrictEqual(
    failure(error("optional_validation_failure", [], "pattern", /^\d{5,}$/)),
  );
  expect($string({ pattern: /^\d$/, min: 5 }).parse("1234")).toStrictEqual(
    failure(error("optional_validation_failure", [], "min", 5)),
  );

  expect($string({ default: "hello" }).parse(undefined)).toStrictEqual(
    success("hello"),
  );
  expect($string({ default: "hello" }).parse(null)).toStrictEqual(
    failure(error("malformed_value")),
  );

  // If a valid value is specified and it fails to parse, the default value will be ignored.
  expect($string({ default: "hello" }).parse({})).toStrictEqual(
    failure(error("malformed_value")),
  );
  expect($string({ default: "hello" }).parse([])).toStrictEqual(
    failure(error("malformed_value")),
  );

  expect($string({ nullable: true }).parse(undefined)).toStrictEqual(
    failure(error("required")),
  );
  expect($string({ nullable: true }).parse(null)).toStrictEqual(success(null));
  expect($string({ nullable: true }).parse("hello")).toStrictEqual(
    success("hello"),
  );
  expect(
    $string({ default: "hello", nullable: true }).parse(undefined),
  ).toStrictEqual(success("hello"));
  expect(
    $string({ default: "hello", nullable: true }).parse(null),
  ).toStrictEqual(success(null));

  expect(
    $string({ ifnull: "hello" }).parse(null),
  ).toStrictEqual(success("hello"));

  expect(
    $string({ ifnull: "hello", nullable: true }).parse(null),
  ).toStrictEqual(success("hello"));

  expect($string({ nullable: true }).parse([])).toStrictEqual(
    failure(error("malformed_value")),
  );
});

test("string with validate", () => {
  expect(
    $string({ validate: (value) => value.length > 5 }).parse("abc"),
  ).toStrictEqual(
    failure(error("optional_validation_failure", [], "validate", false)),
  );

  expect(
    $string({
      validate: (value) => (value.length > 5 ? true : "error message"),
    }).parse("abc"),
  ).toStrictEqual(
    failure(
      error("optional_validation_failure", [], "validate", "error message"),
    ),
  );
});

test("boolean", () => {
  expect($boolean().parse(true)).toStrictEqual(success(true));

  expect($boolean.parse(true)).toStrictEqual(success(true));
  expect($boolean.parse(false)).toStrictEqual(success(false));
  expect($boolean.parse("true")).toStrictEqual(success(true));
  expect($boolean.parse("false")).toStrictEqual(success(false));
  expect($boolean.parse("TRUE")).toStrictEqual(success(true));
  expect($boolean.parse("FALSE")).toStrictEqual(success(false));

  expect($boolean.parse("yes")).toStrictEqual(
    failure(error("malformed_value")),
  );
  expect($boolean.parse("no")).toStrictEqual(failure(error("malformed_value")));
  expect($boolean.parse("1")).toStrictEqual(failure(error("malformed_value")));
  expect($boolean.parse("0")).toStrictEqual(failure(error("malformed_value")));
  expect($boolean.parse(undefined)).toStrictEqual(failure(error("required")));
  expect($boolean.parse(null)).toStrictEqual(failure(error("malformed_value")));
  expect($boolean.parse([])).toStrictEqual(failure(error("malformed_value")));
  expect($boolean.parse({})).toStrictEqual(failure(error("malformed_value")));
});

test("boolean with options", () => {
  expect($boolean({ default: true }).parse(undefined)).toStrictEqual(
    success(true),
  );
  expect($boolean({ default: true }).parse("hello")).toStrictEqual(
    failure(error("malformed_value")),
  );

  expect($boolean({ nullable: true }).parse(undefined)).toStrictEqual(
    failure(error("required")),
  );
  expect($boolean({ nullable: true }).parse(null)).toStrictEqual(success(null));
  expect($boolean({ nullable: true }).parse(true)).toStrictEqual(success(true));
  expect(
    $boolean({ default: true, nullable: true }).parse(undefined),
  ).toStrictEqual(success(true));
  expect($boolean({ default: true, nullable: true }).parse(null)).toStrictEqual(
    success(null),
  );

  expect(
    $boolean({ ifnull: true }).parse(null),
  ).toStrictEqual(success(true));

  expect(
    $boolean({ ifnull: true, nullable: true }).parse(null),
  ).toStrictEqual(success(true));

  expect($boolean({ nullable: true }).parse([])).toStrictEqual(
    failure(error("malformed_value")),
  );
});

test("boolean with validate", () => {
  expect(
    $boolean({ validate: (value) => value === true }).parse("false"),
  ).toStrictEqual(
    failure(error("optional_validation_failure", [], "validate", false)),
  );

  expect(
    $boolean({
      validate: (value) => (value === true ? true : "error message"),
    }).parse("false"),
  ).toStrictEqual(
    failure(
      error("optional_validation_failure", [], "validate", "error message"),
    ),
  );
});

test("object", () => {
  expect($object({}).parse({})).toStrictEqual(success({}));

  expect(
    $object({
      a: $string,
      b: $number,
      c: $boolean,
    }).parse({
      a: "hello",
      b: 123,
      c: true,
    }),
  ).toStrictEqual(
    success({
      a: "hello",
      b: 123,
      c: true,
    }),
  );

  expect(
    $object({
      a: $string,
      b: $number,
      c: $boolean,
    }).parse({
      a: "hello",
      b: "123.0",
      c: "false",
    }),
  ).toStrictEqual(
    success({
      a: "hello",
      b: 123.0,
      c: false,
    }),
  );

  expect(
    $object({
      nest: $object({
        a: $string,
        b: $number,
        c: $boolean,
      }),
    }).parse({
      nest: {
        a: "hello",
        b: "123.0",
        c: "false",
      },
    }),
  ).toStrictEqual(
    success({
      nest: {
        a: "hello",
        b: 123.0,
        c: false,
      },
    }),
  );

  expect(
    $object({
      a: $string,
      b: $number,
    }).parse({
      a: "hello",
      b: "123.0ABC",
    }),
  ).toStrictEqual(failure(error("malformed_value", ["b"])));

  expect(
    $object({
      a: $string,
      b: $number,
    }).parse({
      a: "hello",
    }),
  ).toStrictEqual(failure(error("required", ["b"])));
});

test("object with options", () => {
  expect(
    $object(
      {
        a: $string,
        b: $number,
      },
      {
        exact: true,
      },
    ).parse({
      a: "hello",
      b: 123,
      c: "other",
    }),
  ).toStrictEqual(failure(error("malformed_value")));

  expect(
    $object(
      {
        a: $string,
      },
      {
        exact: false,
      },
    ).parse({
      a: "hello",
      b: "other",
    }),
  ).toStrictEqual(
    success({
      a: "hello",
    }),
  );

  expect($object({}, { default: {} }).parse(undefined)).toStrictEqual(
    success({}),
  );
  expect($object({}, { default: {} }).parse(null)).toStrictEqual(failure(error("malformed_value")));
  expect($object({}, { nullable: true }).parse(undefined)).toStrictEqual(
    failure(error("required")),
  );
  expect($object({}, { nullable: true }).parse(null)).toStrictEqual(
    success(null),
  );
  expect($object({}, { nullable: true }).parse({})).toStrictEqual(success({}));

  expect($object({}, { ifnull: {} }).parse(null)).toStrictEqual(success({}));

  expect($object({}, { nullable: true }).parse("other")).toStrictEqual(
    failure(error("malformed_value")),
  );
});

test("object with validate", () => {
  expect(
    $object(
      {
        a: $string,
      },
      { validate: (value) => value.a.length > 5 },
    ).parse({
      a: "abc",
    }),
  ).toStrictEqual(
    failure(error("optional_validation_failure", [], "validate", false)),
  );

  expect(
    $object(
      {
        a: $string,
      },
      {
        validate: (value) => (value.a.length > 5 ? true : "error message"),
      },
    ).parse({
      a: "abc",
    }),
  ).toStrictEqual(
    failure(
      error("optional_validation_failure", [], "validate", "error message"),
    ),
  );

  expect(
    $object({
      a: $string,
      b: $string({
        validate: (value, ctx) => {
          return (ctx.parent?.value as any).a.length === value.length;
        },
      }),
    }).parse({
      a: "hello",
      b: "world",
    }),
  ).toStrictEqual(success({ a: "hello", b: "world" }));

  expect(
    $object({
      a: $string,
      b: $string({
        validate: (value, ctx) => {
          return (ctx.parent?.value as any).a === value;
        },
      }),
    }).parse({
      a: "hello",
      b: "world",
    }),
  ).toStrictEqual(
    failure(error("optional_validation_failure", ["b"], "validate", false)),
  );

  expect(
    $object({
      a: $string,
      b: $string({
        validate: (value, ctx) => {
          return (ctx.parent?.value as any).a === value;
        },
      }),
      nest: $object({
        c: $number,
        d: $number({
          validate: (value, ctx) => {
            return (
              (ctx.parent?.value as any).c === value &&
              (ctx.parent?.parent?.value as any).b.length === value
            );
          },
        }),
      }),
    }).parse({
      a: "hello",
      b: "hello",
      nest: {
        c: 5,
        d: 5,
      },
    }),
  ).toStrictEqual(success({ a: "hello", b: "hello", nest: { c: 5, d: 5 } }));
});

test("array", () => {
  expect($array($string).parse([])).toStrictEqual(success([]));
  expect($array($string).parse(["hello", "world"])).toStrictEqual(
    success(["hello", "world"]),
  );
  expect($array($string).parse(["hello", 123])).toStrictEqual(
    success(["hello", "123"]),
  );
  expect($array($number).parse(["123", 456.7])).toStrictEqual(
    success([123, 456.7]),
  );

  expect(
    $array($object({ a: $string })).parse([{ a: "hello" }, { a: "world" }]),
  ).toStrictEqual(success([{ a: "hello" }, { a: "world" }]));

  expect($array($string).parse(undefined)).toStrictEqual(
    failure(error("required")),
  );
  expect($array($string).parse(null)).toStrictEqual(failure(error("malformed_value")));
  expect($array($string).parse("other")).toStrictEqual(
    failure(error("malformed_value")),
  );
  expect($array($string).parse({})).toStrictEqual(
    failure(error("malformed_value")),
  );
  expect($array($number).parse(["123", "other"])).toStrictEqual(
    failure(error("malformed_value", [1])),
  );
});

test("array with options", () => {
  expect($array($string, { min: 2 }).parse(["hello"])).toStrictEqual(
    failure(error("optional_validation_failure", [], "min", 2)),
  );
  expect($array($string, { min: 2 }).parse(["hello", "world"])).toStrictEqual(
    success(["hello", "world"]),
  );

  expect($array($string, { max: 2 }).parse(["hello", "world"])).toStrictEqual(
    success(["hello", "world"]),
  );
  expect(
    $array($string, { max: 2 }).parse(["hello", "world", "other"]),
  ).toStrictEqual(failure(error("optional_validation_failure", [], "max", 2)));

  expect(
    $array($string, { default: ["hello"] }).parse(undefined),
  ).toStrictEqual(success(["hello"]));
  expect($array($string, { default: ["hello"] }).parse(null)).toStrictEqual(
    failure(error("malformed_value")),
  );

  expect($array($string, { ifnull: ["hello"] }).parse(null)).toStrictEqual(
    success(["hello"]),
  );

  expect($array($string, { nullable: true }).parse(undefined)).toStrictEqual(
    failure(error("required")),
  );
  expect($array($string, { nullable: true }).parse(null)).toStrictEqual(
    success(null),
  );
  expect($array($string, { nullable: true }).parse(["hello"])).toStrictEqual(
    success(["hello"]),
  );
  expect(
    $array($string, { default: ["hello"], nullable: true }).parse(undefined),
  ).toStrictEqual(success(["hello"]));
  expect(
    $array($string, { default: ["hello"], nullable: true }).parse(null),
  ).toStrictEqual(success(null));

  expect($array($string, { nullable: true }).parse("other")).toStrictEqual(
    failure(error("malformed_value")),
  );
});

test("array with validate", () => {
  expect(
    $array($number, { validate: (value) => value.length > 5 }).parse([1, 2, 3]),
  ).toStrictEqual(
    failure(error("optional_validation_failure", [], "validate", false)),
  );

  expect(
    $array($number, {
      validate: (value) => (value.length > 5 ? true : "error message"),
    }).parse([1, 2, 3]),
  ).toStrictEqual(
    failure(
      error("optional_validation_failure", [], "validate", "error message"),
    ),
  );
});

test("union", () => {
  expect($union([$string, $number]).parse("hello")).toStrictEqual(
    success("hello"),
  );
  expect($union([$boolean, $number]).parse(1)).toStrictEqual(success(1));
  expect($union([$boolean, $number]).parse(true)).toStrictEqual(success(true));

  expect(
    $union([$boolean({ nullable: true }), $number]).parse(null),
  ).toStrictEqual(success(null));

  expect($union([$boolean, $number]).parse(undefined)).toStrictEqual(
    failure(error("required"), error("required")),
  );
  expect($union([$boolean, $number]).parse(null)).toStrictEqual(
    failure(error("malformed_value"), error("malformed_value")),
  );
  expect($union([$boolean, $number]).parse("hello")).toStrictEqual(
    failure(error("malformed_value"), error("malformed_value")),
  );

  //Ambiguous case
  //"123" can be interpreted as both a string and a number, so the result may vary depending on the order of definition.
  expect($union([$string, $number]).parse("123")).toStrictEqual(success("123"));
  expect($union([$number, $string]).parse("123")).toStrictEqual(success(123));
});

test("intersection", () => {
  expect(
    $intersection([
      $object({ a: $string }, { exact: false }),
      $object({ b: $number }, { exact: false }),
    ]).parse({ a: "hello", b: 123 }),
  ).toStrictEqual(success({ a: "hello", b: 123 }));

  //※Special case
  //Due to the specifications of the ync parser,
  //$number and $boolean are subsets of $string.
  //Therefore, in TypeScript, while "number & string" which becomes "never" can be parsed as a "number" in this parser,
  //and "boolean & string" can be parsed as a "boolean".
  expect($intersection([$string, $number]).parse(1)).toStrictEqual(success(1));
  expect($intersection([$string, $boolean]).parse(true)).toStrictEqual(
    success(true),
  );

  expect(
    $intersection([
      $union([$string, $number]),
      $union([$boolean, $number]),
    ]).parse(1),
  ).toStrictEqual(success(1));
});

test("literal", () => {
  expect($literal(null).parse(null)).toStrictEqual(success(null));
  expect($literal(undefined).parse(undefined)).toStrictEqual(
    success(undefined),
  );
  expect($literal(true).parse(true)).toStrictEqual(success(true));
  expect($literal(1).parse(1)).toStrictEqual(success(1));
  expect($literal(NaN).parse(NaN)).toStrictEqual(success(NaN));
  expect($literal("test").parse("test")).toStrictEqual(success("test"));
  expect($literal(1).parse("1")).toStrictEqual(success(1));
  expect($literal(true).parse("true")).toStrictEqual(success(true));
  //object literal not implemented
  //expect($literal({ a: "test" }).parse(true)).toStrictEqual(success({a: "test"));
});

test("nested_error", () => {
  expect(
    $object({
      nest: $object({
        ary: $array($number),
      }),
      other: $array(
        $object({
          a: $boolean,
        }),
      ),
    }).parse({
      nest: {
        ary: [1, 2, "other", 4, "hoge"],
      },
      other: [{ a: true }, { a: "other" }, { a: false }],
    }),
  ).toStrictEqual(
    failure(
      error("malformed_value", ["nest", "ary", 2]),
      error("malformed_value", ["nest", "ary", 4]),
      error("malformed_value", ["other", 1, "a"]),
    ),
  );
});

test("complex", () => {
  const union = $union([
    $object({
      flag: $literal(true),
      value: $string,
    }),
    $object({
      flag: $literal(false),
      value: $optional($string),
    }),
  ]);

  expect(union.parse({ flag: true, value: "hello" })).toStrictEqual(
    success({ flag: true, value: "hello" }),
  );
  expect(union.parse({ flag: false })).toStrictEqual(success({ flag: false }));

  expect(union.parse({ flag: false, value: "test" })).toStrictEqual(success({ flag: false, value: "test" }));
});
