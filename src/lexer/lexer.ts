import { Tokens, Token, TokenType, lookupIdent } from 'token';

export class Lexer {
  input: string;
  position: number;
  readPosition: number;
  char: string;

  INITIAL_POSITION = 0;
  EMPTY_CHAR = '';

  constructor(input: string) {
    this.input = input;
    this.setUpInitialState();
    this.readChar();
  }

  nextToken(): Token {
    const token = this.getToken();
    return token;
  }

  private setUpInitialState() {
    this.position = this.INITIAL_POSITION;
    this.readPosition = this.INITIAL_POSITION;
    this.char = this.EMPTY_CHAR;
  }

  private readChar() {
    if (this.readPosition >= this.input.length) {
      this.char = '';
    } else {
      this.char = this.input[this.readPosition];
    }

    this.position = this.readPosition;
    this.readPosition += 1;
  }

  private getToken(): Token {
    this.skipWhitespace();

    switch (this.char) {
      case '=':
        if (this.peekChar() === '=') {
          this.readChar();
          return this.buildToken(Tokens.EQUAL, '==');
        } else {
          return this.buildToken(Tokens.ASSIGN, '=');
        }
      case ';':
        return this.buildToken(Tokens.SEMICOLON, ';');
      case '(':
        return this.buildToken(Tokens.LPAREN, '(');
      case ')':
        return this.buildToken(Tokens.RPAREN, ')');
      case ',':
        return this.buildToken(Tokens.COMMA, ',');
      case '+':
        return this.buildToken(Tokens.PLUS, '+');
      case '{':
        return this.buildToken(Tokens.LBRACE, '{');
      case '}':
        return this.buildToken(Tokens.RBRACE, '}');
      case '!':
        if (this.peekChar() === '=') {
          this.readChar();
          return this.buildToken(Tokens.NOT_EQUAL, '!=');
        } else {
          return this.buildToken(Tokens.BANG, '!');
        }
      case '-':
        return this.buildToken(Tokens.MINUS, '-');
      case '/':
        return this.buildToken(Tokens.SLASH, '/');
      case '*':
        return this.buildToken(Tokens.ASTERISK, '*');
      case '<':
        return this.buildToken(Tokens.LESS_THAN, '<');
      case '>':
        return this.buildToken(Tokens.GREATER_THAN, '>');
      case '':
        return this.buildToken(Tokens.EOF, '');
      case '"':
        return this.buildToken(Tokens.STRING, this.readString());
      default:
        if (this.isLetter(this.char)) {
          const tokenLiteral = this.readIdentifier();
          const tokenType = lookupIdent(tokenLiteral);
          return new Token(tokenType, tokenLiteral);
        }

        if (this.isDigit(this.char)) {
          const tokenLiteral = this.readNumber();
          return new Token(Tokens.INT, tokenLiteral);
        }

        return new Token(Tokens.ILLEGAL, this.char);
    }
  }

  private buildToken(type: TokenType, literal: string) {
    this.readChar();
    return new Token(type, literal);
  }

  private readIdentifier() {
    const initialCharPosition = this.position;

    while (this.isLetter(this.char)) {
      this.readChar();
    }

    return this.input.substring(initialCharPosition, this.position);
  }

  private readNumber() {
    const initialIntPosition = this.position;

    while (this.isDigit(this.char)) {
      this.readChar();
    }

    return this.input.substring(initialIntPosition, this.position);
  }

  private readString() {
    const position = this.position + 1;
    this.readChar();

    while (this.char && this.char !== '"') {
      this.readChar();
    }

    return this.input.slice(position, this.position);
  }

  private isLetter(char: string) {
    return (
      ('a' <= char && char <= 'z') ||
      ('A' <= char && char <= 'Z') ||
      char === '_'
    );
  }

  private isDigit(char: string) {
    return '0' <= char && char <= '9';
  }

  private skipWhitespace() {
    while (
      this.char == ' ' ||
      this.char == '\t' ||
      this.char == '\n' ||
      this.char == '\r'
    ) {
      this.readChar();
    }
  }

  private peekChar() {
    if (this.readPosition >= this.input.length) {
      return '';
    } else {
      return this.input[this.readPosition];
    }
  }
}
