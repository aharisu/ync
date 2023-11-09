:::article{.contents}

# $boolean

入力がブーリアンであることを検証します。

## 使い方

```typescript
import { $boolean } from "yncc";

const result = $boolean.parse(true);
if (result.success) {
  const value = result.value; //value: boolean
} else {
  const errors = result.errors; //errors: ParseError[]
}

$boolean.parse("true"); // ✅ success
$boolean.parse("false"); // ✅ success
$boolean.parse("TRUE"); // ✅ success
$boolean.parse("False"); // ✅ success
$boolean.parse({}); // ⛔ failure

$boolean({ nullable: true }).parse(null); // ✅ success
```

## パースルール

入力値がboolean型の場合、常に成功します。:br
入力が文字列の場合、大文字小文字を無視して"true"ならtrueと認識して、"false"ならfalseとして認識します。:br
上記以外の場合は常に失敗します。

### 例

```typescript
✅ "true" => true
✅ "false" => false
✅ "True" => true
⛔ "Yes"
⛔ 1
⛔ 0
```

## オプション

| 名称     | 型                | 説明                                             |
| :------- | :---------------- | :----------------------------------------------- |
| :a[default]{href="#default-boolean"}  | :span[boolean]{.type}            | 入力値が存在しない場合に代用する値を指定します。 |
| :a[nullable]{href="#nullable-boolean"} | :span[boolean]{.type}           | nullを許可します。                               |
| :a[ifnull]{href="#ifnull-boolean"}   | :span[boolean]{.type}            | nullの場合の値を指定します。                     |
| :a[validate]{href="#validate-validatorboolean"} | :span[Validator\<boolean\>]{.type} | 値を検証する関数を指定します。                   |

### :span[default]{.code-name}: :span[boolean]{.type}

入力値が存在しない場合に代用する値を指定します:br
undefinedのみ適用され、nullには適用されません。nullの代替値を指定したい場合はifnullオプションを使用してください。

```typescript
$boolean({ default: false }).parse(undefined);
// => { success: true, value: false }

// nullには適用されません
$boolean({ default: false }).parse(null);
// => { success: false, errors: [ { path: [], kind: 'malformed_value' } ] }
```

---

### :span[nullable]{.code-name}: :span[boolean]{.type}

trueを指定した場合、nullの入力値を許可します。:br
nullにのみ適用され、undefinedには適用されません。undefinedを許可したい場合は$option関数を使用してください。

```typescript
$boolean({ nullable: true }).parse(null);
// => { success: true, value: null }

// undefinedには適用されません
$boolean({ nullable: true }).parse(undefined);
// => { success: false, errors: [ { path: [], kind: 'required' } ] }
```

nullableにtrueを指定した場合、parseの戻り値の型は`boolean | null`になります。何も指定しない、もしくはfalseを指定した場合はparseの戻り値は`boolean`です。:br
ただし、ifnullオプションを指定した場合は常に`boolean`になります。

```typescript
// v1: boolean
const v1 = $boolean.parse(true).value;
// v2: boolean | null
const v2 = $boolean({ nullable: true }).parse(true).value;
// v3: boolean
const v3 = $boolean({ nullable: true, ifnull: false }).parse(true).value;
```

---

### :span[ifnull]{.code-name}: :span[boolean]{.type}

入力値がnullの場合に代用する値を指定します。:br
nullにのみ適用され、undefinedには適用されません。undefinedの代替値を指定したい場合はdefaultオプションを使用してください。

```typescript
$boolean({ ifnull: false }).parse(null);
// => { success: true, value: false }

// undefinedには適用されません
$boolean({ ifnull: false }).parse(undefined);
// => { success: false, errors: [ { path: [], kind: 'required' } ] }
```

---

### :span[validate]{.code-name}: :span[Validator\<boolean\>]{.type}

入力値を検証するカスタム関数を指定します。

```typescript
$boolean({ validate: (value) => value === true }).parse(false);
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
$boolean({
  validate: (value) => (value === true ? true : "need true"),
}).parse(false);
// => {
//   success: false,
//   errors: [
//     {
//       path: [],
//       kind: 'optional_validation_failure',
//       option: 'validate',
//       optionValue: 'need true'
//     }
//   ]
// }
```

:::