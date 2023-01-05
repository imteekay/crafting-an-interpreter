import { describe, it, expect } from 'vitest';
import { StatementKind } from 'ast';
import { ExpressionKind } from 'ast/base';
import { Lexer } from 'lexer';
import { Parser } from 'parser';
import { checkParserErrors } from './checkParserErrors';

describe('Parser', () => {
  describe('parseProgram', () => {
    it('parses an integer literal expression', () => {
      const input = '10;';

      const lexer = new Lexer(input);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();
      const statements = program.statements;
      const errors = parser.getErrors();
      const statement = statements[0];

      checkParserErrors(errors);

      if (
        statement.kind === StatementKind.Expression &&
        statement.expression.kind === ExpressionKind.IntegerLiteral
      ) {
        expect(statements.length).toEqual(1);

        const expression = statement.expression;

        expect(expression.value).toEqual(10);
        expect(expression.tokenLiteral()).toEqual('10');
      }
    });
  });
});
