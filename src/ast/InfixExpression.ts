import { Token } from 'token';
import { BaseExpression, Expression, ExpressionKind } from 'ast/base';

export class InfixExpression implements BaseExpression {
  token: Token;
  left: Expression;
  operator: string;
  right: Expression;
  kind: ExpressionKind.Infix;

  constructor(token: Token, operator: string, left: Expression) {
    this.token = token;
    this.operator = operator;
    this.left = left;
    this.kind = ExpressionKind.Infix;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  string(): string {
    return `(${this.left.string()} ${this.operator} ${this.right.string()})`;
  }
}
