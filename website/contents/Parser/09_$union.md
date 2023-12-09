# $union

複数の定義のいずれかと一致することを検証します。

## 使い方

```typescript
import { $number, $boolean, $union, Infer } from "yncc";

const schema = $union([$number, $boolean]);
const result = schema.parse(true);
if (result.success) {
  const value = result.value; //value: number | boolean
} else {
  const errors = result.errors; //errors: ParseError[]
}

$schema.parse(false); // ✅ success
$schema.parse(123); // ✅ success
$schema.parse("true"); // ✅ success
$schema.parse("2020"); // ✅ success

type Type = Infer<typeof schema>;
// Type = boolean | number
```

## パースルール

入力値がunionで指定されたいずれかのスキーマ定義と一致すれば、検証に成功します。:br
結果の値は、一番最初に一致したスキーマ定義のパース結果となります。

## オプション

**なし**
