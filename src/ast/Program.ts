import { Node, ProgramKind, Statement } from 'ast/base';

export class Program implements Node {
  statements: Statement[] = [];
  kind: ProgramKind.program = ProgramKind.program;

  string() {
    return this.statements.map(this.statementToString).join('');
  }

  tokenLiteral() {
    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    }

    return '';
  }

  private statementToString(statement: Statement) {
    return statement.string();
  }
}
