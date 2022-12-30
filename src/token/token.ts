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
  LBRACKET = '[',
  RBRACKET = ']',

  // Keywords
  FUNCTION = 'FUNCTION',
  LET = 'LET',
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  IF = 'IF',
  ELSE = 'ELSE',
  RETURN = 'RETURN',
  EQUAL = '==',
  NOT_EQUAL = '!=',
}

interface KeywordsType {
  [key: string]: string;
}

const Keywords: KeywordsType = {
  fn: Tokens.FUNCTION,
  let: Tokens.LET,
  true: Tokens.TRUE,
  false: Tokens.FALSE,
  if: Tokens.IF,
  else: Tokens.ELSE,
  return: Tokens.RETURN,
};

export function lookupIdent(ident: string) {
  return ident in Keywords ? Keywords[ident] : Tokens.IDENT;
}
