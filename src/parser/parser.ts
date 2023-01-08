import { Lexer } from 'lexer';
import { Token, Tokens, TokenType } from 'token';
import {
  Program,
  LetStatement,
  Identifier,
  IntegerLiteral,
  ReturnStatement,
  ExpressionStatement,
  Expression,
  InfixExpression,
  PrefixExpression,
  BooleanExpression,
  BlockStatement,
} from 'ast';
import { IfExpression } from 'ast/IfExpression';

export type ParserError = string;

type prefixParseFn = () => Expression | null;
type infixParseFn = (expression: Expression) => Expression;

enum Precedence {
  LOWEST = 1,
  EQUALS, // ==
  LESSGREATER, // > or <
  SUM, // +
  PRODUCT, // *
  PREFIX, // -X or !X
  CALL, // myFunction(X)
}

const precedences = new Map<TokenType, Precedence>([
  [Tokens.EQUAL, Precedence.EQUALS],
  [Tokens.NOT_EQUAL, Precedence.EQUALS],
  [Tokens.LESS_THAN, Precedence.LESSGREATER],
  [Tokens.GREATER_THAN, Precedence.LESSGREATER],
  [Tokens.PLUS, Precedence.SUM],
  [Tokens.MINUS, Precedence.SUM],
  [Tokens.SLASH, Precedence.PRODUCT],
  [Tokens.ASTERISK, Precedence.PRODUCT],
  [Tokens.LPAREN, Precedence.CALL],
]);

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

    // Parsing prefix expressions
    this.registerPrefix(Tokens.IDENT, this.parseIdentifier.bind(this));
    this.registerPrefix(Tokens.INT, this.parseIntegerLiteral.bind(this));
    this.registerPrefix(Tokens.BANG, this.parsePrefixExpression.bind(this));
    this.registerPrefix(Tokens.MINUS, this.parsePrefixExpression.bind(this));
    this.registerPrefix(Tokens.TRUE, this.parseBoolean.bind(this));
    this.registerPrefix(Tokens.FALSE, this.parseBoolean.bind(this));
    this.registerPrefix(Tokens.LPAREN, this.parseGroupedExpression.bind(this));
    this.registerPrefix(Tokens.IF, this.parseIfExpression.bind(this));

    // Parsing infix expressions
    this.registerInfix(Tokens.PLUS, this.parseInfixExpression.bind(this));
    this.registerInfix(Tokens.MINUS, this.parseInfixExpression.bind(this));
    this.registerInfix(Tokens.SLASH, this.parseInfixExpression.bind(this));
    this.registerInfix(Tokens.ASTERISK, this.parseInfixExpression.bind(this));
    this.registerInfix(Tokens.EQUAL, this.parseInfixExpression.bind(this));
    this.registerInfix(Tokens.NOT_EQUAL, this.parseInfixExpression.bind(this));
    this.registerInfix(Tokens.LESS_THAN, this.parseInfixExpression.bind(this));
    this.registerInfix(
      Tokens.GREATER_THAN,
      this.parseInfixExpression.bind(this)
    );
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

  /** === Parsing Statements === */
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

    if (!expression) {
      return null;
    }

    statement.expression = expression;

    if (this.peekTokenIs(Tokens.SEMICOLON)) {
      this.nextToken();
    }

    return statement;
  }
  /** === Parsing Statements === */

  /** === Parsing Expressions === */
  private parseExpression(precedence: Precedence) {
    const getPrefix = this.prefixParseFns[this.currentToken.type];

    if (!getPrefix) {
      this.noPrefixParseFnError(this.currentToken.type);
      return null;
    }

    let leftExpression = getPrefix();

    while (
      !this.peekTokenIs(Tokens.SEMICOLON) &&
      precedence < this.peekPrecedence()
    ) {
      const getInfix = this.infixParseFns[this.peekToken.type];

      if (!getInfix) {
        return leftExpression;
      }

      this.nextToken();

      if (leftExpression) {
        leftExpression = getInfix(leftExpression);
      }
    }

    return leftExpression;
  }
  /** === Parsing Expressions === */

  /** === Token Handler === */
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
  /** === Token Handler === */

  /** === Parsing Functions === */
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

  private parseBoolean() {
    return new BooleanExpression(
      this.currentToken,
      this.currentTokenIs(Tokens.TRUE)
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

  private parseInfixExpression(left: Expression) {
    const expression = new InfixExpression(
      this.currentToken,
      this.currentToken.literal,
      left
    );

    const precedence = this.currentPrecedence();
    this.nextToken();
    const right = this.parseExpression(precedence);

    if (right) {
      expression.right = right;
    }

    return expression;
  }

  private parseGroupedExpression() {
    this.nextToken();

    const expression = this.parseExpression(Precedence.LOWEST);

    if (!this.expectPeek(Tokens.RPAREN)) {
      return null;
    }

    return expression;
  }

  private parseIfExpression() {
    const expression = new IfExpression(this.currentToken);

    if (!this.expectPeek(Tokens.LPAREN)) {
      return null;
    }

    this.nextToken();

    const condition = this.parseExpression(Precedence.LOWEST);

    if (condition) {
      expression.condition = condition;
    }

    if (!this.expectPeek(Tokens.RPAREN)) {
      return null;
    }

    if (!this.expectPeek(Tokens.LBRACE)) {
      return null;
    }

    const consequence = this.parseBlockStatement();

    if (consequence) {
      expression.consequence = consequence;
    }

    return expression;
  }

  private parseBlockStatement() {
    const block = new BlockStatement(this.currentToken);
    block.statements = [];

    this.nextToken();

    while (
      !this.currentTokenIs(Tokens.RBRACE) &&
      !this.currentTokenIs(Tokens.EOF)
    ) {
      const statement = this.parseStatement();

      if (statement) {
        block.statements.push(statement);
      }

      this.nextToken();
    }

    return block;
  }
  /** === Parsing Functions === */

  /** === Registering parsing functions === */
  private registerPrefix(tokenType: TokenType, fn: prefixParseFn) {
    this.prefixParseFns[tokenType] = fn;
  }

  private registerInfix(tokenType: TokenType, fn: infixParseFn) {
    this.infixParseFns[tokenType] = fn;
  }
  /** === Registering parsing functions === */

  /** === Precedence Handlers === */
  private currentPrecedence() {
    return precedences.has(this.currentToken.type)
      ? (precedences.get(this.currentToken.type) as Precedence)
      : Precedence.LOWEST;
  }

  private peekPrecedence() {
    return precedences.has(this.peekToken.type)
      ? (precedences.get(this.peekToken.type) as Precedence)
      : Precedence.LOWEST;
  }
  /** === Precedence Handlers === */

  /** === Error Handling === */
  private peekError(token: TokenType) {
    const msg = `expected next token to be ${token}, got ${this.peekToken.type} instead`;
    this.errors.push(msg);
  }

  private noPrefixParseFnError(tokenType: TokenType) {
    const msg = `no prefix parse function for ${tokenType} found`;
    this.errors.push(msg);
  }
  /** === Error Handling === */
}
