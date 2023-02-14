import {
  ArrayObject,
  BooleanLiteral,
  Builtin,
  Environment,
  ErrorObject,
  EvalObject,
  FunctionObject,
  Hash,
  HashKey,
  HashPair,
  Integer,
  Null,
  ObjectTypes,
  ReturnValue,
  StringObject,
  isHashable,
} from 'object';

import {
  BlockStatement,
  BooleanExpression,
  ExpressionStatement,
  Identifier,
  IfExpression,
  InfixExpression,
  IntegerLiteral,
  LetStatement,
  PrefixExpression,
  Program,
  ReturnStatement,
  FunctionLiteral,
  CallExpression,
  StringLiteral,
  ArrayLiteral,
  IndexExpression,
  HashLiteral,
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

type Builtins = Record<string, EvalObject>;

export class Evaluator {
  builtins: Builtins = {
    len: new Builtin((...args: EvalObject[]) => {
      if (args.length !== 1) {
        return this.newError(
          `wrong number of arguments. got=${args.length}, want=1`
        );
      }

      const arg = args[0];

      if (arg instanceof StringObject) {
        return new Integer(arg.value.length);
      }

      if (arg instanceof ArrayObject) {
        return new Integer(arg.elements.length);
      }

      return this.newError(
        `argument to "len" not supported, got ${arg.type()}`
      );
    }),
    first: new Builtin((...args: EvalObject[]) => {
      if (args.length !== 1) {
        return this.newError(
          `wrong number of arguments. got=${args.length}, want=1`
        );
      }

      if (args[0].type() !== ObjectTypes.ARRAY) {
        return this.newError(
          `argument to "first" must be ARRAY, got ${args[0].type()}`
        );
      }

      const array = args[0] as ArrayObject;

      if (array.elements.length > 0) {
        return array.elements[0];
      }

      return NULL;
    }),
    last: new Builtin((...args: EvalObject[]) => {
      if (args.length !== 1) {
        return this.newError(
          `wrong number of arguments. got=${args.length}, want=1`
        );
      }

      if (args[0].type() !== ObjectTypes.ARRAY) {
        return this.newError(
          `argument to "last" must be ARRAY, got ${args[0].type()}`
        );
      }

      const array = args[0] as ArrayObject;
      const elementsLength = array.elements.length;

      if (elementsLength > 0) {
        return array.elements[elementsLength - 1];
      }

      return NULL;
    }),
    rest: new Builtin((...args: EvalObject[]) => {
      if (args.length !== 1) {
        return this.newError(
          `wrong number of arguments. got=${args.length}, want=1`
        );
      }

      if (args[0].type() !== ObjectTypes.ARRAY) {
        return this.newError(
          `argument to "rest" must be ARRAY, got ${args[0].type()}`
        );
      }

      const array = args[0] as ArrayObject;
      const elementsLength = array.elements.length;

      if (elementsLength > 0) {
        const restElements = array.elements.slice(1);
        return new ArrayObject(restElements);
      }

      return NULL;
    }),
    push: new Builtin((...args: EvalObject[]) => {
      if (args.length !== 2) {
        return this.newError(
          `wrong number of arguments. got=${args.length}, want=2`
        );
      }

      if (args[0].type() !== ObjectTypes.ARRAY) {
        return this.newError(
          `argument to "push" must be ARRAY, got ${args[0].type()}`
        );
      }

      const array = args[0] as ArrayObject;
      const elements = array.elements;

      return new ArrayObject([...elements, args[1]]);
    }),
  };

  evaluate(node: Node, env: Environment): EvalObject | null | undefined {
    switch (node.kind) {
      case ProgramKind.program:
        return this.evaluateProgram((node as Program).statements, env);
      case StatementKind.Expression:
        return this.evaluate((node as ExpressionStatement).expression, env);
      case ExpressionKind.IntegerLiteral:
        return new Integer((node as IntegerLiteral).value);
      case ExpressionKind.Boolean:
        return this.toBooleanLiteral((node as BooleanExpression).value);
      case ExpressionKind.StringLiteral:
        return new StringObject((node as StringLiteral).value);
      case ExpressionKind.Prefix: {
        const evaluatedRightExpressions = this.evaluate(
          (node as PrefixExpression).right,
          env
        );

        if (this.isError(evaluatedRightExpressions)) {
          return evaluatedRightExpressions;
        }

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
          (node as InfixExpression).left,
          env
        );

        if (this.isError(evaluatedLeftExpression)) {
          return evaluatedLeftExpression;
        }

        const evaluatedRightExpression = this.evaluate(
          (node as InfixExpression).right,
          env
        );

        if (this.isError(evaluatedRightExpression)) {
          return evaluatedRightExpression;
        }

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
        return this.evaluateBlockStatement(node as BlockStatement, env);
      case ExpressionKind.If:
        return this.evaluateIfExpression(node as IfExpression, env);
      case StatementKind.Return: {
        const value = this.evaluate((node as ReturnStatement).returnValue, env);

        if (this.isError(value)) {
          return value;
        }

        if (value) {
          return new ReturnValue(value);
        }

        return null;
      }
      case StatementKind.Let: {
        const value = this.evaluate((node as LetStatement).value, env);

        if (this.isError(value)) {
          return value;
        }

        if (value) {
          env.set((node as LetStatement).name.value, value);
        }

        return null;
      }
      case ExpressionKind.Identifier: {
        return this.evaluateIdentifier(node as Identifier, env);
      }
      case ExpressionKind.FunctionLiteral: {
        return new FunctionObject(
          (node as FunctionLiteral).parameters,
          (node as FunctionLiteral).body,
          env
        );
      }
      case ExpressionKind.Call: {
        const fn = this.evaluate((node as CallExpression).function, env);

        if (this.isError(fn) || !fn) {
          return fn;
        }

        const args = this.evaluateExpressions(
          (node as CallExpression).arguments,
          env
        );

        if (args.length === 1 && this.isError(args[0])) {
          return args[0];
        }

        return this.applyFunction(fn, args);
      }
      case ExpressionKind.ArrayLiteral: {
        const elements = this.evaluateExpressions(
          (node as ArrayLiteral).elements,
          env
        );

        if (elements.length === 1 && this.isError(elements[0])) {
          return elements[0];
        }

        return new ArrayObject(elements as EvalObject[]);
      }
      case ExpressionKind.IndexExpression: {
        const left = this.evaluate((node as IndexExpression).left, env);

        if (this.isError(left)) {
          return left;
        }

        const index = this.evaluate((node as IndexExpression).index, env);

        if (this.isError(index)) {
          return index;
        }

        return this.evaluateIndexExpression(
          left as EvalObject,
          index as EvalObject
        );
      }
      case ExpressionKind.HashLiteral: {
        return this.evaluateHashLiteral(node, env);
      }
      default:
        return null;
    }
  }

  private evaluateProgram(
    statements: Statement[],
    env: Environment
  ): EvalObject | null | undefined {
    let result: EvalObject | null | undefined;

    for (const statement of statements) {
      result = this.evaluate(statement, env);

      if (result?.type() === ObjectTypes.RETURN_VALUE) {
        return (result as ReturnValue).value;
      }

      if (result?.type() === ObjectTypes.ERROR) {
        return result;
      }
    }

    return result;
  }

  private toBooleanLiteral(value: boolean) {
    return value ? TRUE : FALSE;
  }

  private evaluateExpressions(expressions: Expression[], env: Environment) {
    const result = [];

    for (const expression of expressions) {
      const evaluatedExpression = this.evaluate(expression, env);

      if (this.isError(evaluatedExpression)) {
        // TODO: fix this, should return an object
        return [evaluatedExpression] as EvalObject[];
      }

      result.push(evaluatedExpression);
    }

    return result;
  }

  private applyFunction(
    fn: EvalObject,
    args: (EvalObject | null | undefined)[]
  ) {
    if (fn instanceof FunctionObject) {
      const extendedEnv = this.extendFunctionEnv(fn, args);
      const evaluatedBody = this.evaluate(fn.body, extendedEnv);
      return this.unwrapReturnValue(evaluatedBody);
    }

    if (fn instanceof Builtin) {
      return fn.fn(...(args as EvalObject[]));
    }

    return this.newError(`not a function: ${fn.type()}`);
  }

  private evaluatePrefixExpression(operator: string, operand: EvalObject) {
    switch (operator) {
      case '!':
        return this.evaluateBangOperatorExpression(operand);
      case '-':
        return this.evaluateMinusOperatorExpression(operand);
      default:
        return this.newError(`unknown operator: ${operator}${operand.type()}`);
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
      return this.newError(`unknown operator: -${operand.type()}`);
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

    if (
      left.type() === ObjectTypes.STRING &&
      right.type() === ObjectTypes.STRING
    ) {
      return this.evaluateStringInfixExpression(
        operator,
        left as StringObject,
        right as StringObject
      );
    }

    if (left.type() !== right.type()) {
      return this.newError(
        `type mismatch: ${left.type()} ${operator} ${right.type()}`
      );
    }

    return this.newError(
      `unknown operator: ${left.type()} ${operator} ${right.type()}`
    );
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
        return this.newError(
          `unknown operator: ${left.type()} ${operator} ${right.type()}`
        );
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
        return this.newError(
          `unknown operator: ${left.type()} ${operator} ${right.type()}`
        );
    }
  }

  private evaluateStringInfixExpression(
    operator: string,
    left: StringObject,
    right: StringObject
  ) {
    if (operator !== '+') {
      return this.newError(
        `unknown operator: ${left.type()} ${operator} ${right.type()}`
      );
    }

    const leftValue = left.value;
    const rightValue = right.value;

    return new StringObject(leftValue + rightValue);
  }

  private evaluateBlockStatement(node: BlockStatement, env: Environment) {
    let result: EvalObject | null | undefined;

    for (const statement of node.statements) {
      result = this.evaluate(statement, env);

      if (
        result?.type() === ObjectTypes.RETURN_VALUE ||
        result?.type() === ObjectTypes.ERROR
      ) {
        return result;
      }
    }

    return result;
  }

  private evaluateIfExpression(node: IfExpression, env: Environment) {
    const condition = this.evaluate(node.condition, env);

    if (this.isTruthy(condition)) {
      return this.evaluate(node.consequence, env);
    }

    if (node.alternative) {
      return this.evaluate(node.alternative, env);
    }

    return NULL;
  }

  private evaluateIdentifier(node: Identifier, env: Environment) {
    const { has, value } = env.get(node.value);

    if (has) {
      return value;
    }

    const builtin = this.builtins[node.value];

    if (builtin) {
      return builtin;
    }

    return this.newError(`identifier not found: ${node.value}`);
  }

  private evaluateIndexExpression(left: EvalObject, index: EvalObject) {
    if (
      left.type() === ObjectTypes.ARRAY &&
      index.type() === ObjectTypes.INTEGER
    ) {
      return this.evaluateArrayIndexExpression(left, index);
    }

    return this.newError(`index operator not supported: ${left.type()}`);
  }

  private evaluateArrayIndexExpression(array: EvalObject, index: EvalObject) {
    const indexValue = (index as Integer).value;
    const maxIndex = (array as ArrayObject).elements.length - 1;

    if (indexValue < 0 || indexValue > maxIndex) {
      return NULL;
    }

    return (array as ArrayObject).elements[indexValue];
  }

  private evaluateHashLiteral(node: HashLiteral, env: Environment) {
    const pairs = new Map<HashKey, HashPair>();

    for (const [nodeKey, nodeValue] of node.pairs.entries()) {
      const key = this.evaluate(nodeKey, env);

      if (this.isError(key)) {
        return key;
      }

      if (!isHashable(key)) {
        return this.newError(`unusable as hash key: ${key?.type()}`);
      }

      const value = this.evaluate(nodeValue, env);

      if (this.isError(value) || !value) {
        return value;
      }

      const hashed = key.hashKey();
      pairs.set(hashed, new HashPair(key, value));
    }

    return new Hash(pairs);
  }

  private extendFunctionEnv(
    fn: FunctionObject,
    args: (EvalObject | null | undefined)[]
  ) {
    const env = new Environment(fn.env);

    for (const [index, identifier] of fn.parameters.entries()) {
      env.set(identifier.value, args[index]);
    }

    return env;
  }

  private unwrapReturnValue(evaluatedBody: EvalObject | null | undefined) {
    if (evaluatedBody instanceof ReturnValue) {
      return evaluatedBody.value;
    }

    return evaluatedBody;
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

  private newError(message: string) {
    return new ErrorObject(message);
  }

  private isError(evalObject: EvalObject | null | undefined) {
    if (evalObject && evalObject.type() === ObjectTypes.ERROR) {
      return evalObject.type() === ObjectTypes.ERROR;
    }

    return false;
  }
}
