import readline from 'readline';
import { Lexer } from 'lexer';
import { Parser } from 'parser';
import { Evaluator } from 'evaluator';
import { Environment } from 'object';

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

  const env = new Environment();

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

      const evaluator = new Evaluator();
      const evaluated = evaluator.evaluate(program, env);

      if (evaluated) {
        console.log(evaluated.inspect());
      }

      repl();
    });
  }

  console.log('Welcome');
  repl();
}
