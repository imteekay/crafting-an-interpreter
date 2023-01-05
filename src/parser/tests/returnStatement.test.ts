import { describe, it, expect } from 'vitest';
import { StatementKind } from 'ast';
import { Lexer } from 'lexer';
import { Parser } from 'parser';
import { checkParserErrors } from './checkParserErrors';

describe('Parser', () => {
  describe('parseProgram', () => {
    it('parses the return statement', () => {
      const input = `
        return 5;
        return 10;
        return 10000;
      `;

      const lexer = new Lexer(input);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();
      const errors = parser.getErrors();

      checkParserErrors(errors);

      const tests = [
        { tokenLiteral: 'return' },
        { tokenLiteral: 'return' },
        { tokenLiteral: 'return' },
      ];

      tests.forEach(({ tokenLiteral }, index) => {
        const statement = program.statements[index];

        if (statement.kind === StatementKind.Return) {
          expect(statement.tokenLiteral()).toEqual(tokenLiteral);
        }
      });
    });
  });
});
