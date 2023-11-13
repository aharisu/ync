:::article{.contents}

# $number

入力が数値であることを検証します。

## 使い方

```typescript
import { $number } from "yncc";

const result = $number.parse(1);
if (result.success) {
  const value = result.value; //value: number
} else {
  const errors = result.errors; //errors: ParseError[]
}

$number.parse("1024"); // ✅ success
$number.parse("0x20"); // ✅ success
$number.parse("Hello world"); // ⛔ failure
$number.parse(true); // ⛔ failure
$number.parse({}); // ⛔ failure

$number({ nullable: true }).parse(null); // ✅ success
```

## パースルール

入力値がNaNを除くnumber型の場合、常に成功します。
NaNの場合はallowNaNオプションにtrueを指定しない限りは失敗になります。:br
入力が文字列の場合、数値として認識できるなら数値に変換します。:br
文字列以外の場合は常に失敗します。

### 例

```typescript
✅ "32" => 32
✅ "0x20" => 32
✅ "0o40" => 32
✅ "0b100000" => 32
✅ "32.0" => 32
⛔ "Hello world"
⛔ "32px"
```

## オプション

| 名称     | 型                | 説明                                             |
| :------- | :---------------- | :----------------------------------------------- |
| :a[default]{href="#default-number"}  | :span[number]{.type}            | 入力値が存在しない場合に代用する値を指定します。 |
| :a[nullable]{href="#nullable-boolean"} | :span[boolean]{.type}           | nullを許可します。                               |
| :a[ifnull]{href="#ifnull-number"}   | :span[number]{.type}            | nullの場合の値を指定します。                     |
| :a[allowNaN]{href="#allownan-boolean"} | :span[boolean]{.type}           | NaNを許可します。                                |
| :a[min]{href="#min-number"}      | :span[number]{.type}            | 最小値を指定します。                             |
| :a[max]{href="#max-number"}      | :span[number]{.type}            | 最大値を指定します。                             |
| :a[validate]{href="#validate-validatornumber"} | :span[Validator\<number\>]{.type} | 値を検証する関数を指定します。                   |

---

### :span[default]{.code-name}: :span[number]{.type}

入力値が存在しない場合に代用する値を指定します:br
undefinedのみ適用され、nullには適用されません。nullの代替値を指定したい場合はifnullオプションを使用してください。

```typescript
$number({ default: 42 }).parse(undefined);
// => { success: true, value: 42 }

// nullには適用されません
$number({ default: 42 }).parse(null);
// => { success: false, errors: [ { path: [], kind: 'malformed_value' } ] }
```

---

### :span[nullable]{.code-name}: :span[boolean]{.type}

trueを指定した場合、nullの入力値を許可します。:br
nullにのみ適用され、undefinedには適用されません。undefinedを許可したい場合は$option関数を使用してください。

```typescript
$number({ nullable: true }).parse(null);
// => { success: true, value: null }

// undefinedには適用されません
$number({ nullable: true }).parse(undefined);
// => { success: false, errors: [ { path: [], kind: 'required' } ] }
```

nullableにtrueを指定した場合、parseの戻り値の型は`number | null`になります。何も指定しない、もしくはfalseを指定した場合はparseの戻り値は`number`です。:br
ただし、ifnullオプションを指定した場合は常に`number`になります。

```typescript
// v1: number
const v1 = $number.parse(1).value;
// v2: number | null
const v2 = $number({ nullable: true }).parse(1).value;
// v3: number
const v3 = $number({ nullable: true, ifnull: 0 }).parse(1).value;
```

---

### :span[ifnull]{.code-name}: :span[number]{.type}

入力値がnullの場合に代用する値を指定します。:br
nullにのみ適用され、undefinedには適用されません。undefinedの代替値を指定したい場合はdefaultオプションを使用してください。

```typescript
$number({ ifnull: 42 }).parse(null);
// => { success: true, value: 42 }

// undefinedには適用されません
$number({ ifnull: 42 }).parse(undefined);
// => { success: false, errors: [ { path: [], kind: 'required' } ] }
```

---

### :span[allowNaN]{.code-name}: :span[boolean]{.type}

trueを指定した場合、NaNの入力値を許可します。:br
allowNaNがfalseもしくは何も指定しない場合、入力値がNaNの場合は常に失敗します。:br
allowNaNがtrueで入力値がNaNの時、minとmax、validateオプションは無視されます。

```typescript
$number({ allowNaN: true }).parse(NaN);
// => { success: true, value: NaN }

$number({ allowNaN: true, min: 5, max: 10 }).parse(NaN);
// => { success: true, value: NaN }
```

---

### :span[min]{.code-name}: :span[number]{.type}

入力値が指定した値より小さい場合に失敗します。:br
値の検証はdefaultやifnullで指定した値にも適用されます。

```typescript
$number({ min 5 }).parse(4);
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

入力値が指定した値より大きい場合に失敗します。:br
値の検証はdefaultやifnullで指定した値にも適用されます。

```typescript
$number({ max 5 }).parse(6);
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

### :span[validate]{.code-name}: :span[Validator\<number\>]{.type}

入力値を検証するカスタム関数を指定します。

```typescript
$number({ validate: (value) => value % 2 === 0 }).parse(1);
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
$number({
  validate: (value) => (value % 2 === 0 ? true : "need even number"),
}).parse(1);
// => {
//   success: false,
//   errors: [
//     {
//       path: [],
//       kind: 'optional_validation_failure',
//       option: 'validate',
//       optionValue: 'need even number'
//     }
//   ]
// }
```

:::