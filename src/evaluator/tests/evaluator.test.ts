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
});
