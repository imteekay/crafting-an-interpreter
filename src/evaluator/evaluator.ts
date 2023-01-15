import { EvalObject, Integer } from 'object';
import { ExpressionStatement, IntegerLiteral, Program } from 'ast';
import {
  ExpressionKind,
  Node,
  ProgramKind,
  Statement,
  StatementKind,
} from 'ast/base';

export class Evaluator {
  evaluate(node: Node): EvalObject | null | undefined {
    switch (node.kind) {
      case ProgramKind.program:
        return this.evaluateStatements((node as Program).statements);
      case StatementKind.Expression:
        return this.evaluate((node as ExpressionStatement).expression);
      case ExpressionKind.IntegerLiteral:
        return new Integer((node as IntegerLiteral).value);
      default:
        return null;
    }
  }

  private evaluateStatements(
    statements: Statement[]
  ): EvalObject | null | undefined {
    let result: EvalObject | null | undefined;

    for (const statement of statements) {
      result = this.evaluate(statement);
    }

    return result;
  }
}
