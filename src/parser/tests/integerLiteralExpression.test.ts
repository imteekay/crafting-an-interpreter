import { describe, it, expect } from 'vitest';
import { ExpressionStatement, IntegerLiteral, StatementKind } from 'ast';
import { ExpressionKind } from 'ast/base';
import { Token, Tokens } from 'token';
import { parse } from './parse';

describe('Parser', () => {
  describe('parseProgram', () => {
    it('parses an integer literal expression', () => {
      const input = '10;';
      const { statements } = parse(input);
      const statement = statements[0];

      if (
        statement.kind === StatementKind.Expression &&
        statement.expression.kind === ExpressionKind.IntegerLiteral
      ) {
        expect(statements.length).toEqual(1);

        const expression = statement.expression;

        expect(expression.value).toEqual(10);
        expect(expression.tokenLiteral()).toEqual('10');
      }
    });

    it('validates ast after parsing', () => {
      const input = '10;';
      const { statements } = parse(input);
      const integerToken = new Token(Tokens.INT, '10');
      const expressionStatement = new ExpressionStatement(integerToken);
      expressionStatement.expression = new IntegerLiteral(integerToken, 10);
      expect(statements).toEqual([expressionStatement]);
    });
  });
});
