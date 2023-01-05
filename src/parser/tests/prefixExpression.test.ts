import { describe, it, expect } from 'vitest';
import { StatementKind } from 'ast';
import { ExpressionKind } from 'ast/base';
import { Lexer } from 'lexer';
import { Parser } from 'parser';
import { checkParserErrors } from './checkParserErrors';

describe('Parser', () => {
  describe('parseProgram', () => {
    it('parses prefix expressions', () => {
      type Test = {
        input: string;
        operator: string;
        value: number | boolean;
      };

      const tests: Test[] = [
        { input: '!5;', operator: '!', value: 5 },
        { input: '-15;', operator: '-', value: 15 },
        { input: '!true', operator: '!', value: true },
        { input: '!false', operator: '!', value: false },
      ];

      tests.forEach((test: Test) => {
        const lexer = new Lexer(test.input);
        const parser = new Parser(lexer);
        const program = parser.parseProgram();
        const statements = program.statements;
        const errors = parser.getErrors();
        const statement = statements[0];

        checkParserErrors(errors);

        if (
          statement.kind === StatementKind.Expression &&
          statement.expression.kind === ExpressionKind.Prefix
        ) {
          const expression = statement.expression;
          const rightExpression = expression.right;

          expect(expression.operator).toEqual(test.operator);

          if (rightExpression.kind == ExpressionKind.IntegerLiteral) {
            expect(rightExpression.value).toEqual(test.value);
            expect(rightExpression.tokenLiteral()).toEqual(
              test.value.toString()
            );
          }
        }
      });
    });
  });
});
