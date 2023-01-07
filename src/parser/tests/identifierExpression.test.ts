import { describe, it, expect } from 'vitest';
import { ExpressionStatement, StatementKind, Identifier } from 'ast';
import { ExpressionKind } from 'ast/base';
import { Token, Tokens } from 'token';
import { parse } from './parse';

describe('Parser', () => {
  describe('parseProgram', () => {
    it('parses an identifier expression', () => {
      const input = 'foobar;';
      const { statements } = parse(input);
      const statement = statements[0];

      if (
        statement.kind === StatementKind.Expression &&
        statement.expression.kind === ExpressionKind.Identifier
      ) {
        expect(statements.length).toEqual(1);
        expect(statement.expression.value).toEqual('foobar');
        expect(statement.expression.tokenLiteral()).toEqual('foobar');
      }

      const identifierToken = new Token(Tokens.IDENT, 'foobar');
      const expressionStatement = new ExpressionStatement(identifierToken);
      expressionStatement.expression = new Identifier(
        identifierToken,
        'foobar'
      );

      expect(statements).toEqual([expressionStatement]);
    });
  });
});
