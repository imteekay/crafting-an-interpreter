import { Identifier } from 'ast/Identifier';
import { ExpressionStatement } from 'ast/ExpressionStatement';
import { LetStatement } from 'ast/LetStatement';
import { ReturnStatement } from 'ast/ReturnStatement';
import { IntegerLiteral } from 'ast/IntegerLiteral';
import { PrefixExpression } from 'ast/PrefixExpression';
import { InfixExpression } from 'ast/InfixExpression';
import { BooleanExpression } from 'ast/Boolean';
import { IfExpression } from 'ast/IfExpression';
import { FunctionLiteral } from 'ast/FunctionLiteral';

export enum StatementKind {
  Let = 'let',
  Return = 'return',
  Expression = 'expression',
  Block = 'block',
}

export enum ExpressionKind {
  Identifier = 'identifier',
  IntegerLiteral = 'integerLiteral',
  Prefix = 'prefix',
  Infix = 'infix',
  Boolean = 'boolean',
  If = 'if',
  FunctionLiteral = 'functionLiteral',
}

type StatementKindType =
  | StatementKind.Let
  | StatementKind.Return
  | StatementKind.Expression
  | StatementKind.Block;

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
export type Expression =
  | Identifier
  | IntegerLiteral
  | PrefixExpression
  | InfixExpression
  | BooleanExpression
  | IfExpression
  | FunctionLiteral;
