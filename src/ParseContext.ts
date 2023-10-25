type AccessPath = Array<string | symbol | number>;

export type ParseError =
  | {
      path: AccessPath;
      kind: "malformed_value" | "required";
    }
  | {
      path: AccessPath;
      kind: "optional_validation_failure";
      option: string;
      optionValue: any;
    };

type ParseNode = {
  parent: ParseNode | undefined;
  name: undefined | string | symbol | number;
  value: unknown;
};

export type ParseContext = {
  name: undefined | string | symbol | number;
  errors: Array<ParseError>;
  parent: ParseNode | undefined;
};

export function createParseContext(
  ctx: ParseContext | undefined,
): ParseContext {
  return ctx ?? { name: undefined, errors: [], parent: undefined };
}

export function getPath(ctx: ParseContext): AccessPath {
  const path: AccessPath = [];
  if (ctx.name !== undefined) {
    path.push(ctx.name);
  }
  let node = ctx.parent;
  while (node?.name !== undefined) {
    path.unshift(node.name);

    node = node.parent;
  }

  return path;
}

export function pushParent(ctx: ParseContext, value: unknown): void {
  ctx.parent = {
    name: ctx.name,
    parent: ctx.parent,
    value: value,
  };
}

export function popParent(ctx: ParseContext): void {
  ctx.name = ctx.parent!.name;
  ctx.parent = ctx.parent!.parent;
}
