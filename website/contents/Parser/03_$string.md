:::article{.contents}

# $string

入力が文字列であることを検証します。

## 使い方

```typescript
import { $string } from "yncc";

const result = $string.parse("Hello world");
if (result.success) {
  const value = result.value; //value: string
} else {
  const errors = result.errors; //errors: ParseError[]
}

$string.parse("1024"); // ✅ success
$string.parse(1024); // ✅ success
$string.parse(true); // ✅ success
$string.parse({}); // ⛔ failure
$string.parse([]); // ⛔ failure

$string({ nullable: true }).parse(null); // ✅ success
```

## パースルール

入力値がstring型の場合、常に成功します。:br
他にも、number型やboolean型も文字列に変換することで常に成功します。:br
配列を含むobject型は常に失敗します。

### 例

```typescript
✅ 32 => "32"
✅ 0x20 => "32"
✅ true => "true"
✅ false => "false"
```

## オプション

| 名称     | 型                | 説明                                             |
| :------- | :---------------- | :----------------------------------------------- |
| :a[default]{href="#default-string"}  | :span[string]{.type}            | 入力値が存在しない場合に代用する値を指定します。 |
| :a[nullable]{href="#nullable-boolean"} | :span[boolean]{.type}           | nullを許可します。                               |
| :a[ifnull]{href="#ifnull-string"}   | :span[string]{.type}            | nullの場合の値を指定します。                     |
| :a[min]{href="#min-number"}      | :span[number]{.type}            | 文字列の最小長さを指定します。                             |
| :a[max]{href="#max-number"}      | :span[number]{.type}            | 文字列の最大長さを指定します。                             |
| :a[pattern]{href="#pattern-regexp"} | :span[RegExp]{.type} | 値を検証する正規表現を指定します。                   |
| :a[validate]{href="#validate-validatorstring"} | :span[Validator\<string\>]{.type} | 値を検証する関数を指定します。                   |

---

### :span[default]{.code-name}: :span[string]{.type}

入力値が存在しない場合に代用する値を指定します:br
undefinedのみ適用され、nullには適用されません。nullの代替値を指定したい場合はifnullオプションを使用してください。

```typescript
$string({ default: "Hello" }).parse(undefined);
// => { success: true, value: "Hello" }

// nullには適用されません
$string({ default: "Hello" }).parse(null);
// => { success: false, errors: [ { path: [], kind: 'malformed_value' } ] }
```

---

### :span[nullable]{.code-name}: :span[boolean]{.type}

trueを指定した場合、nullの入力値を許可します。:br
nullにのみ適用され、undefinedには適用されません。undefinedを許可したい場合は$option関数を使用してください。

```typescript
$string({ nullable: true }).parse(null);
// => { success: true, value: null }

// undefinedには適用されません
$string({ nullable: true }).parse(undefined);
// => { success: false, errors: [ { path: [], kind: 'required' } ] }
```

nullableにtrueを指定した場合、parseの戻り値の型は:span[string | null]{.type}になります。何も指定しない、もしくはfalseを指定した場合はparseの戻り値は:span[string]{.type}です。:br
ただし、ifnullオプションを指定した場合は常に:span[string]{.type}になります。

```typescript
// v1: string
const v1 = $string.parse("hello").value;
// v2: string | null
const v2 = $string({ nullable: true }).parse("hello").value;
// v3: string
const v3 = $string({ nullable: true, ifnull: "hello" }).parse("world").value;
```

---

### :span[ifnull]{.code-name}: :span[string]{.type}

入力値がnullの場合に代用する値を指定します。:br
nullにのみ適用され、undefinedには適用されません。undefinedの代替値を指定したい場合はdefaultオプションを使用してください。

```typescript
$string({ ifnull: "world" }).parse(null);
// => { success: true, value: "world" }

// undefinedには適用されません
$string({ ifnull: "world" }).parse(undefined);
// => { success: false, errors: [ { path: [], kind: 'required' } ] }
```

---

### :span[min]{.code-name}: :span[number]{.type}

入力文字列の長さが指定した値より短い場合に失敗します。:br
値の検証はdefaultやifnullで指定した値にも適用されます。

```typescript
$string({ min: 5 }).parse("hey!");
// => {
//   success: false,
//   errors: [
//     {
//       path: [],
//       kind: 'optional_validation_failure',
//       option: 'min',
//       optionValue: 5
//     }
//   ]
// }
```
---

### :span[max]{.code-name}: :span[number]{.type}

入力文字列が指定の正規表現と一致しない場合に失敗します。:br
値の検証はdefaultやifnullで指定した値にも適用されます。

```typescript
$string({ max 5 }).parse("Hello World");
// => {
//   success: false,
//   errors: [
//     {
//       path: [],
//       kind: 'optional_validation_failure',
//       option: 'max',
//       optionValue: 5
//     }
//   ]
// }
```

---

### :span[pattern]{.code-name}: :span[RegExp]{.type}

入力文字列の長さが指定した値より長い場合に失敗します。:br
値の検証はdefaultやifnullで指定した値にも適用されます。

```typescript
$string({ pattern: /^\d+$/ }).parse("Hello");
// => {
//   success: false,
//   errors: [
//     {
//       path: [],
//       kind: 'optional_validation_failure',
//       option: 'pattern',
//       optionValue: /^\d+$/
//     }
//   ]
// }
```

---

### :span[validate]{.code-name}: :span[Validator\<string\>]{.type}

入力値を検証するカスタム関数を指定します。

```typescript
$string({ validate: (value) => value.toLowerCase() === value }).parse("Hello");
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
$string({
  validate: (value) => (value.toLowerCase() === value ? true : "need lower case"),
}).parse("Hello");
// => {
//   success: false,
//   errors: [
//     {
//       path: [],
//       kind: 'optional_validation_failure',
//       option: 'validate',
//       optionValue: 'need lower case'
//     }
//   ]
// }
```

:::