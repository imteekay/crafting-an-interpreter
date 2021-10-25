import { Token } from 'token';
import { BaseExpression, ExpressionKind } from 'ast/base';

export class IntegerLiteral implements BaseExpression {
  token: Token;
  value: number;
  kind: ExpressionKind.IntegerLiteral;

  constructor(token: Token, value: number) {
    this.token = token;
    this.value = value;
    this.kind = ExpressionKind.IntegerLiteral;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    return this.token.literal;
  }
}
