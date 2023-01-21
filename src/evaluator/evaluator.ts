import { BooleanLiteral, EvalObject, Integer, Null, ObjectTypes } from 'object';
import {
  BooleanExpression,
  ExpressionStatement,
  InfixExpression,
  IntegerLiteral,
  PrefixExpression,
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
      case ExpressionKind.Infix: {
        const evaluatedLeftExpression = this.evaluate(
          (node as InfixExpression).left
        );

        const evaluatedRightExpression = this.evaluate(
          (node as InfixExpression).right
        );

        if (evaluatedLeftExpression && evaluatedRightExpression) {
          return this.evaluateInfixExpression(
            (node as InfixExpression).operator,
            evaluatedLeftExpression,
            evaluatedRightExpression
          );
        }

        break;
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
      case '-':
        return this.evaluateMinusOperatorExpression(operand);
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

  private evaluateMinusOperatorExpression(operand: EvalObject) {
    if (operand.type() !== ObjectTypes.INTEGER) {
      return null;
    }

    return new Integer(-(operand as Integer).value);
  }

  private evaluateInfixExpression(
    operator: string,
    left: EvalObject,
    right: EvalObject
  ) {
    if (
      left.type() === ObjectTypes.INTEGER &&
      right.type() === ObjectTypes.INTEGER
    ) {
      return this.evaluateIntegerInfixExpression(operator, left, right);
    }

    return new Null();
  }

  private evaluateIntegerInfixExpression(
    operator: string,
    left: EvalObject,
    right: EvalObject
  ) {
    switch (operator) {
      case '+':
        return new Integer((left as Integer).value + (right as Integer).value);
      case '-':
        return new Integer((left as Integer).value - (right as Integer).value);
      case '*':
        return new Integer((left as Integer).value * (right as Integer).value);
      case '/':
        return new Integer((left as Integer).value / (right as Integer).value);
      case '<':
        return new BooleanLiteral(
          (left as Integer).value < (right as Integer).value
        );
      case '>':
        return new BooleanLiteral(
          (left as Integer).value > (right as Integer).value
        );
      case '==':
        return new BooleanLiteral(
          (left as Integer).value == (right as Integer).value
        );
      case '!=':
        return new BooleanLiteral(
          (left as Integer).value != (right as Integer).value
        );
      default:
        return new Null();
    }
  }
}
