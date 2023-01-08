import { describe, it, expect } from 'vitest';
import { StatementKind, BooleanExpression } from 'ast';
import { ExpressionKind } from 'ast/base';
import { Token, Tokens } from 'token';
import { parse } from './parse';

describe('Parser', () => {
  describe('parseProgram', () => {
    it('validates ast after parsing for an if expression', () => {
      const input = 'if (x < y) { x }';
      const { statements } = parse(input);

      expect(statements).toEqual([]);
    });

    it('validates ast after parsing for an if-else expression', () => {
      const input = 'if (x < y) { x } else { y }';
      const { statements } = parse(input);

      expect(statements).toEqual([]);
    });
  });
});
