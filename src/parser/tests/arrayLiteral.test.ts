import { describe, it, expect } from 'vitest';
import {
  ExpressionStatement,
  InfixExpression,
  IntegerLiteral,
  ArrayLiteral,
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
      const input = '[1, 2 * 2, 3 + 3];';
      const { statements } = parse(input);

      const statement = new ExpressionStatement(
        new Token(Tokens.LBRACKET, '[')
      );

      const arrayLiteral = new ArrayLiteral(new Token(Tokens.LBRACKET, '['));

      arrayLiteral.elements = [
        new IntegerLiteral(new Token(Tokens.INT, '1'), 1),
        buildInfix(2, 2, { token: Tokens.ASTERISK, op: '*' }),
        buildInfix(3, 3, { token: Tokens.PLUS, op: '+' }),
      ];

      statement.expression = arrayLiteral;

      expect(statements).toEqual([statement]);
    });
  });
});
