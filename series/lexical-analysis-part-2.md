# Lexical Analysis - Part 2

This post is part of a series called [Building an Interpreter](https://leandrotk.github.io/series/building-an-interpreter/index.html). The [first part of the Lexical Analysis](https://leandrotk.github.io/series/building-an-interpreter/building-an-interpreter-lexical-analysis-part-1.html) post illustrated a basic lexer creating tokens from a simple source code.

In this post we'll extend the tests and improve the `Lexer` to work with new tokens. The source code was this basic one-liner `"=+(){},;"`. But now we want a more complex source code:

```tsx
const input = `
  let five = 5;
  let ten = 10;

	let add = fn(x, y) {
    x + y;
  };

	let result = add(five, ten);
`;
```

With a new source code, we need more tokens to represent it. These are the tokens that we need to make the source code matches:

```tsx
const tokens: Token[] = [
  { type: Tokens.LET, literal: 'let' },
  { type: Tokens.IDENT, literal: 'five' },
  { type: Tokens.ASSIGN, literal: '=' },
  { type: Tokens.INT, literal: '5' },
  { type: Tokens.SEMICOLON, literal: ';' },
  { type: Tokens.LET, literal: 'let' },
  { type: Tokens.IDENT, literal: 'ten' },
  { type: Tokens.ASSIGN, literal: '=' },
  { type: Tokens.INT, literal: '10' },
  { type: Tokens.SEMICOLON, literal: ';' },
  { type: Tokens.LET, literal: 'let' },
  { type: Tokens.IDENT, literal: 'add' },
  { type: Tokens.ASSIGN, literal: '=' },
  { type: Tokens.FUNCTION, literal: 'fn' },
  { type: Tokens.LPAREN, literal: '(' },
  { type: Tokens.IDENT, literal: 'x' },
  { type: Tokens.COMMA, literal: ',' },
  { type: Tokens.IDENT, literal: 'y' },
  { type: Tokens.RPAREN, literal: ')' },
  { type: Tokens.LBRACE, literal: '{' },
  { type: Tokens.IDENT, literal: 'x' },
  { type: Tokens.PLUS, literal: '+' },
  { type: Tokens.IDENT, literal: 'y' },
  { type: Tokens.SEMICOLON, literal: ';' },
  { type: Tokens.RBRACE, literal: '}' },
  { type: Tokens.SEMICOLON, literal: ';' },
  { type: Tokens.LET, literal: 'let' },
  { type: Tokens.IDENT, literal: 'result' },
  { type: Tokens.ASSIGN, literal: '=' },
  { type: Tokens.IDENT, literal: 'add' },
  { type: Tokens.LPAREN, literal: '(' },
  { type: Tokens.IDENT, literal: 'five' },
  { type: Tokens.COMMA, literal: ',' },
  { type: Tokens.IDENT, literal: 'ten' },
  { type: Tokens.RPAREN, literal: ')' },
  { type: Tokens.SEMICOLON, literal: ';' },
  { type: Tokens.EOF, literal: '' },
];
```

The test keeps the same, only the data changes.

```tsx
const lexer = new Lexer(input);

tokens.forEach(({ type, literal }) => {
  const inputToken = lexer.nextToken();

  expect(inputToken.type).toEqual(type);
  expect(inputToken.literal).toEqual(literal);
});
```

Running this test, we start getting new errors related to the new tokens that don't match with the next generated token by our lexer.

Also, the new tokens are a bit different now. They are not a "single character" token, they are a bit more complex and should be handled in a different way.

The simplest example is the integer tokens. In the test's source code, we have integer `5` (single character), but we also have integer `10` (multiple characters).

As they can be multiple characters tokens, we'll add the default case in our `Lexer`'s switch case. Starting with integers, we need to make sure that the current character is a digit, read the number to get the whole token literal, in this case, the whole integer. As we know that it's an integer and we have the integer value, we just create a new token and return it. It looks like this:

```tsx
if (this.isDigit(this.char)) {
  const tokenLiteral = this.readNumber();
  return new Token(Tokens.INT, tokenLiteral);
}
```

Two parts are missing:

- `isDigit`: verifies that a given character is a digit.
- `readNumber`: read the whole number, independently if it's a single digit number or bigger.

Lets start with the easier one: `isDigit`. To simplify the idea of a digit, we'll just do a verification if the character is between `'0'` and `'9'`.

```tsx
private isDigit(char: string) {
  return '0' <= char && char <= '9';
}
```

Now about the `readNumber`. The algorithm would be:

- get the initial position of the number
- read the next character while it's still a digit
- now we have the initial position and the last position
- return the slice of the source code: the whole number

```tsx
private readNumber() {
  const initialIntPosition = this.position;

  while (this.isDigit(this.char)) {
    this.readChar();
  }

  return this.input.substring(initialIntPosition, this.position);
}
```

Reading the next character, we update the current state of the main variables (`position`, `char`, and `readPosition`).

We use the `substring` string's method to the source code's slice that represents the whole number.

This is a very simplistic way to handle numbers as we are just handling integers but not float numbers.

Running the tests again, we don't have the integer token problem anymore. But we still have work to do and more tokens to build.

Now we start to generate the other tokens: identifiers and keywords. The main difference between identifiers and keywords is that keywords are part of the language "grammar", the language's syntax. In the test's source code, we saw keywords like `fn` and `let` for example. Identifiers, on the other hand, are not part of the language's syntax, they are user-defined identifiers.

To first identify that the next token is an identifier or a keyword, we need to verify if the current character is a letter, read the next characters until it is not a letter anymore, and decides if the token is an identifier or a keyword looking at its value.

We add this code to the default part of the switch case as we did for the number tokens.

```tsx
if (this.isLetter(this.char)) {
  const tokenLiteral = this.readIdentifier();
  const tokenType = lookupIdent(tokenLiteral);
  return new Token(tokenType, tokenLiteral);
}
```

Let's break it down:

- `isLetter`: just a method to verify if the current character is a letter.
- `readIdentifier`: reads the characters until it's not part of the identifier/keyword anymore and return it.
- `lookupIdent`: returns the token type (`FUNCTION`, `LET`, or `IDENT`) based on the token literal we got from the `readIdentifier`.
- And finally it returns the new generated token.

The `isLetter` is pretty basic:

```tsx
private isLetter(char: string) {
  return (
    ('a' <= char && char <= 'z') ||
    ('A' <= char && char <= 'Z') ||
    char === '_'
  );
}
```

The Monkey programming language accepts `_` as part of the identifiers. It's very similar to Ruby and Python. And the main part of this verification is the idea that the `char` should be between `'a'` and `'z'` (lower case characters) or between `'A'` and `'Z'` (upper case characters).

The `readIdentifier` is pretty similar to the `readNumber` that we implemented earlier.

```tsx
private readIdentifier() {
  const initialCharPosition = this.position;

  while (this.isLetter(this.char)) {
    this.readChar();
  }

  return this.input.substring(initialCharPosition, this.position);
}
```

- We get the initial char position
- Read the next char while it is still a letter
- With the initial position and the last position of the identifier, we can get the slice of the source code and return it.

And finally the `lookupIdent` that we decided to implement it in the `Token` module because it belongs to that domain.

```tsx
interface KeywordsType {
  [key: string]: string;
}

const Keywords: KeywordsType = {
  fn: Tokens.FUNCTION,
  let: Tokens.LET,
};

export function lookupIdent(ident: string) {
  return ident in Keywords ? Keywords[ident] : Tokens.IDENT;
}
```

It receives the identifier string, verify if it is in the `Keywords` object, if it's, get the token type, otherwise, just return the `IDENT` as the token type.

Running the tests again, we see more tokens passing the test. But some still fail. It turns out that we are not handling the white spaces between characters. Let's handle that issue!

```tsx
private skipWhitespace() {
  while (
    this.char == ' ' ||
    this.char == '\t' ||
    this.char == '\n' ||
    this.char == '\r'
  ) {
    this.readChar();
  }
}
```

To skip the white spaces, we need to keep reading the next until it's not a white space anymore.

- `' '`: white space
- `'\t'`: add tab
- `'\n'`: new line
- `'\r'`: return

Calling `readChar` we update the state of the `position` and `char` variables. With this new implementation, we just need to add the `skipWhitespace` to the `getToken` method before generating any token:

```tsx
private getToken(): Token {
  this.skipWhitespace();
```

The only adjustment we need to do now is to update the `nextToken`. It was like this before:

```tsx
nextToken(): Token {
  const token = this.getToken();
  this.readChar();
  return token;
}
```

But as we read the next char for identifiers, keywords, and integers, we need to remove this line:

```tsx
nextToken(): Token {
  const token = this.getToken();
  return token;
}
```

...and add only for the other tokens.

```tsx
case '=':
  this.readChar();
  return new Token(Tokens.ASSIGN, '=');
```

But as we need to make this same instruction for almost all tokens, I created a private method to handle that.

```tsx
private buildToken(type: TokenType, literal: string) {
  this.readChar();
  return new Token(type, literal);
}
```

The use is very straightforward.

```tsx
switch (this.char) {
  case '=':
    return this.buildToken(Tokens.ASSIGN, '=');
  case ';':
    return this.buildToken(Tokens.SEMICOLON, ';');
  case '(':
    return this.buildToken(Tokens.LPAREN, '(');
  case ')':
    return this.buildToken(Tokens.RPAREN, ')');
  case ',':
    return this.buildToken(Tokens.COMMA, ',');
  case '+':
    return this.buildToken(Tokens.PLUS, '+');
  case '{':
    return this.buildToken(Tokens.LBRACE, '{');
  case '}':
    return this.buildToken(Tokens.RBRACE, '}');
  case '':
    return this.buildToken(Tokens.EOF, '');
```

Now we have the tests passing and an improved lexer. Our language is taking shape. The source code is a bit more complex and all the tokens were generated. That's pretty nice!

## **Final words & Resources**

If you didn't have the opportunity, take a look at the [first part of the Lexical Analysis](https://leandrotk.github.io/series/building-an-interpreter/building-an-interpreter-lexical-analysis-part-1.html). This is the second post about my journey learning compilers and studying programming language theory. And part of the [Building an Interpreter series](https://leandrotk.github.io/series/building-an-interpreter/).

These are the resources I'm using to learn more about this field:

- [monkey-ts](https://github.com/leandrotk/monkey-ts): the open source project of the compiler for the TypeScript version of the Monkey programming language.
- [Programming Language Theory](https://github.com/leandrotk/programming-language-theory): a bunch of resources about my studies on Programming Language Theory & Applied PLT.
- [Writing an Interpreter in Go](https://www.goodreads.com/book/show/32681092-writing-an-interpreter-in-go): the book I'm reading to learn and implement the Monkey compiler.
