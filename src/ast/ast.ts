import { Token } from 'token/token';

export enum StatementKind {
  Let = 'let',
  Return = 'return',
}

type StatementKindType = StatementKind.Let | StatementKind.Return;
type Statement = LetStatement | ReturnStatement;

interface Node {
  tokenLiteral: () => string;
}

export interface BaseStatement extends Node {
  kind: StatementKindType;
}

export interface Expression extends Node {}

export class Identifier implements Expression {
  token: Token;
  value: string;

  tokenLiteral() {
    return this.token.literal;
  }
}

export class LetStatement implements BaseStatement {
  token: Token;
  name: Identifier;
  value: Expression;
  kind: StatementKind.Let = StatementKind.Let;

  tokenLiteral() {
    return this.token.literal;
  }
}

export class ReturnStatement implements BaseStatement {
  token: Token;
  kind: StatementKind.Return;

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
