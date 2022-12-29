import { ParserError } from 'parser';

export function checkParserErrors(errors: ParserError[]) {
  if (errors.length > 0) {
    console.log('errors', errors);
    throw new Error('The input data has parse errors');
  }
}
