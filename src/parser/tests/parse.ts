import { Lexer } from 'lexer';
import { Parser } from 'parser';
import { checkParserErrors } from './checkParserErrors';

export function parse(input: string) {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  const statements = program.statements;
  const programString = program.string();
  const errors = parser.getErrors();

  checkParserErrors(errors);

  return { statements, programString, errors };
}
