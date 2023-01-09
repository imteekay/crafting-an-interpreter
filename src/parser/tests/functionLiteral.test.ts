import { describe, it, expect } from 'vitest';
import {
  BlockStatement,
  ExpressionStatement,
  Identifier,
  InfixExpression,
  StatementKind,
} from 'ast';
import { Token, Tokens } from 'token';
import { parse } from './parse';
import { FunctionLiteral } from 'ast/FunctionLiteral';

describe('Parser', () => {
  describe('parseProgram', () => {
    it('validates ast after parsing', () => {
      const input = 'fn(x, y) { x + y; }';
      const { statements } = parse(input);

      const statement = new ExpressionStatement(
        new Token(Tokens.FUNCTION, 'fn')
      );

      const functionLiteralExpression = new FunctionLiteral(
        new Token(Tokens.FUNCTION, 'fn')
      );

      functionLiteralExpression.parameters = [
        new Identifier(new Token(Tokens.IDENT, 'x'), 'x'),
        new Identifier(new Token(Tokens.IDENT, 'y'), 'y'),
      ];

      const body = new BlockStatement(new Token(Tokens.LBRACE, '{'));

      const bodyStatement = new ExpressionStatement(
        new Token(Tokens.PLUS, '+')
      );

      const infixExpression = new InfixExpression(
        new Token(Tokens.PLUS, '+'),
        '+',
        new Identifier(new Token(Tokens.IDENT, 'x'), 'x')
      );

      infixExpression.right = new Identifier(new Token(Tokens.IDENT, 'y'), 'y');
      bodyStatement.expression = infixExpression;
      body.statements.push(bodyStatement);
      functionLiteralExpression.body = body;
      statement.expression = functionLiteralExpression;

      expect(statements).toEqual(statement);
    });
  });
});
