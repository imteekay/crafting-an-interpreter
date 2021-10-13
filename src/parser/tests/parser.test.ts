import { Lexer } from 'lexer/lexer';
import { Parser } from 'parser/parser';

describe('Parser', () => {
  describe('parseProgram', () => {
    it('parses an input', () => {
      const input = `
        let x = 5;
        let y = 10;
        let foobar = 10000;
        let 123;
      `;

      const lexer = new Lexer(input);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      const tests = [
        { identifier: 'x' },
        { identifier: 'y' },
        { identifier: 'foobar' },
      ];

      tests.forEach(({ identifier }, index) => {
        const statement = program.statements[index];

        expect(statement.tokenLiteral()).toEqual('let');
        expect(statement.name.value).toEqual(identifier);
        expect(statement.name.tokenLiteral()).toEqual(identifier);
      });
    });

    it('parses an input with error', () => {
      const input = `
        let 123;
      `;

      const lexer = new Lexer(input);
      const parser = new Parser(lexer);

      parser.parseProgram();

      const errors = parser.getErrors();
      const expectedErrors = [
        'expected next token to be IDENT, got INT instead',
      ];

      errors.forEach((error, index) => {
        expect(error).toEqual(expectedErrors[index]);
      });
    });
  });
});
