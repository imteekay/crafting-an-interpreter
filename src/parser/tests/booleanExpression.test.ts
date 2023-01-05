import { describe, it, expect } from 'vitest';
import { StatementKind } from 'ast';
import { ExpressionKind } from 'ast/base';
import { Lexer } from 'lexer';
import { Parser } from 'parser';
import { checkParserErrors } from './checkParserErrors';

describe('Parser', () => {
  describe('parseProgram', () => {
    it('parses boolean expression', () => {
      const input = `
        true;
        false;
      `;

      const lexer = new Lexer(input);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();
      const errors = parser.getErrors();

      checkParserErrors(errors);

      const tests = [
        { value: true, valueString: 'true' },
        { value: false, valueString: 'false' },
      ];

      tests.forEach(({ value, valueString }, index) => {
        const statement = program.statements[index];

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
