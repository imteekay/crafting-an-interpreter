import { Token } from 'token';
import { BaseExpression, Expression, ExpressionKind } from 'ast/base';

export class PrefixExpression implements BaseExpression {
  token: Token;
  operator: string;
  right: Expression;
  kind: ExpressionKind.Prefix;

  constructor(token: Token, operator: string) {
    this.token = token;
    this.operator = operator;
    this.kind = ExpressionKind.Prefix;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  string(): string {
    return ['(', this.operator, this.right.string(), ')'].join('');
  }
}
