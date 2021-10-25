import { Token } from 'token';
import { BaseExpression, ExpressionKind } from 'ast/base';

export class Identifier implements BaseExpression {
  token: Token;
  value: string;
  kind: ExpressionKind.Identifier;

  constructor(token: Token, value: string) {
    this.token = token;
    this.value = value;
    this.kind = ExpressionKind.Identifier;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    return this.value;
  }
}
