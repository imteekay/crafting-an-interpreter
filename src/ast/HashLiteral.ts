import { Token } from 'token';
import { BaseExpression, Expression, ExpressionKind } from 'ast/base';

export class HashLiteral implements BaseExpression {
  token: Token;
  pairs: Map<Expression, Expression>;
  kind: ExpressionKind.HashLiteral;

  constructor(token: Token) {
    this.token = token;
    this.kind = ExpressionKind.HashLiteral;
    this.pairs = new Map<Expression, Expression>();
  }

  tokenLiteral() {
    return this.token.literal;
  }

  string(): string {
    const pairs = [];

    for (const [key, value] of this.pairs.entries()) {
      pairs.push(`${key.string()}:${value.string()}`);
    }

    return `{${pairs.join(', ')}}`;
  }
}
