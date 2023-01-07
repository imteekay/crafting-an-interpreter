import { describe, it, expect } from 'vitest';
import {
  ExpressionStatement,
  IntegerLiteral,
  PrefixExpression,
  StatementKind,
} from 'ast';
import { ExpressionKind } from 'ast/base';
import { parse } from './parse';
import { Token, Tokens } from 'token';

describe('Parser', () => {
  describe('parseProgram', () => {
    it('parses prefix expressions', () => {
      const tests = [
        { input: '!5;', operator: '!', value: 5 },
        { input: '-15;', operator: '-', value: 15 },
        { input: '!true', operator: '!', value: true },
        { input: '!false', operator: '!', value: false },
      ];

      tests.forEach((test) => {
        const { statements } = parse(test.input);
        const statement = statements[0];

        if (
          statement.kind === StatementKind.Expression &&
          statement.expression.kind === ExpressionKind.Prefix
        ) {
          const expression = statement.expression;
          const rightExpression = expression.right;

          expect(expression.operator).toEqual(test.operator);

          if (rightExpression.kind == ExpressionKind.IntegerLiteral) {
            expect(rightExpression.value).toEqual(test.value);
            expect(rightExpression.tokenLiteral()).toEqual(
              test.value.toString()
            );
          }
        }
      });
    });

    it('validates ast after parsing', () => {
      const input = '!10;';
      const { statements } = parse(input);

      const bangToken = new Token(Tokens.BANG, '!');
      const expressionStatement = new ExpressionStatement(bangToken);
      const prefixExpression = new PrefixExpression(bangToken, '!');
      prefixExpression.right = new IntegerLiteral(
        new Token(Tokens.INT, '10'),
        10
      );
      expressionStatement.expression = prefixExpression;
      expect(statements).toEqual([expressionStatement]);
    });
  });
});
