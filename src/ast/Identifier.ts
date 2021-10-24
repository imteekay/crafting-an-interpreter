import { Token } from 'token';
import { Expression } from 'ast/base';

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

  string() {
    return this.value;
  }
}
