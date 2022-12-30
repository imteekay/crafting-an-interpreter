# Building an Interpreter: Lexical Analysis - Part 3

This post is part of a series called [Building an Interpreter](https://leandrotk.github.io/series/building-an-interpreter/). After implementing a [basic lexer](https://leandrotk.github.io/series/building-an-interpreter/building-an-interpreter-lexical-analysis-part-1.html) and [building more tokens](https://leandrotk.github.io/series/building-an-interpreter/building-an-interpreter-lexical-analysis-part-2.html), we'll extend the token set to work with special characters, new keywords, and the "equal" and "not equal" symbols.

Let's add support for `==`, `!`, `!=`, `-`, `/`, `*`, `<`, `>`, and the keywords `true`, `false`, `if`, `else`, and `return`.

## Single characters as tokens

First, the single characters, as they are the easiest ones to handle in the lexer.

We add this to the test:

```jsx
const input = `
  !-/*5;
  5 < 10 > 5;
`;
```

Add new tokens:

```jsx
export enum Tokens {
  // ...
  MINUS = '-',
  BANG = '!',
  ASTERISK = '*',
  SLASH = '/',
  LESS_THAN = '<',
  GREATER_THAN = '>',
  // ...
}
```

And finally, add the expectations in the test:

```jsx
const tokens: Token[] = [
  // ...
  { type: Tokens.BANG, literal: '!' },
  { type: Tokens.MINUS, literal: '-' },
  { type: Tokens.SLASH, literal: '/' },
  { type: Tokens.ASTERISK, literal: '*' },
  { type: Tokens.INT, literal: '5' },
  { type: Tokens.SEMICOLON, literal: ';' },
  { type: Tokens.INT, literal: '5' },
  { type: Tokens.LESS_THAN, literal: '<' },
  { type: Tokens.INT, literal: '10' },
  { type: Tokens.GREATER_THAN, literal: '>' },
  { type: Tokens.INT, literal: '5' },
  { type: Tokens.SEMICOLON, literal: ';' },
  // ...
];
```

Now we just need to implement the lexer part to generate these token based on the source code:

```jsx
private getToken(): Token {
  this.skipWhitespace();

  switch (this.char) {
    // ...
    case '!':
      return this.buildToken(Tokens.BANG, '!');
    case '-':
      return this.buildToken(Tokens.MINUS, '-');
    case '/':
      return this.buildToken(Tokens.SLASH, '/');
    case '*':
      return this.buildToken(Tokens.ASTERISK, '*');
    case '<':
      return this.buildToken(Tokens.LESS_THAN, '<');
    case '>':
      return this.buildToken(Tokens.GREATER_THAN, '>');
    // ...
  }
}
```

If we run the tests again, we make all green and passing.

## Building new keywords as tokens

The process of building the tokens for the new keyword is pretty similar to the single characters.

Add the input to the test:

```jsx
const input = `
  if (5 < 10) {
    return true;
  } else {
    return false;
  }
`;
```

Now add the expected tokens in the test:

```jsx
const tokens: Token[] = [
  // ...
  { type: Tokens.IF, literal: 'if' },
  { type: Tokens.LPAREN, literal: '(' },
  { type: Tokens.INT, literal: '5' },
  { type: Tokens.LESS_THAN, literal: '<' },
  { type: Tokens.INT, literal: '10' },
  { type: Tokens.RPAREN, literal: ')' },
  { type: Tokens.LBRACE, literal: '{' },
  { type: Tokens.RETURN, literal: 'return' },
  { type: Tokens.TRUE, literal: 'true' },
  { type: Tokens.SEMICOLON, literal: ';' },
  { type: Tokens.RBRACE, literal: '}' },
  { type: Tokens.ELSE, literal: 'else' },
  { type: Tokens.LBRACE, literal: '{' },
  { type: Tokens.RETURN, literal: 'return' },
  { type: Tokens.FALSE, literal: 'false' },
  { type: Tokens.SEMICOLON, literal: ';' },
  { type: Tokens.RBRACE, literal: '}' },
  // ...
];
```

And the new tokens:

```jsx
export enum Tokens {
  // ...
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  IF = 'IF',
  ELSE = 'ELSE',
  RETURN = 'RETURN',
}
```

But the difference is that we also need to update the `Keywords` object to having the new tokens and be used in the `lookupIdent` function:

```jsx
const Keywords: KeywordsType = {
  // ...
  true: Tokens.TRUE,
  false: Tokens.FALSE,
  if: Tokens.IF,
  else: Tokens.ELSE,
  return: Tokens.RETURN,
};
```

Running the tests again, we get all green and passing.

## The Equal and Not Equal operators

What we want to do now is to build the Equal and Not Equal tokens. We start adding the source code we need to handle:

```jsx
const input = `
  10 == 10;
  10 != 9;
`;
```

The expected tokens are:

```jsx
const tokens: Token[] = [
  // ...
  { type: Tokens.INT, literal: '10' },
  { type: Tokens.EQUAL, literal: '==' },
  { type: Tokens.INT, literal: '10' },
  { type: Tokens.SEMICOLON, literal: ';' },
  { type: Tokens.INT, literal: '10' },
  { type: Tokens.NOT_EQUAL, literal: '!=' },
  { type: Tokens.INT, literal: '9' },
  { type: Tokens.SEMICOLON, literal: ';' },
  // ...
];
```

Then we need to add the new tokens:

```jsx
export enum Tokens {
  // ...
  EQUAL = '==',
  NOT_EQUAL = '!=',
  // ...
}
```

Now we are ready to implement the lexer part for these new tokens.

First, the `==`. Every time we get the character `=`, we need to be aware of if the next character is a `=` char. If it is, we return the token type `Equal`. If it's not, we just return the token type `Assign`.

To search for the next character, let's build a new method to handle that for us: `peekChar`.

```jsx
private peekChar() {
  if (this.readPosition >= this.input.length) {
    return '';
  } else {
    return this.input[this.readPosition];
  }
}
```

It's a simple method: if we get to the end of the source code, we return an empty string. Otherwise, it returns the next character.

Now it becomes very easy to implement the lexer algorithm for the `==` token:

```jsx
switch (this.char) {
  // ...
  case '=':
    if (this.peekChar() === '=') {
      this.readChar();
      return this.buildToken(Tokens.EQUAL, '==');
    } else {
      return this.buildToken(Tokens.ASSIGN, '=');
    }
  // ...
}
```

Inside the case of a `=` character, we see if the next character is also `=` with the help of our new method `peekChar`.

If it is, read the next character to update the `position` and the `readPosition`'s states and return the new token type `EQUAL`.

If it is not, just return the already implemented token type `ASSIGN`.

We actually do this same implementation for the `NOT_EQUAL` token type:

```jsx
switch (this.char) {
  // ...
  case '!':
    if (this.peekChar() === '=') {
      this.readChar();
      return this.buildToken(Tokens.NOT_EQUAL, '!=');
    } else {
      return this.buildToken(Tokens.BANG, '!');
    }
  // ...
}
```

But now we are looking at the `!` character.

## **Final words & Resources**

If you didn't have the opportunity, take a look at the [first](https://leandrotk.github.io/series/building-an-interpreter/building-an-interpreter-lexical-analysis-part-1.html) and the [second part of the Lexical Analysis](https://leandrotk.github.io/series/building-an-interpreter/building-an-interpreter-lexical-analysis-part-2.html). This is the third post about my journey learning compilers and studying programming language theory. And part of the [Building an Interpreter series](https://leandrotk.github.io/series/building-an-interpreter/).

These are the resources I'm using to learn more about this field:

- [Crafting an Interpreter](https://github.com/imteekay/crafting-an-interpreter): the open source project of the compiler for the TypeScript version of the Monkey programming language.
- [Programming Language Theory](https://github.com/leandrotk/programming-language-theory): a bunch of resources about my studies on Programming Language Theory & Applied PLT.
- [Writing an Interpreter in Go](https://www.goodreads.com/book/show/32681092-writing-an-interpreter-in-go): the book I'm reading to learn and implement the Monkey compiler.
