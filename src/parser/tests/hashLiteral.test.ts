import { describe, it, expect } from 'vitest';
import { ExpressionStatement, HashLiteral } from 'ast';
import { parse } from './parse';

describe('Parser', () => {
  describe('parseProgram', () => {
    it('validates empty hash', () => {
      const input = '{};';
      const { statements } = parse(input);
      const hashLiteral = (statements[0] as ExpressionStatement)
        .expression as HashLiteral;

      expect(hashLiteral.pairs.size).toEqual(0);
    });

    it('validates ast after parsing', () => {
      const input = '{"one": 1, "two": 2, "three": 3};';
      const { statements } = parse(input);
      const hashLiteral = (statements[0] as ExpressionStatement)
        .expression as HashLiteral;

      expect(hashLiteral.pairs.size).toEqual(3);

      const expectedKeyValues: Record<string, string> = {
        one: '1',
        two: '2',
        three: '3',
      };

      for (const [key, value] of hashLiteral.pairs.entries()) {
        expect(expectedKeyValues[key.string()]).toEqual(value.string());
      }
    });

    it('validates hash with expressions', () => {
      const input = '{"one": 0 + 1, "two": 10 - 8, "three": 15 / 5};';
      const { statements } = parse(input);
      const hashLiteral = (statements[0] as ExpressionStatement)
        .expression as HashLiteral;

      expect(hashLiteral.pairs.size).toEqual(3);

      const expectedKeyValues: Record<string, string> = {
        one: '(0 + 1)',
        two: '(10 - 8)',
        three: '(15 / 5)',
      };

      for (const [key, value] of hashLiteral.pairs.entries()) {
        expect(expectedKeyValues[key.string()]).toEqual(value.string());
      }
    });
  });
});
