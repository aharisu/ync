:::article{.contents}

# $array

入力が指定された定義の配列であることを検証します。

## 使い方

```typescript
import { $number, $array, Infer } from "yncc";

const schema = $array($number);

const result = schema.parse([1, 2, 3]);
if (result.success) {
  const value = result.value; //value: number[]
} else {
  const errors = result.errors; //errors: ParseError[]
}

schema.parse([1, "2", 3]); // ✅ success
schema.parse([]); // ✅ success
schema.parse({}); // ⛔ failure

type Array = Infer<typeof schema>;
// type Array = number[]
```

## パースルール
入力値が配列の場合、要素のスキーマ定義をもとに再帰的に各要素を検証します。:br
すべての要素の検証に成功した場合、配列自身の検証も成功となります。:br
入力が配列以外の場合は常に失敗します。:br
配列であることのチェックは`Array.isArray`を使用しています。

## オプション

| 名称     | 型                | 説明                                             |
| :------- | :---------------- | :----------------------------------------------- |
| :a[default]{href="#default-array"}  | :span[array]{.type}            | 入力値が存在しない場合に代用する値を指定します。 |
| :a[nullable]{href="#nullable-boolean"} | :span[boolean]{.type}           | nullを許可します。                               |
| :a[ifnull]{href="#ifnull-array"}   | :span[array]{.type}            | nullの場合の値を指定します。                     |
| :a[min]{href="#min-number"}      | :span[number]{.type}            | 配列の最小要素数を指定します。                             |
| :a[max]{href="#max-number"}      | :span[number]{.type}            | 配列の最大要素数を指定します。                             |
| :a[validate]{href="#validate-validatorarray"} | :span[Validator\<array\>]{.type} | 値を検証する関数を指定します。                   |

---

### :span[default]{.code-name}: :span[array]{.type}

入力値が存在しない場合に代用する値を指定します:br
undefinedのみ適用され、nullには適用されません。nullの代替値を指定したい場合はifnullオプションを使用してください。

```typescript
$array($number, { default: [] }).parse(undefined);
// => { success: true, value: [] }

// nullには適用されません
$array($number, { default: [] }).parse(null);
// => { success: false, errors: [ { path: [], kind: 'malformed_value' } ] }
```

---

### :span[nullable]{.code-name}: :span[boolean]{.type}

trueを指定した場合、nullの入力値を許可します。:br
nullにのみ適用され、undefinedには適用されません。undefinedを許可したい場合は$option関数を使用してください。

```typescript
$array($number, { nullable: true }).parse(null);
// => { success: true, value: null }

// undefinedには適用されません
$array($number, { nullable: true }).parse(undefined);
// => { success: false, errors: [ { path: [], kind: 'required' } ] }
```

nullableにtrueを指定した場合、parseの戻り値の型は`array | null`になります。何も指定しない、もしくはfalseを指定した場合はparseの戻り値は`array`です。:br
ただし、ifnullオプションを指定した場合は常に`array`になります。

```typescript
// v1: number[]
const v1 = $array($number).parse([1]).value;
// v2: number[] | null
const v2 = $array($number, { nullable: true }).parse([1]).value;
// v3: number[]
const v3 = $array($number, { nullable: true, ifnull: [] }).parse([1]).value;
```

---

### :span[ifnull]{.code-name}: :span[array]{.type}

入力値がnullの場合に代用する値を指定します。:br
nullにのみ適用され、undefinedには適用されません。undefinedの代替値を指定したい場合はdefaultオプションを使用してください。

```typescript
$array($number, { ifnull: [] }).parse(null);
// => { success: true, value: [] }

// undefinedには適用されません
$array($number, { ifnull: [] }).parse(undefined);
// => { success: false, errors: [ { path: [], kind: 'required' } ] }
```

---

### :span[min]{.code-name}: :span[number]{.type}

入力配列の長さが指定した値より小さい場合に失敗します。:br
値の検証はdefaultやifnullで指定した値にも適用されます。

```typescript
$array($number, { min 5 }).parse([1, 2, 3, 4]);
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

入力配列の長さが指定した値より大きい場合に失敗します。:br
値の検証はdefaultやifnullで指定した値にも適用されます。

```typescript
$array($number, { max 5 }).parse([1, 2, 3, 4, 5, 6]);
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

### :span[validate]{.code-name}: :span[Validator\<array\>]{.type}

入力値を検証するカスタム関数を指定します。

```typescript
$array($number, { validate: (value) => value.length % 2 === 0 }).parse([1]);
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
$array($number, {
  validate: (value) => (value.length % 2 === 0 ? true : "need even number of items"),
}).parse([1]);
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
