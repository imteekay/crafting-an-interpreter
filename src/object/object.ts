import { BlockStatement, Identifier } from 'ast';
import { Environment } from 'object/environment';

type ObjectType = string;
type type = () => ObjectType;
type inspect = (error?: ErrorObject) => string;

export interface EvalObject {
  type: type;
  inspect: inspect;
}

export enum ObjectTypes {
  INTEGER = 'INTEGER',
  BOOLEAN = 'BOOLEAN',
  NULL = 'NULL',
  RETURN_VALUE = 'RETURN_VALUE',
  ERROR = 'ERROR',
  FUNCTION = 'FUNCTION',
  STRING = 'STRING',
  BUILTIN = 'BUILTIN',
  ARRAY = 'ARRAY',
}

export class Integer implements EvalObject {
  value: number;

  constructor(value: number) {
    this.value = value;
  }

  type() {
    return ObjectTypes.INTEGER;
  }

  inspect() {
    return this.value.toString();
  }
}

export class BooleanLiteral implements EvalObject {
  value: boolean;

  constructor(value: boolean) {
    this.value = value;
  }

  type() {
    return ObjectTypes.BOOLEAN;
  }

  inspect() {
    return this.value.toString();
  }
}

export class Null implements EvalObject {
  value: null = null;

  type() {
    return ObjectTypes.NULL;
  }

  inspect() {
    return 'null';
  }
}

export class ReturnValue implements EvalObject {
  value: EvalObject;

  constructor(value: EvalObject) {
    this.value = value;
  }

  type() {
    return ObjectTypes.RETURN_VALUE;
  }

  inspect() {
    return this.value.inspect();
  }
}

export class ErrorObject implements EvalObject {
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  type() {
    return ObjectTypes.ERROR;
  }

  inspect() {
    return `ERROR: ${this.message}`;
  }
}

export class FunctionObject implements EvalObject {
  parameters: Identifier[];
  body: BlockStatement;
  env: Environment;

  constructor(
    parameters: Identifier[],
    body: BlockStatement,
    env: Environment
  ) {
    this.parameters = parameters;
    this.body = body;
    this.env = env;
  }

  type() {
    return ObjectTypes.FUNCTION;
  }

  inspect() {
    return `
      fn(${this.parameters.join(', ')}) {
        ${this.body.string()}
      }
    `;
  }
}

export class StringObject implements EvalObject {
  value: string;

  constructor(value: string) {
    this.value = value;
  }

  type() {
    return ObjectTypes.STRING;
  }

  inspect() {
    return this.value;
  }
}

type BuiltingFunction = (...args: EvalObject[]) => EvalObject;

export class Builtin implements EvalObject {
  fn: BuiltingFunction;

  constructor(fn: BuiltingFunction) {
    this.fn = fn;
  }

  type() {
    return ObjectTypes.BUILTIN;
  }

  inspect() {
    return 'builting function';
  }
}

export class ArrayObject implements EvalObject {
  elements: EvalObject[];

  constructor(elements: EvalObject[]) {
    this.elements = elements;
  }

  type() {
    return ObjectTypes.ARRAY;
  }

  inspect() {
    return `[${this.elements.map((element) => element.inspect()).join(', ')}]`;
  }
}
