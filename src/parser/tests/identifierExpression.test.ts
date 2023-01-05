import { describe, it, expect } from 'vitest';
import { StatementKind } from 'ast';
import { ExpressionKind } from 'ast/base';
import { Lexer } from 'lexer';
import { Parser } from 'parser';
import { checkParserErrors } from './checkParserErrors';

describe('Parser', () => {
  describe('parseProgram', () => {
    it('parses an identifier expression', () => {
      const input = 'foobar;';

      const lexer = new Lexer(input);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();
      const statements = program.statements;
      const errors = parser.getErrors();
      const statement = statements[0];

      checkParserErrors(errors);

      if (
        statement.kind === StatementKind.Expression &&
        statement.expression.kind === ExpressionKind.Identifier
      ) {
        expect(statements.length).toEqual(1);
        expect(statement.expression.value).toEqual('foobar');
        expect(statement.expression.tokenLiteral()).toEqual('foobar');
      }
    });
  });
});
