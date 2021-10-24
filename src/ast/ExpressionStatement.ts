import { Token } from 'token';
import { Expression, BaseStatement, StatementKind } from 'ast/base';

export class ExpressionStatement implements BaseStatement {
  token: Token;
  expression: Expression;
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
