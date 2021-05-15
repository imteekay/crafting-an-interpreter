import { Tokens, Token } from 'src/token/token';

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
    this.readChar();
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
    switch (this.char) {
      case '=':
        return new Token(Tokens.ASSIGN, '=');
      case ';':
        return new Token(Tokens.SEMICOLON, ';');
      case '(':
        return new Token(Tokens.LPAREN, '(');
      case ')':
        return new Token(Tokens.RPAREN, ')');
      case ',':
        return new Token(Tokens.COMMA, ',');
      case '+':
        return new Token(Tokens.PLUS, '+');
      case '{':
        return new Token(Tokens.LBRACE, '{');
      case '}':
        return new Token(Tokens.RBRACE, '}');
      default:
        return new Token(Tokens.EOF, '');
    }
  }
}
