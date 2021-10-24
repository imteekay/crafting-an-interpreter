export enum StatementKind {
  Let = 'let',
  Return = 'return',
  Expression = 'expression',
}

type StatementKindType =
  | StatementKind.Let
  | StatementKind.Return
  | StatementKind.Expression;

interface Node {
  tokenLiteral: () => string;
  string: () => string;
}

export interface BaseStatement extends Node {
  kind: StatementKindType;
}

export interface Expression extends Node {}
