import { Token } from 'token';
import { Identifier } from 'ast/Identifier';
import { BaseExpression, BaseStatement, StatementKind } from 'ast/base';

export class LetStatement implements BaseStatement {
  token: Token;
  name: Identifier;
  value: BaseExpression;
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

    if (this.value) {
      strings.push(this.value.string());
    }

    strings.push(';');

    return strings.join('');
  }
}
