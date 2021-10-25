import { Statement } from 'ast/base';
export class Program {
  statements: Statement[] = [];

  string() {
    return this.statements.map(this.statementToString).join('');
  }

  private statementToString(statement: Statement) {
    return statement.string();
  }
}
