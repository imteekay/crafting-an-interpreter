import { describe, it, expect } from 'vitest';
import { StatementKind } from 'ast';
import { parse } from './parse';

describe('Parser', () => {
  describe('parseProgram', () => {
    it('parses the return statement', () => {
      const input = `
        return 5;
        return 10;
        return 10000;
      `;

      const { statements } = parse(input);
      const tests = [
        { tokenLiteral: 'return' },
        { tokenLiteral: 'return' },
        { tokenLiteral: 'return' },
      ];

      tests.forEach(({ tokenLiteral }, index) => {
        const statement = statements[index];

        if (statement.kind === StatementKind.Return) {
          expect(statement.tokenLiteral()).toEqual(tokenLiteral);
        }
      });
    });
  });
});
