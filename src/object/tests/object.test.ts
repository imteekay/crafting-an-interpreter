import { describe, expect, it } from 'vitest';
import { BooleanLiteral, Integer, StringObject } from 'object';

describe('integer hash keys', () => {
  it('verifies integer hash keys', () => {
    const one1 = new Integer(1);
    const one2 = new Integer(1);
    const two1 = new Integer(2);
    const two2 = new Integer(2);

    expect(one1.hashKey()).toEqual(one2.hashKey());
    expect(two1.hashKey()).toEqual(two2.hashKey());
    expect(one1.hashKey()).not.toEqual(two1.hashKey());
  });
});

describe('integer hash keys', () => {
  it('verifies integer hash keys', () => {
    const true1 = new BooleanLiteral(true);
    const true2 = new BooleanLiteral(true);
    const false1 = new BooleanLiteral(false);
    const false2 = new BooleanLiteral(false);

    expect(true1.hashKey()).toEqual(true2.hashKey());
    expect(false1.hashKey()).toEqual(false2.hashKey());
    expect(true1.hashKey()).not.toEqual(false1.hashKey());
  });
});

describe('string hash keys', () => {
  it('verifies string hash keys', () => {
    const hello1 = new StringObject('Hello World');
    const hello2 = new StringObject('Hello World');
    const diff1 = new StringObject('My name is TK');
    const diff2 = new StringObject('My name is TK');

    expect(hello1.hashKey()).toEqual(hello2.hashKey());
    expect(diff1.hashKey()).toEqual(diff2.hashKey());
    expect(hello1.hashKey()).not.toEqual(diff1.hashKey());
  });
});
