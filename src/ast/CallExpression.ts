import { Token } from 'token';
import { BaseExpression, Expression, ExpressionKind } from 'ast/base';

export class CallExpression implements BaseExpression {
  token: Token;
  function: Expression; // Identifier or FunctionLiteral
  arguments: Expression[];
  kind: ExpressionKind.Call;

  constructor(token: Token, fn: Expression) {
    this.token = token;
    this.kind = ExpressionKind.Call;
    this.function = fn;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  string(): string {
    return (
      this.function.string() +
      '(' +
      this.arguments.map((arg) => arg.string()).join(', ') +
      ')'
    );
  }
}
