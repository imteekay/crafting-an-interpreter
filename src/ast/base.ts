import { Identifier } from 'ast/Identifier';
import { ExpressionStatement } from 'ast/ExpressionStatement';
import { LetStatement } from 'ast/LetStatement';
import { ReturnStatement } from 'ast/ReturnStatement';
import { IntegerLiteral } from 'ast/IntegerLiteral';
import { PrefixExpression } from 'ast/PrefixExpression';

export enum StatementKind {
  Let = 'let',
  Return = 'return',
  Expression = 'expression',
}

export enum ExpressionKind {
  Identifier = 'identifier',
  IntegerLiteral = 'integerLiteral',
  Prefix = 'prefix',
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

export interface BaseExpression extends Node {
  kind: ExpressionKind;
}

export type Statement = LetStatement | ReturnStatement | ExpressionStatement;
export type Expression = Identifier | IntegerLiteral | PrefixExpression;
