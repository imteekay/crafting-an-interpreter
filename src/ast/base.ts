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
import { CallExpression } from 'ast/CallExpression';
import { StringLiteral } from 'ast/StringLiteral';
import { ArrayLiteral } from 'ast/ArrayLiteral';

export enum ProgramKind {
  program = 'program',
}

export enum StatementKind {
  Let = 'let',
  Return = 'return',
  Expression = 'expression',
  Block = 'block',
}

export enum ExpressionKind {
  Identifier = 'identifier',
  IntegerLiteral = 'integerLiteral',
  StringLiteral = 'stringLiteral',
  Prefix = 'prefix',
  Infix = 'infix',
  Boolean = 'boolean',
  If = 'if',
  FunctionLiteral = 'functionLiteral',
  Call = 'call',
  ArrayLiteral = 'arrayLiteral',
}

type NodeKind = ProgramKind | StatementKind | ExpressionKind;

export interface Node {
  kind: NodeKind;
  tokenLiteral: () => string;
  string: () => string;
}

export interface BaseStatement extends Node {
  kind: StatementKind;
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
  | FunctionLiteral
  | CallExpression
  | StringLiteral
  | ArrayLiteral;
