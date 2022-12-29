import {
  Program,
  BaseExpression,
  LetStatement,
  Identifier,
  IntegerLiteral,
  ReturnStatement,
  ExpressionStatement,
  Expression,
} from 'ast';

import { PrefixExpression } from 'ast/PrefixExpression';
import { Lexer } from 'lexer';
import { Token, Tokens, TokenType } from 'token';

export type ParserError = string;

type prefixParseFn = () => Expression | null;
type infixParseFn = (expression: BaseExpression) => Expression;

enum Precedence {
  LOWEST = 1,
  EQUALS, // ==
  LESSGREATER, // > or <
  SUM, // +
  PRODUCT, // *
  PREFIX, // -X or !X
  CALL, // myFunction(X)
}

export class Parser {
  private lexer: Lexer;
  private currentToken: Token;
  private peekToken: Token;
  private errors: ParserError[];
  private prefixParseFns: { [key: TokenType]: prefixParseFn } = {};
  private infixParseFns: { [key: TokenType]: infixParseFn } = {};

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.errors = [];
    this.nextToken();
    this.nextToken();

    this.registerPrefix(Tokens.IDENT, this.parseIdentifier.bind(this));
    this.registerPrefix(Tokens.INT, this.parseIntegerLiteral.bind(this));
    this.registerPrefix(Tokens.BANG, this.parsePrefixExpression.bind(this));
    this.registerPrefix(Tokens.MINUS, this.parsePrefixExpression.bind(this));
  }

  nextToken() {
    this.currentToken = this.peekToken;
    // peekToken is always pointing to the next token
    this.peekToken = this.lexer.nextToken();
  }

  parseProgram() {
    const program = new Program();

    while (this.currentToken.type !== Tokens.EOF) {
      const statement = this.parseStatement();

      if (statement) {
        program.statements.push(statement);
      }

      this.nextToken();
    }

    return program;
  }

  getErrors() {
    return this.errors;
  }

  private parseStatement() {
    switch (this.currentToken.type) {
      case Tokens.LET:
        return this.parseLetStatement();
      case Tokens.RETURN:
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
    }
  }

  private parseLetStatement() {
    const statement = new LetStatement(this.currentToken);

    // We expect that after the let statement, we have the identifier
    if (!this.expectPeek(Tokens.IDENT)) {
      return null;
    }

    const identifier = new Identifier(
      this.currentToken,
      this.currentToken.literal
    );

    statement.name = identifier;

    if (!this.expectPeek(Tokens.ASSIGN)) {
      return null;
    }

    while (!this.currentTokenIs(Tokens.SEMICOLON)) {
      this.nextToken();
    }

    return statement;
  }

  private parseReturnStatement() {
    const statement = new ReturnStatement(this.currentToken);

    while (!this.currentTokenIs(Tokens.SEMICOLON)) {
      this.nextToken();
    }

    return statement;
  }

  private parseExpressionStatement() {
    const statement = new ExpressionStatement(this.currentToken);
    const expression = this.parseExpression(Precedence.LOWEST);

    if (expression === null) {
      return null;
    }

    statement.expression = expression;

    if (this.peekTokenIs(Tokens.SEMICOLON)) {
      this.nextToken();
    }

    return statement;
  }

  private parseExpression(precedence: number) {
    console.log('this.currentToken', this.currentToken);
    const getPrefix = this.prefixParseFns[this.currentToken.type];

    if (!getPrefix) {
      this.noPrefixParseFnError(this.currentToken.type);
      return null;
    }

    return getPrefix();
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

    this.peekError(token);
    return false;
  }

  private peekError(token: TokenType) {
    const msg = `expected next token to be ${token}, got ${this.peekToken.type} instead`;
    this.errors.push(msg);
  }

  private parseIdentifier() {
    return new Identifier(this.currentToken, this.currentToken.literal);
  }

  private parseIntegerLiteral() {
    const value = parseInt(this.currentToken.literal);

    if (isNaN(value)) {
      const msg = `could not parse ${this.currentToken.literal} as integer`;
      this.errors.push(msg);
      return null;
    }

    return new IntegerLiteral(
      this.currentToken,
      parseInt(this.currentToken.literal)
    );
  }

  private parsePrefixExpression() {
    const expression = new PrefixExpression(
      this.currentToken,
      this.currentToken.literal
    );

    this.nextToken();

    const rightExpression = this.parseExpression(Precedence.PREFIX);

    if (rightExpression) {
      expression.right = rightExpression;
    }

    return expression;
  }

  private registerPrefix(tokenType: TokenType, fn: prefixParseFn) {
    this.prefixParseFns[tokenType] = fn;
  }

  private registerInfix(tokenType: TokenType, fn: infixParseFn) {
    this.infixParseFns[tokenType] = fn;
  }

  private noPrefixParseFnError(tokenType: TokenType) {
    const msg = `no prefix parse function for ${tokenType} found`;
    this.errors.push(msg);
  }
}
