import { describe, it, expect } from 'vitest';
import {
  ExpressionStatement,
  InfixExpression,
  IntegerLiteral,
  StatementKind,
} from 'ast';
import { ExpressionKind } from 'ast/base';
import { parse } from './parse';
import { Token, Tokens } from 'token';

describe('Parser', () => {
  describe('parseProgram', () => {
    it('parses infix expressions', () => {
      const tests = [
        { input: '5 + 5;', leftValue: 5, operator: '+', rightValue: 5 },
        { input: '5 - 5;', leftValue: 5, operator: '-', rightValue: 5 },
        { input: '5 * 5;', leftValue: 5, operator: '*', rightValue: 5 },
        { input: '5 / 5;', leftValue: 5, operator: '/', rightValue: 5 },
        { input: '5 > 5;', leftValue: 5, operator: '>', rightValue: 5 },
        { input: '5 < 5;', leftValue: 5, operator: '<', rightValue: 5 },
        { input: '5 == 5;', leftValue: 5, operator: '==', rightValue: 5 },
        { input: '5 != 5;', leftValue: 5, operator: '!=', rightValue: 5 },
      ];

      tests.forEach((test) => {
        const { statements } = parse(test.input);
        const statement = statements[0];

        if (statements.length !== 1) {
          throw new Error(
            `program does not contain 1 statement. got ${statements.length}`
          );
        }

        if (
          statement.kind === StatementKind.Expression &&
          statement.expression.kind === ExpressionKind.Infix
        ) {
          const { expression } = statement;
          const { operator } = expression;

          const left = expression.left as IntegerLiteral;
          const right = expression.right as IntegerLiteral;

          expect(left.value).toEqual(test.leftValue);
          expect(left.tokenLiteral()).toEqual(test.leftValue.toString());

          expect(operator).toEqual(test.operator);

          expect(right.value).toEqual(test.rightValue);
          expect(right.tokenLiteral()).toEqual(test.rightValue.toString());
        }
      });
    });
  });

  it('parses two infix expressions', () => {
    const input = '1 + 2 + 3';
    const { statements } = parse(input);
    const plusToken = new Token(Tokens.PLUS, '+');
    const expressionStatement = new ExpressionStatement(
      new Token(Tokens.INT, '1')
    );

    const nestedInfixExpression = new InfixExpression(
      plusToken,
      '+',
      new IntegerLiteral(new Token(Tokens.INT, '1'), 1)
    );

    nestedInfixExpression.right = new IntegerLiteral(
      new Token(Tokens.INT, '2'),
      2
    );

    const infixExpression = new InfixExpression(
      plusToken,
      '+',
      nestedInfixExpression
    );

    infixExpression.right = new IntegerLiteral(new Token(Tokens.INT, '3'), 3);
    expressionStatement.expression = infixExpression;

    expect(statements).toEqual([expressionStatement]);
  });

  it('parses two infix expressions with different precedences', () => {
    const input = '1 + 2 * 3';
    const { statements } = parse(input);

    expect(statements).toEqual([
      {
        token: {
          type: 'INT',
          literal: '1',
        },
        kind: 'expression',
        expression: {
          token: {
            type: '+',
            literal: '+',
          },
          operator: '+',
          left: {
            token: {
              type: 'INT',
              literal: '1',
            },
            value: 1,
            kind: 'integerLiteral',
          },
          kind: 'infix',
          right: {
            token: {
              type: '*',
              literal: '*',
            },
            operator: '*',
            kind: 'infix',
            left: {
              token: {
                type: 'INT',
                literal: '2',
              },
              value: 2,
              kind: 'integerLiteral',
            },
            right: {
              token: {
                type: 'INT',
                literal: '3',
              },
              value: 3,
              kind: 'integerLiteral',
            },
          },
        },
      },
    ]);
  });
});
