import { Token } from 'token';
import { BaseExpression, Expression, ExpressionKind } from 'ast/base';

export class IndexExpression implements BaseExpression {
  token: Token;
  left: Expression;
  index: Expression;
  kind: ExpressionKind.IndexExpression;

  constructor(token: Token, left: Expression) {
    this.token = token;
    this.left = left;
    this.kind = ExpressionKind.IndexExpression;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  string(): string {
    return `(${this.left.string()}[${this.index.string()}])`;
  }
}
