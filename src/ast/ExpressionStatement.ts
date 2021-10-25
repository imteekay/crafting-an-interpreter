import { Token } from 'token';
import { BaseStatement, StatementKind } from 'ast/base';
import { Identifier } from 'ast/Identifier';

export class ExpressionStatement implements BaseStatement {
  token: Token;
  expression: Identifier;
  kind: StatementKind.Expression;

  constructor(token: Token) {
    this.token = token;
    this.kind = StatementKind.Expression;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    return this.expression === null ? '' : this.expression.string();
  }
}
