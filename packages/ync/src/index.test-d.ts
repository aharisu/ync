import { $array, $boolean, $literal, $number, $object, $optional, $string, $union, Parser } from "src";
import { expectTypeOf, test } from "vitest";

test("number", () => {
  expectTypeOf($number()).toEqualTypeOf<Parser<number>>();
  expectTypeOf($number({ default: 0 })).toEqualTypeOf<Parser<number>>();
  expectTypeOf($number({ nullable: false })).toEqualTypeOf<Parser<number>>();
  expectTypeOf($number({ default: 0, nullable: false })).toEqualTypeOf<
    Parser<number>
  >();

  expectTypeOf($number({ ifnull: 0, nullable: true })).toEqualTypeOf<
    Parser<number>
  >();
  expectTypeOf($number({ ifnull: 0, nullable: false })).toEqualTypeOf<
    Parser<number>
  >();

  //nullable pattern
  expectTypeOf($number({ nullable: true })).toEqualTypeOf<
    Parser<number | null>
  >();
  expectTypeOf($number({ nullable: true, default: undefined })).toEqualTypeOf<
    Parser<number | null>
  >();
  expectTypeOf($number({ nullable: true, default: 0 })).toEqualTypeOf<
    Parser<number | null>
  >();
  expectTypeOf($number({ nullable: true, ifnull: undefined })).toEqualTypeOf<
    Parser<number | null>
  >();
});

test("string", () => {
  expectTypeOf($string()).toEqualTypeOf<Parser<string>>();
  expectTypeOf($string({ default: "" })).toEqualTypeOf<Parser<string>>();
  expectTypeOf($string({ nullable: false })).toEqualTypeOf<Parser<string>>();
  expectTypeOf($string({ default: "", nullable: false })).toEqualTypeOf<
    Parser<string>
  >();

  expectTypeOf($string({ ifnull: "", nullable: true })).toEqualTypeOf<
    Parser<string>
  >();
  expectTypeOf($string({ ifnull: "", nullable: false })).toEqualTypeOf<
    Parser<string>
  >();

  //nullable pattern
  expectTypeOf($string({ nullable: true })).toEqualTypeOf<
    Parser<string | null>
  >();
  expectTypeOf($string({ nullable: true, default: undefined })).toEqualTypeOf<
    Parser<string | null>
  >();
  expectTypeOf($string({ nullable: true, default: "" })).toEqualTypeOf<
    Parser<string | null>
  >();
  expectTypeOf($string({ nullable: true, ifnull: undefined })).toEqualTypeOf<
    Parser<string | null>
  >();
});

test("boolean", () => {
  expectTypeOf($boolean()).toEqualTypeOf<Parser<boolean>>();
  expectTypeOf($boolean({ default: true })).toEqualTypeOf<Parser<boolean>>();
  expectTypeOf($boolean({ nullable: false })).toEqualTypeOf<Parser<boolean>>();
  expectTypeOf($boolean({ default: true, nullable: false })).toEqualTypeOf<
    Parser<boolean>
  >();

  expectTypeOf($boolean({ ifnull: true, nullable: true })).toEqualTypeOf<
    Parser<boolean>
  >();
  expectTypeOf($boolean({ ifnull: true, nullable: false })).toEqualTypeOf<
    Parser<boolean>
  >();

  //nullable pattern
  expectTypeOf($boolean({ nullable: true })).toEqualTypeOf<
    Parser<boolean | null>
  >();
  expectTypeOf($boolean({ nullable: true, default: undefined })).toEqualTypeOf<
    Parser<boolean | null>
  >();
  expectTypeOf($boolean({ nullable: true, default: true,  })).toEqualTypeOf<
    Parser<boolean | null>
  >();
  expectTypeOf($boolean({ nullable: true, ifnull: undefined,  })).toEqualTypeOf<
    Parser<boolean | null>
  >();
});

test("object", () => {
  expectTypeOf($object({ a: $number })).toEqualTypeOf<Parser<{ a: number }>>();
  expectTypeOf($object({ a: $number }, { default: { a: 0 } })).toEqualTypeOf<
    Parser<{ a: number }>
  >();
  expectTypeOf($object({ a: $number }, { nullable: false })).toEqualTypeOf<
    Parser<{ a: number }>
  >();
  expectTypeOf(
    $object({ a: $number }, { default: { a: 0 }, nullable: false }),
  ).toEqualTypeOf<Parser<{ a: number }>>();

  expectTypeOf(
    $object({ a: $number }, { ifnull : { a: 0 }, nullable: true }),
  ).toEqualTypeOf<Parser<{ a: number }>>();

  expectTypeOf(
    $object({ a: $number }, { ifnull : { a: 0 }, nullable: false }),
  ).toEqualTypeOf<Parser<{ a: number }>>();

  //nullable pattern
  expectTypeOf($object({ a: $number }, { nullable: true })).toEqualTypeOf<
    Parser<{ a: number } | null>
  >();
  expectTypeOf(
    $object({ a: $number }, { nullable: true, default: undefined }),
  ).toEqualTypeOf<Parser<{ a: number } | null>>();
  expectTypeOf(
    $object({ a: $number }, { nullable: true, default: { a: 0 } }),
  ).toEqualTypeOf<Parser<{ a: number } | null>>();
  expectTypeOf(
    $object({ a: $number }, { nullable: true, ifnull: undefined }),
  ).toEqualTypeOf<Parser<{ a: number } | null>>();
});

test("array", () => {
  expectTypeOf($array($number)).toEqualTypeOf<Parser<number[]>>();
  expectTypeOf($array($number, { default: [1, 2] })).toEqualTypeOf<
    Parser<number[]>
  >();
  expectTypeOf($array($number, { nullable: false })).toEqualTypeOf<
    Parser<number[]>
  >();
  expectTypeOf(
    $array($number, { default: [1, 2], nullable: false }),
  ).toEqualTypeOf<Parser<number[]>>();

  expectTypeOf(
    $array($number, { ifnull: [1, 2], nullable: true }),
  ).toEqualTypeOf<Parser<number[]>>();

  expectTypeOf(
    $array($number, { ifnull: [1, 2], nullable: false }),
  ).toEqualTypeOf<Parser<number[]>>();

  //nullable pattern
  expectTypeOf($array($number, { nullable: true })).toEqualTypeOf<
    Parser<number[] | null>
  >();
  expectTypeOf(
    $array($number, { nullable: true, default: undefined }),
  ).toEqualTypeOf<Parser<number[] | null>>();
  expectTypeOf(
    $array($number, { nullable: true, default: [1, 2] }),
  ).toEqualTypeOf<Parser<number[] | null>>();

  expectTypeOf(
    $array($number, { nullable: true, ifnull: undefined }),
  ).toEqualTypeOf<Parser<number[] | null>>();
});

test("literal", () => {
  expectTypeOf($literal(null)).toEqualTypeOf<Parser<null>>();
  expectTypeOf($literal(undefined)).toEqualTypeOf<Parser<undefined>>();
  expectTypeOf($literal(1)).toEqualTypeOf<Parser<1>>();
  expectTypeOf($literal(3.14)).toEqualTypeOf<Parser<3.14>>();
  expectTypeOf(
    $literal({ a: "hello", b: "world", c: { d: "!!" } }),
  ).toEqualTypeOf<Parser<{ a: "hello"; b: "world"; c: { d: "!!" } }>>();

  expectTypeOf(
    $literal([1, "2", 3.14, true, { a: "hello", b: ["world"] }]),
  ).toEqualTypeOf<Parser<[1, "2", 3.14, true, { a: "hello"; b: ["world"] }]>>();

  //NaN is not literal
  expectTypeOf($literal(NaN)).toEqualTypeOf<Parser<number>>();
});

test("complex", () => {
  expectTypeOf(
    $union([
      $object({
        flag: $literal(true),
        value: $string,
      }),
      $object({
        flag: $literal(false),
        value: $optional($string),
      }),
    ]),
  ).toEqualTypeOf<Parser<{ flag: true; value: string } | { flag: false, value?: string }>>();
});