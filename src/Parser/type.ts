export type AccessPath = Array<string | symbol | number>;

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

export type Result<T> =
  | {
      success: true;
      value: T;
    }
  | {
      success: false;
      errors: Array<ParseError>;
    };

export type ParseFunc<T> = (input: unknown) => Result<T>;
export interface Parser<T> {
  parse: ParseFunc<T>;
}

export type Infer<T> = T extends Parser<infer U> ? U : unknown;

export type ParseNode = {
  parent: ParseNode | undefined;
  name: undefined | string | symbol | number;
  value: unknown;
};

export type ValidateContext = {
  parent: ParseNode | undefined;
};

/**
 * Validation is considered successful only when the return value is true.
 * Any other return value will result in an error.
 */
export type Validator<T> = (value: T, ctx: ValidateContext) => true | unknown;
