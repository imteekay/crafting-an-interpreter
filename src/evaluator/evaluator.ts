import { BooleanLiteral, EvalObject, Integer, Null } from 'object';
import {
  BooleanExpression,
  ExpressionStatement,
  IntegerLiteral,
  PrefixExpression,
  Program,
} from 'ast';

import {
  Expression,
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
      case ExpressionKind.Prefix: {
        const evaluatedRightExpressions = this.evaluate(
          (node as PrefixExpression).right
        );

        const object =
          evaluatedRightExpressions &&
          this.evaluatePrefixExpression(
            (node as PrefixExpression).operator,
            evaluatedRightExpressions
          );

        return object;
      }
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

  private evaluatePrefixExpression(operator: string, operand: EvalObject) {
    switch (operator) {
      case '!':
        return this.evaluateBangOperatorExpression(operand);
      default:
        return NULL;
    }
  }

  private evaluateBangOperatorExpression(operand: EvalObject) {
    switch (operand) {
      case TRUE:
        return FALSE;
      case FALSE:
        return TRUE;
      case NULL:
        return TRUE;
      default:
        return FALSE;
    }
  }
}
