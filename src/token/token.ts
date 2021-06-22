export type TokenType = string;

export class Token {
  type: TokenType;
  literal: string;

  constructor(type: TokenType, literal: string) {
    this.type = type;
    this.literal = literal;
  }
}

export enum Tokens {
  ILLEGAL = 'ILLEGAL',
  EOF = 'EOF',

  // Identifiers + literals
  IDENT = 'IDENT', // add, foobar, x, y, ...
  INT = 'INT', // 1343456

  // Operators
  ASSIGN = '=',
  PLUS = '+',
  MINUS = '-',
  BANG = '!',
  ASTERISK = '*',
  SLASH = '/',
  LESS_THAN = '<',
  GREATER_THAN = '>',

  // Delimiters
  COMMA = ',',
  SEMICOLON = ';',
  LPAREN = '(',
  RPAREN = ')',
  LBRACE = '{',
  RBRACE = '}',

  // Keywords
  FUNCTION = 'FUNCTION',
  LET = 'LET',
}

interface KeywordsType {
  [key: string]: string;
}

const Keywords: KeywordsType = {
  fn: Tokens.FUNCTION,
  let: Tokens.LET,
};

export function lookupIdent(ident: string) {
  return ident in Keywords ? Keywords[ident] : Tokens.IDENT;
}
