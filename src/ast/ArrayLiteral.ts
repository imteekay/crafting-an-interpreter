import { Token } from 'token';
import { BaseExpression, Expression, ExpressionKind } from 'ast/base';

export class ArrayLiteral implements BaseExpression {
  token: Token;
  elements: Expression[];
  kind: ExpressionKind.ArrayLiteral;

  constructor(token: Token) {
    this.token = token;
    this.kind = ExpressionKind.ArrayLiteral;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  string(): string {
    return `[${this.elements.join(', ')}]`;
  }
}
