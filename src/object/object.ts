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
  HASH = 'HASH',
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

  hashKey() {
    return JSON.stringify(new HashKey(this.type(), this.value));
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

  hashKey() {
    return JSON.stringify(new HashKey(this.type(), this.value ? 1 : 0));
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

  hashKey() {
    return JSON.stringify(new HashKey(this.type(), this.hashCode(this.value)));
  }

  private hashCode(str: string) {
    let hash = 0;
    let chr;

    if (str.length === 0) return hash;

    for (let i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }

    return hash;
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

export class HashKey {
  type: ObjectType;
  value: number;

  constructor(type: ObjectType, value: number) {
    this.type = type;
    this.value = value;
  }
}

export class HashPair {
  key: EvalObject;
  value: EvalObject;

  constructor(key: EvalObject, value: EvalObject) {
    this.key = key;
    this.value = value;
  }
}

export class Hash implements EvalObject {
  pairs: Map<string, HashPair>;

  constructor(pairs: Map<string, HashPair>) {
    this.pairs = pairs;
  }

  type() {
    return ObjectTypes.HASH;
  }

  inspect() {
    const pairs = [];

    for (const [_, pair] of this.pairs.entries()) {
      pairs.push(`${pair.key.inspect()}:${pair.value.inspect()}`);
    }

    return `{${pairs.join(', ')}}`;
  }
}
