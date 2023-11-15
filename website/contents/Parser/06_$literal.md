# $literal

入力が引数で指定されたリテラルと一致することを検証します。

## 使い方

```typescript
import { $literal, Infer } from "yncc";

const result = $literal('Hello world').parse('Hello world');
if (result.success) {
  const value = result.value; //value: 'Hello world'
} else {
  const errors = result.errors; //errors: ParseError[]
}

$literal(null).parse(null); // ✅ success
$literal(undefined).parse(undefined); // ✅ success
$literal(0).parse(0); // ✅ success
$literal(NaN).parse(NaN); // ✅ success
$literal(1).parse('1'); // ✅ success
$literal(true).parse("true"); // ✅ success

$literal({ id: 1, name: 'yncc' }).parse({ id: 1, name: 'yncc' }); // ✅ success
$literal([1, 2, [3, 4]]).parse([1, 2, [3, 4]]); // ✅ success

type Literal = Infer<typeof $literal(true)>;
// type Literal = true
```

## パースルール
リテラルと入力値の一致チェックはObject.is関数を使用します。:br
リテラルがnumber型で入力値が文字列の場合、数値として認識できるなら数値に変換したうえで、一致チェックを行います。:br
リテラルがboolean型で入力値が文字列の場合、ブーリアンとして認識できるならブーリアンに変換したうえで、一致チェックを行います。:br
オブジェクト型、配列型の場合はディープイコールで、再帰的に一致チェックを行います。

## オプション

**なし**
