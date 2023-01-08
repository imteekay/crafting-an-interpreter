import { ParserError } from 'parser';

export function checkParserErrors(errors: ParserError[]) {
  if (errors.length > 0) {
    throw new Error(`The input data has parse errors: ${errors}`);
  }
}
