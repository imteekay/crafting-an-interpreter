import {
  BooleanLiteral,
  EvalObject,
  Integer,
  Null,
  ObjectTypes,
  ReturnValue,
} from 'object';

import {
  BlockStatement,
  BooleanExpression,
  ExpressionStatement,
  IfExpression,
  InfixExpression,
  IntegerLiteral,
  PrefixExpression,
  Program,
  ReturnStatement,
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

        return null;
      }
      case StatementKind.Block:
        return this.evaluateStatements((node as BlockStatement).statements);
      case ExpressionKind.If:
        return this.evaluateIfExpression(node as IfExpression);
      case StatementKind.Return: {
        const value = this.evaluate(node as ReturnStatement);

        if (value) {
          return new ReturnValue(value);
        }

        return null;
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

      if (result?.type() === ObjectTypes.RETURN_VALUE) {
        return (result as ReturnValue).value;
      }
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
      return this.evaluateIntegerInfixExpression(
        operator,
        left as Integer,
        right as Integer
      );
    }

    if (
      left.type() === ObjectTypes.BOOLEAN &&
      right.type() === ObjectTypes.BOOLEAN
    ) {
      return this.evaluateBooleanInfixExpression(
        operator,
        left as BooleanLiteral,
        right as BooleanLiteral
      );
    }

    return NULL;
  }

  private evaluateIntegerInfixExpression(
    operator: string,
    left: Integer,
    right: Integer
  ) {
    const leftValue = left.value;
    const rightValue = right.value;

    switch (operator) {
      case '+':
        return new Integer(leftValue + rightValue);
      case '-':
        return new Integer(leftValue - rightValue);
      case '*':
        return new Integer(leftValue * rightValue);
      case '/':
        return new Integer(leftValue / rightValue);
      case '<':
        return new BooleanLiteral(leftValue < rightValue);
      case '>':
        return new BooleanLiteral(leftValue > rightValue);
      case '==':
        return new BooleanLiteral(leftValue == rightValue);
      case '!=':
        return new BooleanLiteral(leftValue != rightValue);
      default:
        return NULL;
    }
  }

  private evaluateBooleanInfixExpression(
    operator: string,
    left: BooleanLiteral,
    right: BooleanLiteral
  ) {
    const leftValue = left.value;
    const rightValue = right.value;

    switch (operator) {
      case '==':
        return this.toBooleanLiteral(leftValue == rightValue);
      case '!=':
        return this.toBooleanLiteral(leftValue != rightValue);
      default:
        return NULL;
    }
  }

  private evaluateIfExpression(node: IfExpression) {
    const condition = this.evaluate(node.condition);

    if (this.isTruthy(condition)) {
      return this.evaluate(node.consequence);
    }

    if (node.alternative) {
      return this.evaluate(node.alternative);
    }

    return NULL;
  }

  private isTruthy(condition: EvalObject | null | undefined) {
    if (!condition) {
      return NULL;
    }

    switch (condition.inspect()) {
      case 'null':
        return false;
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return true;
    }
  }
}
