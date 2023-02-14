import { describe, expect, it } from 'vitest';
import { Lexer } from 'lexer';
import { Parser } from 'parser';
import { Evaluator } from 'evaluator';
import {
  ArrayObject,
  BooleanLiteral,
  Environment,
  ErrorObject,
  FunctionObject,
  Hash,
  Integer,
  Null,
  StringObject,
} from 'object';

function evaluate(input: string) {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const evaluator = new Evaluator();
  const env = new Environment();
  const program = parser.parseProgram();
  return evaluator.evaluate(program, env);
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

  it('evaluates string literals', () => {
    const tests = [{ input: '"Hello World"', expected: 'Hello World' }];

    for (const { input, expected } of tests) {
      const evaluatedProgram = evaluate(input);
      expect(evaluatedProgram).toEqual(new StringObject(expected));
    }
  });

  it('evaluates string concatenation', () => {
    const tests = [
      { input: '"Hello" + " " + "World"', expected: 'Hello World' },
    ];

    for (const { input, expected } of tests) {
      const evaluatedProgram = evaluate(input);
      expect(evaluatedProgram).toEqual(new StringObject(expected));
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

    it('evaluates boolean infix operators', () => {
      const tests = [
        { input: 'true == true', expected: true },
        { input: 'false == false', expected: true },
        { input: 'true == false', expected: false },
        { input: 'true != false', expected: true },
        { input: 'false != true', expected: true },
        { input: '(1 < 2) == true', expected: true },
        { input: '(1 < 2) == false', expected: false },
        { input: '(1 > 2) == true', expected: false },
        { input: '(1 > 2) == false', expected: true },
      ];

      for (const { input, expected } of tests) {
        const evaluatedProgram = evaluate(input);
        expect(evaluatedProgram).toEqual(new BooleanLiteral(expected));
      }
    });

    it('evaluates if else expressions', () => {
      const tests = [
        { input: 'if (true) { 10 }', expected: 10 },
        { input: 'if (false) { 10 }', expected: null },
        { input: 'if (1) { 10 }', expected: 10 },
        { input: 'if (1 < 2) { 10 }', expected: 10 },
        { input: 'if (1 > 2) { 10 }', expected: null },
        { input: 'if (1 > 2) { 10 } else { 20 }', expected: 20 },
        { input: 'if (1 < 2) { 10 } else { 20 }', expected: 10 },
      ];

      for (const { input, expected } of tests) {
        const evaluatedProgram = evaluate(input);

        if (typeof expected === 'number') {
          expect(evaluatedProgram).toEqual(new Integer(expected));
        } else {
          expect(evaluatedProgram).toEqual(new Null());
        }
      }
    });

    it('evaluates if else expressions', () => {
      const tests = [
        { input: 'return 10;', expected: 10 },
        { input: 'return 10; 9;', expected: 10 },
        { input: 'return 2 * 5; 9;', expected: 10 },
        { input: '9; return 2 * 5; 9;', expected: 10 },
        {
          input: `if (10 > 1) {
                    if (10 > 1) {
                      return 10;
                    }
                    return 1; }`,
          expected: 10,
        },
      ];

      for (const { input, expected } of tests) {
        const evaluatedProgram = evaluate(input);
        expect(evaluatedProgram).toEqual(new Integer(expected));
      }
    });

    it('handles errors', () => {
      const tests = [
        {
          input: '5 + true;',
          expected: 'type mismatch: INTEGER + BOOLEAN',
        },
        {
          input: '5 + true; 5;',
          expected: 'type mismatch: INTEGER + BOOLEAN',
        },
        {
          input: '-true',
          expected: 'unknown operator: -BOOLEAN',
        },
        {
          input: 'true + false;',
          expected: 'unknown operator: BOOLEAN + BOOLEAN',
        },
        {
          input: 'true + false;',
          expected: 'unknown operator: BOOLEAN + BOOLEAN',
        },
        {
          input: 'if (10 > 1) { true + false; }',
          expected: 'unknown operator: BOOLEAN + BOOLEAN',
        },
        {
          input: `if (10 > 1) {
                    if (10 > 1) {
                      return true + false;
                    }
                    return 1; }`,
          expected: 'unknown operator: BOOLEAN + BOOLEAN',
        },
        {
          input: '5; true + false; 5',
          expected: 'unknown operator: BOOLEAN + BOOLEAN',
        },
        {
          input: 'foo',
          expected: 'identifier not found: foo',
        },
        {
          input: '"Hello" - "World"',
          expected: 'unknown operator: STRING - STRING',
        },
        {
          input: '{"name": "Monkey"}[fn(x) { x }];',
          expected: 'unusable as hash key: FUNCTION',
        },
      ];

      for (const { input, expected } of tests) {
        const evaluatedProgram = evaluate(input);
        expect(evaluatedProgram).toEqual(new ErrorObject(expected));
      }
    });
  });

  it('evaluates let statements', () => {
    const tests = [
      { input: 'let a = 5; a;', expected: 5 },
      { input: 'let a = 5 * 5; a;', expected: 25 },
      { input: 'let a = 5; let b = a; b;', expected: 5 },
      {
        input: 'let a = 5; let b = a; let c = a + b + 5; c;',
        expected: 15,
      },
    ];

    for (const { input, expected } of tests) {
      const evaluatedProgram = evaluate(input);
      expect(evaluatedProgram).toEqual(new Integer(expected));
    }
  });

  describe('evaluates functions', () => {
    it('evaluates to function object', () => {
      const input = 'fn(n) { n + 1 };';
      const evaluatedProgram = evaluate(input);

      expect((evaluatedProgram as FunctionObject).parameters.length).toEqual(1);
      expect(
        (evaluatedProgram as FunctionObject).parameters[0].string()
      ).toEqual('n');

      expect((evaluatedProgram as FunctionObject).body.string()).toEqual(
        '(n + 1)'
      );
    });

    it('evaluates function application', () => {
      const tests = [
        { input: 'let identity = fn(x) { x; }; identity(5);', expected: 5 },
        {
          input: 'let identity = fn(x) { return x; }; identity(5);',
          expected: 5,
        },
        { input: 'let double = fn(x) { x * 2; }; double(5);', expected: 10 },
        { input: 'let add = fn(x, y) { x + y; }; add(5, 5);', expected: 10 },
        {
          input: 'let add = fn(x, y) { x + y; }; add(5 + 5, add(5, 5));',
          expected: 20,
        },
        { input: 'fn(x) { x; }(5)', expected: 5 },
        { input: 'fn() { 5; }()', expected: 5 },
      ];

      for (const { input, expected } of tests) {
        const evaluatedProgram = evaluate(input);
        expect(evaluatedProgram).toEqual(new Integer(expected));
      }
    });

    it('evaluates function application to undefined', () => {
      const evaluatedProgram = evaluate('fn() {}()');
      expect(evaluatedProgram).toEqual(undefined);
    });

    it('evaluates function application with closures', () => {
      const evaluatedProgram = evaluate(`
        let newAdder = fn(x) {
          fn(y) { x + y };
        };
        let addTwo = newAdder(2);
        addTwo(2);
      `);

      expect(evaluatedProgram).toEqual(new Integer(4));
    });
  });

  describe('evaluates builtin functions', () => {
    it('evaluates function application of builtin functions', () => {
      const tests = [
        { input: `len("")`, expected: 0 },
        { input: `len("four")`, expected: 4 },
        { input: `len("hello world")`, expected: 11 },
      ];

      for (const { input, expected } of tests) {
        const evaluatedProgram = evaluate(input);
        expect(evaluatedProgram).toEqual(new Integer(expected));
      }
    });

    it('handles unsupported argunents', () => {
      const tests = [
        {
          input: `len(1)`,
          expected: 'argument to "len" not supported, got INTEGER',
        },
        {
          input: `len()`,
          expected: 'wrong number of arguments. got=0, want=1',
        },
        {
          input: `len("one", "two")`,
          expected: 'wrong number of arguments. got=2, want=1',
        },
      ];

      for (const { input, expected } of tests) {
        const evaluatedProgram = evaluate(input);
        expect(evaluatedProgram).toEqual(new ErrorObject(expected));
      }
    });
  });

  describe('evaluates arrays', () => {
    it('evaluates array literals', () => {
      const tests = [
        { input: '[1, 2 * 2, 3 + 3]', expected: [1, 4, 6] },
        { input: '[1 + 1, 2 * 2, 3 - 3, 4 / 2]', expected: [2, 4, 0, 2] },
      ];

      for (const { input, expected } of tests) {
        const evaluatedProgram = evaluate(input);
        const elements = expected.map((int) => new Integer(int));
        expect(evaluatedProgram).toEqual(new ArrayObject(elements));
      }
    });

    it('evaluates index expressions', () => {
      const tests = [
        {
          input: '[1, 2, 3][0]',
          expected: 1,
        },
        {
          input: '[1, 2, 3][1]',
          expected: 2,
        },
        {
          input: '[1, 2, 3][2]',
          expected: 3,
        },
        {
          input: 'let i = 0; [1][i];',
          expected: 1,
        },
        {
          input: '[1, 2, 3][1 + 1];',
          expected: 3,
        },
        {
          input: 'let myArray = [1, 2, 3]; myArray[2];',
          expected: 3,
        },
        {
          input:
            'let myArray = [1, 2, 3]; myArray[0] + myArray[1] + myArray[2];',
          expected: 6,
        },
        {
          input: 'let myArray = [1, 2, 3]; let i = myArray[0]; myArray[i]',
          expected: 2,
        },
        {
          input: '[1, 2, 3][3]',
          expected: null,
        },
        {
          input: '[1, 2, 3][-1]',
          expected: null,
        },
      ];

      for (const { input, expected } of tests) {
        const evaluatedProgram = evaluate(input);

        if (evaluatedProgram) {
          expect(evaluatedProgram).toEqual(new Integer(expected as number));
        } else {
          expect(evaluatedProgram).toEqual(new Null());
        }
      }
    });
  });

  describe('evaluates hash literals', () => {
    it('evaluates a hashmap', () => {
      const input = `let two = "two";
      {
        "one": 10 - 9,
        "two": 1 + 1,
        "thr" + "ee": 6 / 2,
        4: 4,
        true: 5,
        false: 6,
      }`;

      const evaluatedProgram = evaluate(input);
      expect(evaluatedProgram instanceof Hash).toEqual(true);

      const expectedHashMap = new Map();
      expectedHashMap.set(new StringObject('one').hashKey(), 1);
      expectedHashMap.set(new StringObject('two').hashKey(), 2);
      expectedHashMap.set(new StringObject('three').hashKey(), 3);
      expectedHashMap.set(new Integer(4).hashKey(), 4);
      expectedHashMap.set(new BooleanLiteral(true).hashKey(), 5);
      expectedHashMap.set(new BooleanLiteral(false).hashKey(), 6);

      if (evaluatedProgram instanceof Hash) {
        for (const [key, hashPair] of evaluatedProgram.pairs.entries()) {
          const expectedHashPair = expectedHashMap.get(key);
          expect(expectedHashPair.toString()).toEqual(hashPair.value.inspect());
        }
      }
    });

    it('evaluates hash index expressions', () => {
      const tests = [
        {
          input: `{"foo": 5}["foo"]`,
          expected: 5,
        },

        {
          input: `{"foo": 5}["bar"]`,
          expected: null,
        },
        {
          input: `let key = "foo"; {"foo": 5}[key]`,
          expected: 5,
        },
        {
          input: `{}["foo"]`,
          expected: null,
        },
        {
          input: `{5: 5}[5]`,
          expected: 5,
        },
        {
          input: `{true: 5}[true]`,
          expected: 5,
        },
        {
          input: `{false: 5}[false]`,
          expected: 5,
        },
      ];

      for (const { input, expected } of tests) {
        const evaluated = evaluate(input);

        if (expected) {
          expect(evaluated).toEqual(new Integer(expected));
        } else {
          expect(evaluated).toEqual(new Null());
        }
      }
    });
  });
});
