# The REPL

This post is part of a series called [Building an Interpreter](https://leandrotk.github.io/series/building-an-interpreter/).

Now that we implemented the [first steps of our lexer](https://leandrotk.github.io/series/building-an-interpreter/building-an-interpreter-lexical-analysis-part-1.html), [more complex tokens](https://leandrotk.github.io/series/building-an-interpreter/building-an-interpreter-lexical-analysis-part-2.html), and [extended the token set with special characters](https://leandrotk.github.io/series/building-an-interpreter/building-an-interpreter-lexical-analysis-part-3.html), we want to take a step back and implement a REPL and print the tokens using our lexer.

A REPL stands for Read-Eval-Print-Loop, and it is an interactive environment that "reads" the input, "evaluates" and "prints" it. And then do it all over again (loop).

As we only have the token yet, we'll just print tokens related to the user input.

An example would be if we type this in the REPL:

```bash
> let a = 1;
```

We'll get the tokens related to this input

```bash
Token { type: 'LET', literal: 'let' }
Token { type: 'IDENT', literal: 'a' }
Token { type: '=', literal: '=' }
Token { type: 'INT', literal: '1' }
Token { type: ';', literal: ';' }
```

Nice, let's implement it!

## Building the REPL

To build the REPL, I listed some ideas behind it:

- We need to share a prompt to read the user input
- When the user types code and clicks enter, we should print the tokens related to the input
- After printing the token, we need to share a prompt again
- If the user types "exit" or "quit", we want to close the REPL

These are the building blocks.

To share the prompt and read the user input, we can use the `readline` from Node's API.

```jsx
import readline from 'readline';

const scanner = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

scanner.question('> ', (input) => {
  // do stuff
});
```

With this code, we can share the prompt with `>` and read the user input.

Now that we have the user input, we need to be aware of if the input is `"quit"` or `"exit"`. If it is, just close the REPL.

```jsx
const ScannerClose = {
  exit: 'exit',
  quit: 'quit',
};

const exits = [ScannerClose.exit, ScannerClose.quit];

if (exits.includes(input)) return scanner.close();
```

Built an object and an array to have all the possible ways to exit the REPL, and verify if the input is included in these possible exits. If it is, close the REPL. If it isn't, we are able to print the tokens.

To print the tokens, we need to instantiate our Lexer class with the input, and print token by token until it gets an `EOF` token type.

```jsx
import { Tokens } from '../token/token';
import { Lexer } from '../lexer/lexer';

const lexer = new Lexer(input);

for (
  let token = lexer.nextToken();
  token.type !== Tokens.EOF;
  token = lexer.nextToken()
) {
  console.log(token);
}
```

After printing the token, we want to share the prompt again for the user to type more code. We can do this with a recursive approach.

The idea is to wrap all this code into a function and call itself in the end like this:

```jsx
function repl() {
  scanner.question('> ', (input) => {
    if (exits.includes(input)) return scanner.close();

    const lexer = new Lexer(input);

    for (
      let token = lexer.nextToken();
      token.type !== Tokens.EOF;
      token = lexer.nextToken()
    ) {
      console.log(token);
    }

    repl();
  });
}
```

To finish the REPL, I wanted to wrap this code into a `startRepl` function with a "Welcome to monkey.ts" print before letting the user type code.

```jsx
import readline from 'readline';
import { Tokens } from '../token/token';
import { Lexer } from '../lexer/lexer';

const ScannerClose = {
  exit: 'exit',
  quit: 'quit',
};

const exits = [ScannerClose.exit, ScannerClose.quit];

export function startRepl() {
  const scanner = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function repl() {
    scanner.question('> ', (input) => {
      if (exits.includes(input)) return scanner.close();

      const lexer = new Lexer(input);

      for (
        let token = lexer.nextToken();
        token.type !== Tokens.EOF;
        token = lexer.nextToken()
      ) {
        console.log(token);
      }

      repl();
    });
  }

  console.log('Welcome to monkey.ts');
  repl();
}
```

And now we can call it anywhere in our code to start the REPL.

## **Final words & Resources**

If you didn't have the opportunity, take a look at the posts from the [Building an Interpreter series](https://leandrotk.github.io/series/building-an-interpreter/):

- [Building an Interpreter: Lexical Analysis - Part 1](https://leandrotk.github.io/series/building-an-interpreter/building-an-interpreter-lexical-analysis-part-1.html)
- [Building an Interpreter: Lexical Analysis - Part 2](https://leandrotk.github.io/series/building-an-interpreter/building-an-interpreter-lexical-analysis-part-2.html)
- [Building an Interpreter: Lexical Analysis - Part 3](https://leandrotk.github.io/series/building-an-interpreter/building-an-interpreter-lexical-analysis-part-3.html)

These are the resources I'm using to learn more about this field:

- [monkey-ts](https://github.com/leandrotk/monkey-ts): the open-source project of the compiler for the TypeScript version of the Monkey programming language.
- [monkey-ts - REPL PR](https://github.com/leandrotk/monkey-ts/pull/4)
- [Programming Language Theory](https://github.com/leandrotk/programming-language-theory): a bunch of resources about my studies on Programming Language Theory & Applied PLT.
- [Writing an Interpreter in Go](https://www.goodreads.com/book/show/32681092-writing-an-interpreter-in-go): the book I'm reading to learn and implement the Monkey compiler.
