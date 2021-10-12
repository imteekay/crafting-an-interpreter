import { Program } from 'src/ast/ast';
import { Lexer } from 'src/lexer/lexer';
import { Token } from 'src/token/token';

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
    return null;
  }
}
