:::article{.contents}

# $object

入力が定義したオブジェクト構造と一致することを検証します。

## 使い方

```typescript
import { $number, $string, $object, $option, Infer } from "yncc";

const schema = $object({
  id: $number,
  name: $string,
  age: $option($number),
});

const result = schema.parse({
    id: 1,
    name: "yncc",
    age: 20,
});
if (result.success) {
  const value = result.value; //value: { id: number, name: string, age?: number }
} else {
  const errors = result.errors; //errors: ParseError[]
}

schema.parse({
    id: "1024",
    name: true,
); // ✅ success
schema.parse({
    id: 1,
    age: 20,
}); // ⛔ failure
schema.parse([]); // ⛔ failure

type User = Infer<typeof schema>;
// type User = { id: number, name: string, age?: number }
```

## パースルール

入力値がobject型の場合、スキーマ定義をもとに再帰的に各フィールドを検証します。:br
すべてのフィールドの検証に成功した場合、object型自身の検証も成功となります。:br
入力がobject型以外の場合は常に失敗します。

## オプション

| 名称     | 型                | 説明                                             |
| :------- | :---------------- | :----------------------------------------------- |
| :a[default]{href="#default-object"}  | :span[object]{.type}            | 入力値が存在しない場合に代用する値を指定します。 |
| :a[nullable]{href="#nullable-boolean"} | :span[boolean]{.type}           | nullを許可します。                               |
| :a[ifnull]{href="#ifnull-object"}   | :span[object]{.type}            | nullの場合の値を指定します。                     |
| :a[exact]{href="#exact-boolean"} | :span[boolean]{.type} | デフォルト: `true`:br`false`を指定した場合、入力オブジェクト内にスキーマ定義に存在しないフィールドを許可します。                   |
| :a[validate]{href="#validate-validatorobject"} | :span[Validator\<object\>]{.type} | 値を検証する関数を指定します。                   |

---

### :span[default]{.code-name}: :span[object]{.type}

入力値が存在しない場合に代用する値を指定します:br
undefinedのみ適用され、nullには適用されません。nullの代替値を指定したい場合はifnullオプションを使用してください。

```typescript
$object({ id: $number }, { default: { id: 0 } }).parse(undefined);
// => { success: true, value: { id: 0 } }

// nullには適用されません
$object({ id: $number}, { default: { id: 0 } }).parse(null);
// => { success: false, errors: [ { path: [], kind: 'malformed_value' } ] }
```

---

### :span[nullable]{.code-name}: :span[boolean]{.type}

trueを指定した場合、nullの入力値を許可します。:br
nullにのみ適用され、undefinedには適用されません。undefinedを許可したい場合は$option関数を使用してください。

```typescript
$object({ id: $number }, { nullable: true }).parse(null);
// => { success: true, value: null }

// undefinedには適用されません
$object({ id: $number }, { nullable: true }).parse(undefined);
// => { success: false, errors: [ { path: [], kind: 'required' } ] }
```

nullableにtrueを指定した場合、parseの戻り値の型は:span[object | null]{.type}になります。何も指定しない、もしくはfalseを指定した場合はparseの戻り値は:span[object]{.type}です。:br
ただし、ifnullオプションを指定した場合は常に:span[object]{.type}になります。

```typescript
// v1: { id: number, name: string }
const v1 = $object({ id: $number, name: $string }).parse({ id: 1, name: "yncc"}).value;
// v2: { id: number, name: string } | null
const v2 = $object({ id: $number, name: $string }, { nullable: true }).parse({ id: 1, name: "yncc"}).value;
// v3: { id: number, name: string }
const v3 = $object({ id: $number, name: $string }, { nullable: true, ifnull: { id: 0, name: "*default*" } }).parse(null).value;
```

---

### :span[ifnull]{.code-name}: :span[object]{.type}

入力値がnullの場合に代用する値を指定します。:br
nullにのみ適用され、undefinedには適用されません。undefinedの代替値を指定したい場合はdefaultオプションを使用してください。

```typescript
$object({ id: $number }, { ifnull: { id: 0 } }).parse(null);
// => { success: true, value: { id: 0 } }

// undefinedには適用されません
$object({ id: $number }, { ifnull: { id: 0} }).parse(undefined);
// => { success: false, errors: [ { path: [], kind: 'required' } ] }
```

---

### :span[exact]{.code-name}: :span[boolean]{.type}

デフォルト: `true`:br
`false`を指定した場合、入力オブジェクト内にスキーマ定義に存在しないフィールドがあっても検証に成功します。:br
ただし型定義は正確に行われるため、スキーマに存在しないフィールドは型定義に含まれません。

```typescript
$object({ id: $number }, { exact: false }).parse({ id: 1, name: "yncc" });
// => { success: true, value: { id: 1, name: "yncc" } }
```

`true`を指定するか、オプションとして何も指定しない場合は、入力オブジェクトとスキーマ定義のフィールドが完全に一致する場合のみ検証に成功します。

```typescript
$object({ id: $number }, { exact: true }).parse({ id: 1, name: "yncc" });
// => {
//  success: false,
//  errors: [{ path: [], kind: 'malformed_value' }]
// }
```

---

### :span[validate]{.code-name}: :span[Validator\<object\>]{.type}

入力値を検証するカスタム関数を指定します。

```typescript
$object(
    { password: $string, confirmation: $string },
    { validate: (value) => value.password === value.confirmation }
).parse({ password: "mother", confirmation: "other" });
// => {
//   success: false,
//   errors: [
//     {
//       path: [],
//       kind: 'optional_validation_failure',
//       option: 'validate',
//       optionValue: false
//     }
//   ]
// }
```

エラーメッセージを指定することもできます
```typescript
$object(
    { password: $string, confirmation: $string },
    { validate: (value) => value.password === value.confirmation ? true : "password mismatch" }
).parse({ password: "mother", confirmation: "other" });
// => {
//   success: false,
//   errors: [
//     {
//       path: [],
//       kind: 'optional_validation_failure',
//       option: 'validate',
//       optionValue: 'password mismatch'
//     }
//   ]
// }

:::
