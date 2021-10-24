import { Token } from 'token';

export enum StatementKind {
  Let = 'let',
  Return = 'return',
}

type StatementKindType = StatementKind.Let | StatementKind.Return;
type Statement = LetStatement | ReturnStatement;

interface Node {
  tokenLiteral: () => string;
}

interface BaseStatement extends Node {
  kind: StatementKindType;
}

interface Expression extends Node {}

export class Identifier implements Expression {
  token: Token;
  value: string;

  constructor(token: Token, value: string) {
    this.token = token;
    this.value = value;
  }

  tokenLiteral() {
    return this.token.literal;
  }
}

export class LetStatement implements BaseStatement {
  token: Token;
  name: Identifier;
  value: Expression;
  kind: StatementKind.Let;

  constructor(token: Token) {
    this.token = token;
    this.kind = StatementKind.Let;
  }

  tokenLiteral() {
    return this.token.literal;
  }
}

export class ReturnStatement implements BaseStatement {
  token: Token;
  kind: StatementKind.Return;
  returnValue: Expression;

  constructor(token: Token) {
    this.token = token;
    this.kind = StatementKind.Return;
  }

  tokenLiteral() {
    return this.token.literal;
  }
}

export class Program {
  statements: Statement[] = [];
}
