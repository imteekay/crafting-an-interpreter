import { Token } from 'token';
import { BaseExpression, Expression, ExpressionKind } from 'ast/base';
import { BlockStatement } from './BlockStatement';

export class IfExpression implements BaseExpression {
  token: Token;
  condition: Expression;
  consequence: BlockStatement;
  alternative: BlockStatement;
  kind: ExpressionKind.If;

  constructor(token: Token) {
    this.token = token;
    this.kind = ExpressionKind.If;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  string(): string {
    return `if ${this.condition.string()} ${this.consequence.string()} ${
      this.alternative ? `else ${this.alternative.string()}` : null
    }`;
  }
}
