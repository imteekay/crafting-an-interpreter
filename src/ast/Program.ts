import { ExpressionStatement } from 'ast/ExpressionStatement';
import { LetStatement } from 'ast/LetStatement';
import { ReturnStatement } from 'ast/ReturnStatement';

type Statement = LetStatement | ReturnStatement | ExpressionStatement;

export class Program {
  statements: Statement[] = [];

  string() {
    return this.statements.map(this.statementToString).join('');
  }

  private statementToString(statement: Statement) {
    return statement.string();
  }
}
