import { describe, it, expect } from 'vitest';
import { StatementKind } from 'ast';
import { ExpressionKind } from 'ast/base';
import { checkParserErrors } from './checkParserErrors';
import { parse } from './parse';

describe('Parser', () => {
  describe('parseProgram', () => {
    it('parses boolean expression', () => {
      const input = `
        true;
        false;
      `;

      const { statements } = parse(input);
      const tests = [
        { value: true, valueString: 'true' },
        { value: false, valueString: 'false' },
      ];

      tests.forEach(({ value, valueString }, index) => {
        const statement = statements[index];

        if (
          statement.kind === StatementKind.Expression &&
          statement.expression.kind === ExpressionKind.Boolean
        ) {
          expect(statement.expression.value).toEqual(value);
          expect(statement.expression.tokenLiteral()).toEqual(valueString);
        }
      });
    });
  });
});
