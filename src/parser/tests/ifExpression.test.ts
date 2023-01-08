import { describe, it, expect } from 'vitest';
import {
  ExpressionStatement,
  IfExpression,
  InfixExpression,
  Identifier,
  BlockStatement,
} from 'ast';
import { Token, Tokens } from 'token';
import { parse } from './parse';

describe('Parser', () => {
  describe('parseProgram', () => {
    it('validates ast after parsing for an if expression', () => {
      const input = 'if (x < y) { x }';
      const { statements } = parse(input);
      const ifToken = new Token(Tokens.IF, 'if');
      const expressionStatement = new ExpressionStatement(ifToken);

      const ifExpression = new IfExpression(ifToken);
      const identifier = new Identifier(new Token(Tokens.IDENT, 'x'), 'x');
      const condition = new InfixExpression(
        new Token(Tokens.LESS_THAN, '<'),
        '<',
        identifier
      );

      condition.right = new Identifier(new Token(Tokens.IDENT, 'y'), 'y');

      const consequence = new BlockStatement(new Token(Tokens.LBRACE, '{'));

      const xIdentifierStatement = new ExpressionStatement(
        new Token(Tokens.IDENT, 'x')
      );

      xIdentifierStatement.expression = new Identifier(
        new Token(Tokens.IDENT, 'x'),
        'x'
      );

      consequence.statements.push(xIdentifierStatement);

      ifExpression.condition = condition;
      ifExpression.consequence = consequence;
      expressionStatement.expression = ifExpression;

      expect(statements).toEqual([expressionStatement]);
    });

    it('validates ast after parsing for an if-else expression', () => {
      const input = 'if (x < y) { x } else { y }';
      const { statements } = parse(input);
      const ifToken = new Token(Tokens.IF, 'if');
      const expressionStatement = new ExpressionStatement(ifToken);

      const ifExpression = new IfExpression(ifToken);
      const identifier = new Identifier(new Token(Tokens.IDENT, 'x'), 'x');
      const condition = new InfixExpression(
        new Token(Tokens.LESS_THAN, '<'),
        '<',
        identifier
      );

      condition.right = new Identifier(new Token(Tokens.IDENT, 'y'), 'y');

      const consequence = new BlockStatement(new Token(Tokens.LBRACE, '{'));

      const xIdentifierStatement = new ExpressionStatement(
        new Token(Tokens.IDENT, 'x')
      );

      xIdentifierStatement.expression = new Identifier(
        new Token(Tokens.IDENT, 'x'),
        'x'
      );

      consequence.statements.push(xIdentifierStatement);

      const alternative = new BlockStatement(new Token(Tokens.LBRACE, '{'));

      const yIdentifierStatement = new ExpressionStatement(
        new Token(Tokens.IDENT, 'y')
      );

      yIdentifierStatement.expression = new Identifier(
        new Token(Tokens.IDENT, 'y'),
        'y'
      );

      alternative.statements.push(yIdentifierStatement);

      ifExpression.condition = condition;
      ifExpression.consequence = consequence;
      ifExpression.alternative = alternative;

      expressionStatement.expression = ifExpression;

      expect(statements).toEqual([expressionStatement]);
    });
  });
});
