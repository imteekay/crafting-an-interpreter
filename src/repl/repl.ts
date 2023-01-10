import readline from 'readline';
import { Lexer } from 'lexer';
import { Parser } from 'parser';

const ScannerClose = {
  exit: 'exit',
  quit: 'quit',
};

const exits = [ScannerClose.exit, ScannerClose.quit];

function printParserErrors(errors: string[]) {
  for (const error of errors) {
    console.error(error, '\n');
  }
}

export function startRepl() {
  const scanner = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function repl() {
    scanner.question('> ', (input) => {
      if (exits.includes(input)) return scanner.close();

      const lexer = new Lexer(input);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      if (parser.getErrors().length > 0) {
        printParserErrors(parser.getErrors());
        repl();
      }

      console.log(program.string());
      repl();
    });
  }

  console.log('Welcome');
  repl();
}
