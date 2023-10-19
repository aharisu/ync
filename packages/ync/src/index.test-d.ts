import { $array, $boolean, $number, $object, $string, Parser } from "src";
import { expectTypeOf, test } from "vitest";

test("number", () => {
  expectTypeOf($number()).toEqualTypeOf<Parser<number>>();
  expectTypeOf($number({ default: 0 })).toEqualTypeOf<Parser<number>>();
  expectTypeOf($number({ nullable: false })).toEqualTypeOf<Parser<number>>();
  expectTypeOf($number({ default: 0, nullable: true })).toEqualTypeOf<
    Parser<number>
  >();
  expectTypeOf($number({ default: 0, nullable: false })).toEqualTypeOf<
    Parser<number>
  >();

  //nullable pattern
  expectTypeOf($number({ nullable: true })).toEqualTypeOf<
    Parser<number | null | undefined>
  >();
  expectTypeOf($number({ nullable: true, default: undefined })).toEqualTypeOf<
    Parser<number | null | undefined>
  >();
});

test("string", () => {
  expectTypeOf($string()).toEqualTypeOf<Parser<string>>();
  expectTypeOf($string({ default: "" })).toEqualTypeOf<Parser<string>>();
  expectTypeOf($string({ nullable: false })).toEqualTypeOf<Parser<string>>();
  expectTypeOf($string({ default: "", nullable: true })).toEqualTypeOf<
    Parser<string>
  >();
  expectTypeOf($string({ default: "", nullable: false })).toEqualTypeOf<
    Parser<string>
  >();

  //nullable pattern
  expectTypeOf($string({ nullable: true })).toEqualTypeOf<
    Parser<string | null | undefined>
  >();
  expectTypeOf($string({ nullable: true, default: undefined })).toEqualTypeOf<
    Parser<string | null | undefined>
  >();
});

test("boolean", () => {
  expectTypeOf($boolean()).toEqualTypeOf<Parser<boolean>>();
  expectTypeOf($boolean({ default: true })).toEqualTypeOf<Parser<boolean>>();
  expectTypeOf($boolean({ nullable: false })).toEqualTypeOf<Parser<boolean>>();
  expectTypeOf($boolean({ default: true, nullable: true })).toEqualTypeOf<
    Parser<boolean>
  >();
  expectTypeOf($boolean({ default: true, nullable: false })).toEqualTypeOf<
    Parser<boolean>
  >();

  //nullable pattern
  expectTypeOf($boolean({ nullable: true })).toEqualTypeOf<
    Parser<boolean | null | undefined>
  >();
  expectTypeOf($boolean({ nullable: true, default: undefined })).toEqualTypeOf<
    Parser<boolean | null | undefined>
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
    $object({ a: $number }, { default: { a: 0 }, nullable: true }),
  ).toEqualTypeOf<Parser<{ a: number }>>();
  expectTypeOf(
    $object({ a: $number }, { default: { a: 0 }, nullable: false }),
  ).toEqualTypeOf<Parser<{ a: number }>>();

  //nullable pattern
  expectTypeOf($object({ a: $number }, { nullable: true })).toEqualTypeOf<
    Parser<{ a: number } | null | undefined>
  >();
  expectTypeOf(
    $object({ a: $number }, { nullable: true, default: undefined }),
  ).toEqualTypeOf<Parser<{ a: number } | null | undefined>>();
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
    $array($number, { default: [1, 2], nullable: true }),
  ).toEqualTypeOf<Parser<number[]>>();
  expectTypeOf(
    $array($number, { default: [1, 2], nullable: false }),
  ).toEqualTypeOf<Parser<number[]>>();

  //nullable pattern
  expectTypeOf($array($number, { nullable: true })).toEqualTypeOf<
    Parser<number[] | null | undefined>
  >();
  expectTypeOf(
    $array($number, { nullable: true, default: undefined }),
  ).toEqualTypeOf<Parser<number[] | null | undefined>>();
});
