import { describe, it, expect } from 'vitest';
import {
  ExpressionStatement,
  InfixExpression,
  IntegerLiteral,
  ArrayLiteral,
  Identifier,
  IndexExpression,
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
      const input = 'myArray[1 + 1];';
      const { statements } = parse(input);

      const statement = new ExpressionStatement(
        new Token(Tokens.IDENT, 'myArray')
      );

      const leftExpression = new Identifier(
        new Token(Tokens.IDENT, 'myArray'),
        'myArray'
      );

      const indexExpression = new IndexExpression(
        new Token(Tokens.LBRACKET, '['),
        leftExpression
      );

      const infixExpression = new InfixExpression(
        new Token(Tokens.PLUS, '+'),
        '+',
        new IntegerLiteral(new Token(Tokens.INT, '1'), 1)
      );

      infixExpression.right = new IntegerLiteral(new Token(Tokens.INT, '1'), 1);
      indexExpression.index = infixExpression;
      statement.expression = indexExpression;

      expect(statements).toEqual([statement]);
    });
  });
});
