import { describe, it, expect } from 'vitest';
import { Identifier, LetStatement, Program } from 'ast';
import { Tokens, Token } from 'token';

describe('AST', () => {
  it('returns the correct program string related to the source code', () => {
    // source code to be tested
    // let myVar = anotherVar;
    const program = new Program();
    const letStatemenet = new LetStatement(new Token(Tokens.LET, 'let'));
    const identifier = new Identifier(
      new Token(Tokens.IDENT, 'myVar'),
      'myVar'
    );

    const value = new Identifier(
      new Token(Tokens.IDENT, 'anotherVar'),
      'anotherVar'
    );

    letStatemenet.name = identifier;
    letStatemenet.value = value;
    program.statements.push(letStatemenet);

    expect(program.string()).toEqual('let myVar = anotherVar;');
  });
});
