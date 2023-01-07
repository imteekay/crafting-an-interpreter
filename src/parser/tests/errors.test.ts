import { describe, it, expect } from 'vitest';
import { Lexer } from 'lexer';
import { Parser } from 'parser';

describe('Parser', () => {
  describe('parseProgram', () => {
    it('parses an input with error', () => {
      const input = `
        let 123;
        let a;
      `;

      const lexer = new Lexer(input);
      const parser = new Parser(lexer);

      parser.parseProgram();

      const errors = parser.getErrors();
      const expectedErrors = [
        'expected next token to be IDENT, got INT instead',
        'expected next token to be =, got ; instead',
        'no prefix parse function for ; found',
      ];

      errors.forEach((error, index) => {
        expect(error).toEqual(expectedErrors[index]);
      });
    });
  });
});
