import { BooleanLiteral, EvalObject, Integer, Null } from 'object';
import {
  BooleanExpression,
  ExpressionStatement,
  IntegerLiteral,
  Program,
} from 'ast';

import {
  ExpressionKind,
  Node,
  ProgramKind,
  Statement,
  StatementKind,
} from 'ast/base';

const NULL = new Null();
const TRUE = new BooleanLiteral(true);
const FALSE = new BooleanLiteral(false);

export class Evaluator {
  evaluate(node: Node): EvalObject | null | undefined {
    switch (node.kind) {
      case ProgramKind.program:
        return this.evaluateStatements((node as Program).statements);
      case StatementKind.Expression:
        return this.evaluate((node as ExpressionStatement).expression);
      case ExpressionKind.IntegerLiteral:
        return new Integer((node as IntegerLiteral).value);
      case ExpressionKind.Boolean:
        return this.toBooleanLiteral((node as BooleanExpression).value);
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

  private toBooleanLiteral(value: boolean) {
    return value ? TRUE : FALSE;
  }
}
