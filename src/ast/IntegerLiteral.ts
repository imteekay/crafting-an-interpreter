import { Token } from 'token';
import { Expression } from 'ast/base';

export class IntegerLiteral implements Expression {
  token: Token;
  value: number;

  constructor(token: Token, value: number) {
    this.token = token;
    this.value = value;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    return this.token.literal;
  }
}
