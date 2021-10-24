import { Token } from 'token';
import { Expression, BaseStatement, StatementKind } from 'ast/base';

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
