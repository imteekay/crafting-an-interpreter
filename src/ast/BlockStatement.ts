import { BaseStatement, Statement, StatementKind } from 'ast/base';
import { Token } from 'token';

export class BlockStatement implements BaseStatement {
  statements: Statement[] = [];
  token: Token;
  kind: StatementKind.Block;

  constructor(token: Token) {
    this.token = token;
    this.kind = StatementKind.Block;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    return this.statements.map(this.statementToString).join('');
  }

  private statementToString(statement: Statement) {
    return statement.string();
  }
}
