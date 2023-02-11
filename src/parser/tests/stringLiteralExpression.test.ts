import { describe, it, expect } from 'vitest';
import { ExpressionStatement, StringLiteral, StatementKind } from 'ast';
import { ExpressionKind } from 'ast/base';
import { Token, Tokens } from 'token';
import { parse } from './parse';

describe('Parser', () => {
  describe('parseProgram', () => {
    it('parses a string literal expression', () => {
      const input = '"Hello World";';
      const { statements } = parse(input);
      const statement = statements[0];

      if (
        statement.kind === StatementKind.Expression &&
        statement.expression.kind === ExpressionKind.StringLiteral
      ) {
        expect(statements.length).toEqual(1);

        const expression = statement.expression;

        expect(expression.value).toEqual('Hello World');
        expect(expression.tokenLiteral()).toEqual('Hello World');
      }
    });

    it('validates ast after parsing', () => {
      const input = '"Hello World";';
      const { statements } = parse(input);
      const stringToken = new Token(Tokens.STRING, 'Hello World');
      const expressionStatement = new ExpressionStatement(stringToken);
      expressionStatement.expression = new StringLiteral(
        stringToken,
        'Hello World'
      );
      expect(statements).toEqual([expressionStatement]);
    });
  });
});
