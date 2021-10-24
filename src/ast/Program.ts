import { LetStatement } from 'ast/LetStatement';
import { ReturnStatement } from 'ast/ReturnStatement';

type Statement = LetStatement | ReturnStatement;

export class Program {
  statements: Statement[] = [];
}
