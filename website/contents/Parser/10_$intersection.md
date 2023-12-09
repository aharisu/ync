# $intersection

複数の定義のすべてと一致することを検証します。

## 使い方

```typescript
import { $number, $string, $object, $intersection, Infer } from "yncc";

const schema = $intersection([
  $object({ a: $string }, { exact: false }),
  $object({ b: $number }, { exact: false }),
]);
const result = schema.parse({ a: "hello", b: 123 });
if (result.success) {
  const value = result.value; //value: { a: string } & { b: number }
} else {
  const errors = result.errors; //errors: ParseError[]
}

$schema.parse({ a: "hello" }); // ⛔ failure
$schema.parse({ a: "hello", b: "world" }); // ⛔ failure

type Type = Infer<typeof schema>;
// Type = {a : string } & { b: number }
```

## パースルール

入力値がintersectionで指定されたすべてのスキーマ定義と一致すれば、検証に成功します。:br
パース結果の値は、それぞれのスキーマ定義のパース結果をマージした値になります。

## オプション

**なし**
