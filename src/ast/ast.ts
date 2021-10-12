import { Token } from 'src/token/token';

interface Node {
  tokenLiteral: () => string;
}

export interface Statement extends Node {
  token: Token;
  name: Identifier;
  value: Expression;
}

export interface Expression extends Node {
  token: Token;
  value: string;
}

export class Program {
  statements: Statement[] = [];

  tokenLiteral() {
    return this.statements.length > 0 ? this.statements[0].tokenLiteral() : '';
  }
}

export class Identifier implements Expression {
  token: Token;
  value: string;

  expressionNode() {}
  tokenLiteral() {
    return this.token.literal;
  }
}

export class LetStatement implements Statement {
  token: Token;
  name: Identifier;
  value: Expression;

  statementNode() {}
  tokenLiteral() {
    return this.token.literal;
  }
}
