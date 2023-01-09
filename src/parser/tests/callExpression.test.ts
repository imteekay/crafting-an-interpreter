import { describe, it, expect } from 'vitest';
import {
  BlockStatement,
  ExpressionStatement,
  Identifier,
  InfixExpression,
  FunctionLiteral,
  CallExpression,
  IntegerLiteral,
} from 'ast';
import { Token, Tokens } from 'token';
import { parse } from './parse';

function buildInfix(
  integerLiteral1: number,
  integerLiteral2: number,
  operator: {
    token: Tokens;
    op: string;
  }
) {
  const integerLiteral = new IntegerLiteral(
    new Token(Tokens.INT, integerLiteral1.toString()),
    integerLiteral1
  );

  const infixExpression = new InfixExpression(
    new Token(operator.token, operator.op),
    operator.op,
    integerLiteral
  );

  infixExpression.right = new IntegerLiteral(
    new Token(Tokens.INT, integerLiteral2.toString()),
    integerLiteral2
  );

  return infixExpression;
}

describe('Parser', () => {
  describe('parseProgram', () => {
    it('validates ast after parsing', () => {
      const input = 'add(1, 2 * 3, 4 + 5);';
      const { statements } = parse(input);

      const statement = new ExpressionStatement(new Token(Tokens.IDENT, 'add'));
      const callExpression = new CallExpression(
        new Token(Tokens.LPAREN, '('),
        new Identifier(new Token(Tokens.IDENT, 'add'), 'add')
      );

      const integerLiteral = new IntegerLiteral(new Token(Tokens.INT, '2'), 2);
      const infixExpression = new InfixExpression(
        new Token(Tokens.ASTERISK, '*'),
        '*',
        integerLiteral
      );

      infixExpression.right = new IntegerLiteral(new Token(Tokens.INT, '3'), 3);

      callExpression.arguments = [
        new IntegerLiteral(new Token(Tokens.INT, '1'), 1),
        buildInfix(2, 3, { token: Tokens.ASTERISK, op: '*' }),
        buildInfix(4, 5, { token: Tokens.PLUS, op: '+' }),
      ];

      statement.expression = callExpression;

      expect(statements).toEqual([statement]);
    });
  });
});
