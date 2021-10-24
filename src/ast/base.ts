export enum StatementKind {
  Let = 'let',
  Return = 'return',
}

type StatementKindType = StatementKind.Let | StatementKind.Return;

interface Node {
  tokenLiteral: () => string;
}

export interface BaseStatement extends Node {
  kind: StatementKindType;
}

export interface Expression extends Node {}
