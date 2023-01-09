import { Token } from 'token';
import { BaseExpression, ExpressionKind } from 'ast/base';
import { BlockStatement } from 'ast/BlockStatement';
import { Identifier } from 'ast/Identifier';

export class FunctionLiteral implements BaseExpression {
  token: Token;
  parameters: Identifier[];
  body: BlockStatement;
  kind: ExpressionKind.FunctionLiteral;

  constructor(token: Token) {
    this.token = token;
    this.kind = ExpressionKind.FunctionLiteral;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  string(): string {
    return (
      this.tokenLiteral() +
      '(' +
      this.parameters.join(', ') +
      ') ' +
      this.body.string()
    );
  }
}
