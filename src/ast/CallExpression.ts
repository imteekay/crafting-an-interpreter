import { Token } from 'token';
import { BaseExpression, Expression, ExpressionKind } from 'ast/base';

export class CallExpression implements BaseExpression {
  token: Token;
  function: Expression; // Identifier or FunctionLiteral
  arguments: Expression[];
  kind: ExpressionKind.Call;

  constructor(token: Token) {
    this.token = token;
    this.kind = ExpressionKind.Call;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  string(): string {
    // TODO: add the whole call expression string
    return '';
  }
}
