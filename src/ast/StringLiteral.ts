import { Token } from 'token';
import { BaseExpression, ExpressionKind } from 'ast/base';

export class StringLiteral implements BaseExpression {
  token: Token;
  value: string;
  kind: ExpressionKind.StringLiteral;

  constructor(token: Token, value: string) {
    this.token = token;
    this.value = value;
    this.kind = ExpressionKind.StringLiteral;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    return this.token.literal;
  }
}
