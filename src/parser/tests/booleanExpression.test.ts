import { describe, it, expect } from 'vitest';
import { StatementKind, BooleanExpression } from 'ast';
import { ExpressionKind } from 'ast/base';
import { Token, Tokens } from 'token';
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

      const trueToken = new Token(Tokens.TRUE, 'true');
      const falseToken = new Token(Tokens.FALSE, 'false');

      expect(statements).toEqual([
        {
          token: trueToken,
          kind: StatementKind.Expression,
          expression: new BooleanExpression(trueToken, true),
        },
        {
          token: falseToken,
          kind: 'expression',
          expression: new BooleanExpression(falseToken, false),
        },
      ]);
    });
  });
});
