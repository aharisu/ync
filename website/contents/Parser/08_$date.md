# $date

入力値が日付として認識できるかを検証します。

## 使い方

```typescript
import { $date } from "yncc";

const result = $date.parse("2020-01-01");
if (result.success) {
  const value = result.value; //value: Date
} else {
  const errors = result.errors; //errors: ParseError[]
}

$date.parse(new Date()); // ✅ success
//ISO Date with time zone
$date.parse("2020-01-01T00:00:00Z"); // ✅ success
$date.parse("2020-01-01T00:00:00+09:00"); // ✅ success

//ISO Date String Y-m-d only
$date.parse("2020-01-01"); // ✅ success

//with format string
$date({
    formatOptions: {
        format: "MM-dd",
    },
}).parse("01-01"); // ✅ success

$date({
    formatOptions: {
        format: "yyyy年MM月dd日",
    },
}).parse("2020年1月1日"); // ✅ success
```

## パースルール

入力値が`Date`オブジェクトの場合、常に成功します。:br
入力値が`number`型の場合、**string型**に変換して、string型としてパースを試みます。:br
入力値が`string`型の場合、オプション指定に基づきDateオブジェクトへの変換を試みます。:br
その他の型の場合は常に失敗します。

## date-fns

文字列からDateオブジェクトへの変換はすべて[date-fns](https://date-fns.org/)を使用しています。:br
ISO 8601の日付文字列はdate-fnsの[parseISO関数](https://date-fns.org/v2.16.1/docs/parseISO)で行います:br
フォーマット指定のオプションの書式もdate-fnsの[parse関数](https://date-fns.org/v2.16.1/docs/parse)に依存しています。

## オプション
| 名称     | 型                | 説明                                             |
| :------- | :---------------- | :----------------------------------------------- |
| :a[default]{href="#default-date"}  | :span[Date]{.type}            | 入力値が存在しない場合に代用する値を指定します。 |
| :a[nullable]{href="#nullable-boolean"} | :span[boolean]{.type}           | nullを許可します。                               |
| :a[ifnull]{href="#ifnull-date"}   | :span[Date]{.type}            | nullの場合の値を指定します。                     |
| :a[validate]{href="#validate-validatornumber"} | :span[Validator\<Date\>]{.type} | 値を検証する関数を指定します。                   |
| :a[formatOptions]{href="#formatoptions-formatoptions"}  | :span[FormatOptions]{.type}            | 日付文字列の書式を指定します。 |

---

### :span[default]{.code-name}: :span[Date]{.type}

入力値が存在しない場合に代用する値を指定します:br
undefinedのみ適用され、nullには適用されません。nullの代替値を指定したい場合はifnullオプションを使用してください。

```typescript
$date({ default: new Date() }).parse(undefined);
// => { success: true, value: Date }

// nullには適用されません
$date({ default: new Date() }).parse(null);
// => { success: false, errors: [ { path: [], kind: 'malformed_value' } ] }
```

---

### :span[nullable]{.code-name}: :span[boolean]{.type}

trueを指定した場合、nullの入力値を許可します。:br
nullにのみ適用され、undefinedには適用されません。undefinedを許可したい場合は$option関数を使用してください。

```typescript
$date({ nullable: true }).parse(null);
// => { success: true, value: null }

// undefinedには適用されません
$date({ nullable: true }).parse(undefined);
// => { success: false, errors: [ { path: [], kind: 'required' } ] }
```

nullableにtrueを指定した場合、parseの戻り値の型は`Date | null`になります。何も指定しない、もしくはfalseを指定した場合はparseの戻り値は`Date`です。:br
ただし、ifnullオプションを指定した場合は常に`Date`になります。

```typescript
// v1: Date
const v1 = $date.parse("2020-01-01").value;
// v2: Date | null
const v2 = $date({ nullable: true }).parse(new Date()).value;
// v3: Date
const v3 = $date({ nullable: true, ifnull: new Date() }).parse(new Date()).value;
```

---

### :span[ifnull]{.code-name}: :span[Date]{.type}

入力値がnullの場合に代用する値を指定します。:br
nullにのみ適用され、undefinedには適用されません。undefinedの代替値を指定したい場合はdefaultオプションを使用してください。

```typescript
$date({ ifnull: new Date() }).parse(null);
// => { success: true, value: 42 }

// undefinedには適用されません
$date({ ifnull: new Date() }).parse(undefined);
// => { success: false, errors: [ { path: [], kind: 'required' } ] }
```

---

### :span[validate]{.code-name}: :span[Validator\<Date\>]{.type}

入力値を検証するカスタム関数を指定します。

```typescript
$date({ validate: (value) => value.getDate() === 1 }).parse(new Date());
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
$date({
  validate: (value) => (value.getDate() === 1 ? true : "need beginning of month"),
}).parse(new Date());
// => {
//   success: false,
//   errors: [
//     {
//       path: [],
//       kind: 'optional_validation_failure',
//       option: 'validate',
//       optionValue: 'need beginning of month'
//     }
//   ]
// }
```

---

### :span[formatOptions]{.code-name} :span[FormatOptions]{.type}

日付書式を指定して文字列からDateオブジェクトへの変換を行うときに指定します。:br

#### :span[FormatOptions]{.type}の型
| 名称     | 型                | 説明                                             |
| :------- | :---------------- | :----------------------------------------------- |
| :a[format]{href="#format-string"}  | :span[string]{.type}            | **必須**:br parseで使用される日付書式を指定します。 |
| :a[referenceDate]{href="#referencedate-date-number-undefined"} | :span[Date \| number \| undefined]{.type}           | **省略可能**:br 日付書式内で省略された日時の参照元となるDateオブジェクトを指定します。                               |

---

##### :span[format]{.code-name}: :span[string]{.type}
日付文字列をパースするための書式を指定します。:br
書式の詳細は[date-fnsのparse関数](https://date-fns.org/v2.16.1/docs/parse)を参照してください。

```typescript
$date({
    formatOptions: {
        format: "MM-dd",
    },
}).parse("01-01");
```

##### :span[referenceDate]{.code-name}: :span[Date \| string \| undefined]{.type}
日付書式内で省略された日時の参照元となるDateオブジェクトを指定します。:br
この引数はdate-fnsの[parse関数](https://date-fns.org/v2.16.1/docs/parse)の第三引数に渡されます。:br

```typescript
$date({
    formatOptions: {
        format: "MM-dd",
        referenceDate: new Date(2020, 12, 31),
    },
}).parse("01-01");
// => { success: true, value: Date(2020, 0, 1) }
```