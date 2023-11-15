# $optional

入力が存在しない場合も許可するパーサーを作成します。

## 使い方

```typescript
import { $number, $optional } from "yncc";

const result = $optional($number).parse(undefined);
if (result.success) {
  const value = result.value; //value: number | undefined
} else {
  const errors = result.errors; //errors: ParseError[]
}
```

## パースルール
入力値がundefinedの場合は常に成功します。:br
$optionalはnullを許可しません。nullを許可したい場合はスキーマ定義のnullableオプションを使用してください。:br
入力値がundefined以外の場合は、引数で指定されたスキーマ定義をもとに検証を行います。

## $objectとの組み合わせ
$objectのプロパティに$optionalを使用すると、省略可能なプロパティであることを表現できます。

```typescript
import { $number, $object, $optional, $string, Infer } from "yncc";

const schema = $object({
    id: $number,
    name: $optional($string),
});

schema.parse({ id: 1, name: 'yncc' }); // ✅ success
schema.parse({ id: 1 }); // ✅ success
schema.parse({ id: 1, name: undefined }); // ✅ success
schema.parse({ id: 1, name: null }); // ⛔ failure

type Schema = Infer<typeof schema>;
// type Schema = { id: number; name?: string | undefined; }
```

## 特殊なケース
引数で指定されたスキーマ定義がdefaultオプションを持っている場合、defaultオプションの値が優先されます。

```typescript
const schema = $object({
    id: $number,
    name: $optional($string, { default: 'yncc' }),
});

const result = schema.parse({ id: 1 });
// result.value => { id: 1, name: 'yncc' }
```

## オプション

**なし**
