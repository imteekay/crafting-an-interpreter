import { describe, it, expect } from 'vitest';
import { Tokens, Token } from 'token';
import { Lexer } from 'lexer';

describe('Lexer', () => {
  it('verifies tokens', () => {
    const input = `
      let five = 5;
      let ten = 10;

      let add = fn(x, y) {
        x + y;
      };

      let result = add(five, ten);
      !-/*5;
      5 < 10 > 5;

      if (5 < 10) {
        return true;
      } else {
        return false;
      }

      10 == 10;
      10 != 9;

      "foobar";
      "foo bar";
      [9, 9];
    `;

    const tokens: Token[] = [
      { type: Tokens.LET, literal: 'let' },
      { type: Tokens.IDENT, literal: 'five' },
      { type: Tokens.ASSIGN, literal: '=' },
      { type: Tokens.INT, literal: '5' },
      { type: Tokens.SEMICOLON, literal: ';' },
      { type: Tokens.LET, literal: 'let' },
      { type: Tokens.IDENT, literal: 'ten' },
      { type: Tokens.ASSIGN, literal: '=' },
      { type: Tokens.INT, literal: '10' },
      { type: Tokens.SEMICOLON, literal: ';' },
      { type: Tokens.LET, literal: 'let' },
      { type: Tokens.IDENT, literal: 'add' },
      { type: Tokens.ASSIGN, literal: '=' },
      { type: Tokens.FUNCTION, literal: 'fn' },
      { type: Tokens.LPAREN, literal: '(' },
      { type: Tokens.IDENT, literal: 'x' },
      { type: Tokens.COMMA, literal: ',' },
      { type: Tokens.IDENT, literal: 'y' },
      { type: Tokens.RPAREN, literal: ')' },
      { type: Tokens.LBRACE, literal: '{' },
      { type: Tokens.IDENT, literal: 'x' },
      { type: Tokens.PLUS, literal: '+' },
      { type: Tokens.IDENT, literal: 'y' },
      { type: Tokens.SEMICOLON, literal: ';' },
      { type: Tokens.RBRACE, literal: '}' },
      { type: Tokens.SEMICOLON, literal: ';' },
      { type: Tokens.LET, literal: 'let' },
      { type: Tokens.IDENT, literal: 'result' },
      { type: Tokens.ASSIGN, literal: '=' },
      { type: Tokens.IDENT, literal: 'add' },
      { type: Tokens.LPAREN, literal: '(' },
      { type: Tokens.IDENT, literal: 'five' },
      { type: Tokens.COMMA, literal: ',' },
      { type: Tokens.IDENT, literal: 'ten' },
      { type: Tokens.RPAREN, literal: ')' },
      { type: Tokens.SEMICOLON, literal: ';' },
      { type: Tokens.BANG, literal: '!' },
      { type: Tokens.MINUS, literal: '-' },
      { type: Tokens.SLASH, literal: '/' },
      { type: Tokens.ASTERISK, literal: '*' },
      { type: Tokens.INT, literal: '5' },
      { type: Tokens.SEMICOLON, literal: ';' },
      { type: Tokens.INT, literal: '5' },
      { type: Tokens.LESS_THAN, literal: '<' },
      { type: Tokens.INT, literal: '10' },
      { type: Tokens.GREATER_THAN, literal: '>' },
      { type: Tokens.INT, literal: '5' },
      { type: Tokens.SEMICOLON, literal: ';' },
      { type: Tokens.IF, literal: 'if' },
      { type: Tokens.LPAREN, literal: '(' },
      { type: Tokens.INT, literal: '5' },
      { type: Tokens.LESS_THAN, literal: '<' },
      { type: Tokens.INT, literal: '10' },
      { type: Tokens.RPAREN, literal: ')' },
      { type: Tokens.LBRACE, literal: '{' },
      { type: Tokens.RETURN, literal: 'return' },
      { type: Tokens.TRUE, literal: 'true' },
      { type: Tokens.SEMICOLON, literal: ';' },
      { type: Tokens.RBRACE, literal: '}' },
      { type: Tokens.ELSE, literal: 'else' },
      { type: Tokens.LBRACE, literal: '{' },
      { type: Tokens.RETURN, literal: 'return' },
      { type: Tokens.FALSE, literal: 'false' },
      { type: Tokens.SEMICOLON, literal: ';' },
      { type: Tokens.RBRACE, literal: '}' },
      { type: Tokens.INT, literal: '10' },
      { type: Tokens.EQUAL, literal: '==' },
      { type: Tokens.INT, literal: '10' },
      { type: Tokens.SEMICOLON, literal: ';' },
      { type: Tokens.INT, literal: '10' },
      { type: Tokens.NOT_EQUAL, literal: '!=' },
      { type: Tokens.INT, literal: '9' },
      { type: Tokens.SEMICOLON, literal: ';' },
      { type: Tokens.STRING, literal: 'foobar' },
      { type: Tokens.SEMICOLON, literal: ';' },
      { type: Tokens.STRING, literal: 'foo bar' },
      { type: Tokens.SEMICOLON, literal: ';' },
      { type: Tokens.LBRACKET, literal: '[' },
      { type: Tokens.INT, literal: '9' },
      { type: Tokens.COMMA, literal: ',' },
      { type: Tokens.INT, literal: '9' },
      { type: Tokens.RBRACKET, literal: ']' },
      { type: Tokens.SEMICOLON, literal: ';' },
      { type: Tokens.EOF, literal: '' },
    ];

    const lexer = new Lexer(input);

    tokens.forEach(({ type, literal }) => {
      const inputToken = lexer.nextToken();

      expect(inputToken.type).toEqual(type);
      expect(inputToken.literal).toEqual(literal);
    });
  });
});
