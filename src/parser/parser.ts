import { Program, LetStatement, Identifier } from 'src/ast/ast';
import { Lexer } from 'src/lexer/lexer';
import { Token, Tokens, TokenType } from 'src/token/token';

export class Parser {
  lexer: Lexer;
  currentToken: Token;
  peekToken: Token;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.nextToken();
    this.nextToken();
  }

  nextToken() {
    this.currentToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  parseProgram() {
    const program = new Program();

    while (this.currentToken.type !== Tokens.EOF) {
      const statement = this.parseStatement();

      if (statement !== null) {
        program.statements.push(statement);
      }

      this.nextToken();
    }

    return program;
  }

  private parseStatement() {
    switch (this.currentToken.type) {
      case Tokens.LET:
        return this.parseLetStatement();
      default:
        return null;
    }
  }

  private parseLetStatement() {
    const statement = new LetStatement();
    statement.token = this.currentToken;

    if (!this.expectPeek(Tokens.IDENT)) {
      return null;
    }

    const identifier = new Identifier();

    identifier.token = this.currentToken;
    identifier.value = this.currentToken.literal;
    statement.name = identifier;

    if (!this.expectPeek(Tokens.ASSIGN)) {
      return null;
    }

    while (!this.currentTokenIs(Tokens.SEMICOLON)) {
      this.nextToken();
    }

    return statement;
  }

  private currentTokenIs(token: TokenType) {
    return this.currentToken.type === token;
  }

  private peekTokenIs(token: TokenType) {
    return this.peekToken.type === token;
  }

  private expectPeek(token: TokenType) {
    if (this.peekTokenIs(token)) {
      this.nextToken();
      return true;
    }

    return false;
  }
}
