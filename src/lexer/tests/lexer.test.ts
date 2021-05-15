import { Tokens, Token } from 'src/token/token';
import { Lexer } from '../lexer';

describe('Lexer', () => {
  it('tests', () => {
    const input = '=+(){},;';
    const tokens: Token[] = [
      { type: Tokens.ASSIGN, literal: '=' },
      { type: Tokens.PLUS, literal: '+' },
      { type: Tokens.LPAREN, literal: '(' },
      { type: Tokens.RPAREN, literal: ')' },
      { type: Tokens.LBRACE, literal: '{' },
      { type: Tokens.RBRACE, literal: '}' },
      { type: Tokens.COMMA, literal: ',' },
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
