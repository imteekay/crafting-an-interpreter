import { Token } from 'token';
import { Identifier } from 'ast/Identifier';
import { Expression, BaseStatement, StatementKind } from 'ast/base';

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

  string() {
    const strings = [this.tokenLiteral(), ' ', this.name.string(), ' = '];

    if (this.value !== null) {
      strings.push(this.value.string());
    }

    strings.push(';');

    return strings.join('');
  }
}
