import { BaseExpression, ExpressionKind } from 'ast/base';
import { Token } from 'token';

export class BooleanExpression implements BaseExpression {
  token: Token;
  value: boolean;
  kind: ExpressionKind.Boolean;

  constructor(token: Token, value: boolean) {
    this.token = token;
    this.value = value;
    this.kind = ExpressionKind.Boolean;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    return this.token.literal;
  }
}
