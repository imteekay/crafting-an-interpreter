import { describe, it, expect } from 'vitest';
import { parse } from './parse';

describe('Parser', () => {
  describe('parseProgram', () => {
    it('parses operator precedence', () => {
      const tests = [
        {
          input: 'true',
          expected: 'true',
        },
        {
          input: 'false',
          expected: 'false',
        },
        {
          input: '3 > 5 == false',
          expected: '((3 > 5) == false)',
        },
        {
          input: '3 < 5 == true',
          expected: '((3 < 5) == true)',
        },
        { input: '-a * b', expected: '((-a) * b)' },
        { input: '!-a', expected: '(!(-a))' },
        { input: 'a + b + c', expected: '((a + b) + c)' },
        { input: 'a + b - c', expected: '((a + b) - c)' },
        { input: 'a * b * c', expected: '((a * b) * c)' },
        { input: 'a * b / c', expected: '((a * b) / c)' },
        { input: 'a + b / c', expected: '(a + (b / c))' },
        {
          input: 'a + b * c + d / e - f',
          expected: '(((a + (b * c)) + (d / e)) - f)',
        },
        { input: '3 + 4; -5 * 5', expected: '(3 + 4)((-5) * 5)' },
        { input: '5 > 4 == 3 < 4', expected: '((5 > 4) == (3 < 4))' },
        { input: '5 < 4 != 3 > 4', expected: '((5 < 4) != (3 > 4))' },
        {
          input: '3 + 4 * 5 == 3 * 1 + 4 * 5',
          expected: '((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))',
        },
        {
          input: '1 + (2 + 3) + 4',
          expected: '((1 + (2 + 3)) + 4)',
        },
        { input: '(5 + 5) * 2', expected: '((5 + 5) * 2)' },
        {
          input: '2 / (5 + 5)',
          expected: '(2 / (5 + 5))',
        },
        {
          input: '-(5 + 5)',
          expected: '(-(5 + 5))',
        },
        {
          input: '!(true == true)',
          expected: '(!(true == true))',
        },
      ];

      for (const { input, expected } of tests) {
        const { programString } = parse(input);
        expect(programString).equal(expected);
      }
    });
  });
});
