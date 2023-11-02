# Yncc

Yncc is a validator and parser inspired by lizod, which in turn was inspired by zod.

## Installation

```bash
npm install -S yncc
```

## Why is it named Yncc?

Yncc is a library that takes one step back from Zod.

```
Y ← Z
n ← o
c ← d
c ???
```

## Basic usage

Its writing style is similar to zod, and it has been particularly influenced by lizod.

```typescript
import { $object, $string, $number } from "yncc";

// Create a schema
const schema = $object({
  name: $string,
  age: $number,
});

// parse a value
schema.parse({ name: "John", age: 42 });
// => ✅ { success: true, value: { name: 'John', age: 42 } }

schema.parse({ name: "John" });
// => ⛔ { success: false, errors: [{ path ['age'], kind: 'required' }] }
```

### Specify it along with the options.

```typescript
import { $object, $string, $number } from "yncc";

// Create a schema
const schema = $object({
  name: $string({ nullable: true }),
  age: $number({ default: 0, min: 0, max: 100 }),
});

schema.parse({ name: null, age: 42 });
// => ✅ { success: true, value: {name: null, age: 42} }

schema.parse({});
// => ✅ { success: true, value: {name: null, age: 0} }

schema.parse({ age: 101 });
// => ⛔ {
//  success: false,
//  errors: [{
//    path ['age'],
//    kind: 'optional_validation_failure',
//    option: 'max',
//    optionValue: 100
//  }]}
```

## Yncc is a parser

```typescript
import { $object, $string, $number } from "yncc";

// Create a schema
const schema = $object({
  name: $string,
  age: $number,
});

// parse a value
schema.parse({ name: 1024, age: "0x20" });
// => ✅ {success: true, value: { name: '1024', age: 32 } }
```

It has a significantly different concept compared to zod and lizod. <br />
Yncc is a library designed with a focus on parsing. It interprets data as numbers if it can be recognized as number and interprets it as string if it can be recognized as string.

## Parsing rules

### $number

- If the value is a string, it will attempt to parse it as a number.
  - ✅ "32" => 32
  - ✅ "0x20" => 32
  - ✅ "0o40" => 32
  - ✅ "0b100000" => 32
  - ✅ "32.0" => 32
  - ⛔ "Hello world"
  - ⛔ "32px"
- Other types will trigger an error.
  - ⛔ true / false

### $boolean

- If the value is a string, it will attempt to parse it as a boolean.
  - ✅ "true" => true
  - ✅ "TRUE" => true
  - ✅ "false" => false
  - ✅ "FALSE" => false
  - ⛔ "on"
  - ⛔ "off"
- Other types will trigger an error.
  - ⛔ 0
  - ⛔ 1

### $string

- If the value is a number, it will attempt to parse it as a string.
  - ✅ 32 => "32"
  - ✅ 32.0 => "32"
  - ✅ 0x20 => "32"
  - ✅ 0o40 => "32"
  - ✅ 0b100000 => "32"
- If the value is a boolean, it will attempt to parse it as a string.
  - ✅ true => "true"
  - ✅ false => "false"
- Other types will trigger an error.
  - ⛔ { a: 1 }
  - ⛔ [0, 1, 2]
