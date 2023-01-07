import { describe, it, expect } from 'vitest';
import { StatementKind, LetStatement, Identifier } from 'ast';
import { Token, Tokens } from 'token';
import { parse } from './parse';

describe('Parser', () => {
  describe('parseProgram', () => {
    it('parses the let statement', () => {
      const input = `
        let x = 5;
        let y = 10;
        let foobar = 10000;
      `;

      const { statements } = parse(input);
      const tests = [
        { identifier: 'x' },
        { identifier: 'y' },
        { identifier: 'foobar' },
      ];

      tests.forEach(({ identifier }, index) => {
        const statement = statements[index];

        if (statement.kind === StatementKind.Let) {
          expect(statement.tokenLiteral()).toEqual('let');
          expect(statement.name.value).toEqual(identifier);
          expect(statement.name.tokenLiteral()).toEqual(identifier);
        }
      });

      const xStatement = new LetStatement(new Token(Tokens.LET, 'let'));
      xStatement.name = new Identifier(new Token(Tokens.IDENT, 'x'), 'x');

      const yStatement = new LetStatement(new Token(Tokens.LET, 'let'));
      yStatement.name = new Identifier(new Token(Tokens.IDENT, 'y'), 'y');

      const foobarStatement = new LetStatement(new Token(Tokens.LET, 'let'));
      foobarStatement.name = new Identifier(
        new Token(Tokens.IDENT, 'foobar'),
        'foobar'
      );

      expect(statements).toEqual([xStatement, yStatement, foobarStatement]);
    });

    it('validates ast after parsing', () => {
      const input = `
        let x = 5;
        let y = 10;
        let foobar = 10000;
      `;

      const { statements } = parse(input);

      const xStatement = new LetStatement(new Token(Tokens.LET, 'let'));
      xStatement.name = new Identifier(new Token(Tokens.IDENT, 'x'), 'x');

      const yStatement = new LetStatement(new Token(Tokens.LET, 'let'));
      yStatement.name = new Identifier(new Token(Tokens.IDENT, 'y'), 'y');

      const foobarStatement = new LetStatement(new Token(Tokens.LET, 'let'));
      foobarStatement.name = new Identifier(
        new Token(Tokens.IDENT, 'foobar'),
        'foobar'
      );

      expect(statements).toEqual([xStatement, yStatement, foobarStatement]);
    });
  });
});
