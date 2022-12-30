import { Token } from 'token';
import { BaseExpression, BaseStatement, StatementKind } from 'ast/base';

export class ReturnStatement implements BaseStatement {
  token: Token;
  kind: StatementKind.Return;
  returnValue: BaseExpression;

  constructor(token: Token) {
    this.token = token;
    this.kind = StatementKind.Return;
  }

  tokenLiteral() {
    return this.token.literal;
  }

  string() {
    const strings = [this.tokenLiteral(), ' '];

    if (this.returnValue) {
      strings.push(this.returnValue.string());
    }

    strings.push(';');

    return strings.join('');
  }
}
