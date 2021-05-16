import { Tokens, Token } from 'src/token/token';
import { Lexer } from '../lexer';

describe('Lexer', () => {
  it('verifies tokens', () => {
    const input = `
      let five = 5;
      let ten = 10;

      let add = fn(x, y) {
        x + y;
      };

      let result = add(five, ten);
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
