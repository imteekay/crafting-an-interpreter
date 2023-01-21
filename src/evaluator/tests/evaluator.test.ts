import { describe, expect, it } from 'vitest';
import { Lexer } from 'lexer';
import { Parser } from 'parser';
import { Evaluator } from 'evaluator';
import { BooleanLiteral, Integer } from 'object';

function evaluate(input: string) {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const evaluator = new Evaluator();
  const program = parser.parseProgram();
  return evaluator.evaluate(program);
}

describe('Evaluator', () => {
  it('evaluates integer literals', () => {
    const tests = [
      { input: '5', expected: 5 },
      { input: '10', expected: 10 },
    ];

    for (const { input, expected } of tests) {
      const evaluatedProgram = evaluate(input);
      expect(evaluatedProgram).toEqual(new Integer(expected));
    }
  });

  it('evaluates boolean literals', () => {
    const tests = [
      { input: 'true', expected: true },
      { input: 'false', expected: false },
    ];

    for (const { input, expected } of tests) {
      const evaluatedProgram = evaluate(input);
      expect(evaluatedProgram).toEqual(new BooleanLiteral(expected));
    }
  });

  describe('evaluates operator expressions', () => {
    it('evaluates bang operators', () => {
      const tests = [
        { input: '!true', expected: false },
        { input: '!false', expected: true },
        { input: '!!true', expected: true },
        { input: '!!false', expected: false },
        { input: '!10', expected: false },
        { input: '!!10', expected: true },
      ];

      for (const { input, expected } of tests) {
        const evaluatedProgram = evaluate(input);
        expect(evaluatedProgram).toEqual(new BooleanLiteral(expected));
      }
    });

    it('evaluates bang operators', () => {
      const tests = [
        { input: '-10', expected: -10 },
        { input: '-1', expected: -1 },
      ];

      for (const { input, expected } of tests) {
        const evaluatedProgram = evaluate(input);
        expect(evaluatedProgram).toEqual(new Integer(expected));
      }
    });

    it('evaluates integer infix operators', () => {
      const tests = [
        { input: '1 + 1', expected: 2 },
        { input: '5 + 5 + 5 + 5 - 10', expected: 10 },
        { input: '2 * 2 * 2 * 2 * 2', expected: 32 },
        { input: '-50 + 100 + -50', expected: 0 },
        { input: '5 * 2 + 10', expected: 20 },
        { input: '5 + 2 * 10', expected: 25 },
        { input: '20 + 2 * -10', expected: 0 },
        { input: '50 / 2 * 2 + 10', expected: 60 },
        { input: '2 * (5 + 10)', expected: 30 },
        { input: '3 * 3 * 3 + 10', expected: 37 },
        { input: '3 * (3 * 3) + 10', expected: 37 },
        { input: '(5 + 10 * 2 + 15 / 3) * 2 + -10', expected: 50 },
      ];

      for (const { input, expected } of tests) {
        const evaluatedProgram = evaluate(input);
        expect(evaluatedProgram).toEqual(new Integer(expected));
      }
    });

    it('evaluates integer infix operators', () => {
      const tests = [
        { input: 'true', expected: true },
        { input: 'false', expected: false },
        { input: '1 < 2', expected: true },
        { input: '1 > 2', expected: false },
        { input: '1 < 1', expected: false },
        { input: '1 > 1', expected: false },
        { input: '1 == 1', expected: true },
        { input: '1 != 1', expected: false },
        { input: '1 == 2', expected: false },
        { input: '1 != 2', expected: true },
      ];

      for (const { input, expected } of tests) {
        const evaluatedProgram = evaluate(input);
        expect(evaluatedProgram).toEqual(new BooleanLiteral(expected));
      }
    });
  });
});
