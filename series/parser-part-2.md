# Parser - Part 2:

- everything besides let and return statements is an expression.
- prefix operators: `-5, !true, !false`
- infix operators: `5+5, 5-5, 5/5, 5*5`
- arithmetic operators: `foo == bar, foo != bar, foo < bar, foo > bar`
- parenthesis to influence order of evaluation: `5 * (5 + 5), ((5 + 5) * 5) * 5`
- call expressions: `add(2, 3), add(add(2, 3), add(5, 10)), max(5, add(5, (5 * 5)))`
- identifiers are expressions: `foo * bar / foobar, add(foo, bar)`
- functions are expressions: `(fn(x) { return x }(5) + 10 ) * 10`
- if expressions: `let result = if (10 > 5) { true } else { false }; result // => true`

terminology for expressions

- A prefix operator is an operator “in front of” its operand. Example: `--5`
- A postfix operator is an operator “after” its operand. Example: `foobar++`
- An infix operator sits between its operands, like this: `5*8`. Infix operators appear in binary expressions - where the operator has two operands.
- operator precedence or order of operations: which priority do different operators have.

## Implementation the Pratt parser

Association of parsing functions (which Pratt calls “semantic code”) with token types.

- semicolon are optional: easier to type 5 + 5 into the REPL
- precedence: using an enum starting with the value `1` — we can see the order of operations in the enum. The bigger the value, the higher the precedence
- prefix operators: `<prefix operator><expression>;`
  - e.g. `!isGreaterThanZero(10);`
  - operator: the prefix operator
  - right: the expression after the operator
- infix operators: `<expression> <infix operator> <expression>`
  - because of the two expressions, it's also called binary expressions
  - e.g.
    - `5 + 5;`
    - `5 - 5;`
    - `5 * 5;`
    - `5 / 5;`
    - `5 > 5;`
    - `5 < 5;`
    - `5 == 5;`
    - `5 != 5;`
- higher precedence to be deeper in the tree than expressions with lower precedence operators.
- boolean literals
  - e.g.
    - `true;`
    - `false;`
    - `let foobar = true;`
    - `let barfoo = false;`
- grouped expressions
  - e.g.
    - `1 + (2 + 3) + 4`
    - `(5 + 5) * 2`
- If expressions
  - `let value = if (x > y) { x } else { y };`: this if-else expression will return a value and it assigns the value in the `value` variable.
  - The structure of an if-else expression: `if (<condition>) <consequence> else <alternative>`
  - `IfExpression` AST: `condition` holds the condition, which can be any expression, and `consequence` and `alternative` point to the consequence and alternative of the conditional
- Function literals expression
  - e.g. `fn(x, y) { return x + y; }`
  - function literals are expressions
  - abstract structure: `fn <parameters> <block statement>`
  - two main parts of function literals
    - parameters are just a list of identifiers: `(<parameter one>, <parameter two>, <parameter three>, ...)`
    - function's body as the block statement
  - different usages of function literals
    - the list of parameters can be empty: `fn() { return foobar + barfoo; }`
    - function literal as the expression in a let statement: `let myFunction = fn(x, y) { return x + y; }`
    - function literal as the expression in a return statement: `fn() { return fn(x, y) { return x > y; }; }`
    - function literal as an argument when calling another function: `myFunc(x, y, fn(x, y) { return x > y; }); `
- Call expressions
  - structure: `<expression>(<comma separated expressions>)`
  - e.g.
    - simple integer literal expressions as arguments: `add(2, 3)`
    - infix expressions as arguments: `add(2 + 2, 3 * 3 * 3)`
    - call directly from the function literal: `fn(x, y) { x + y; }(2, 3)`
    - function literal as argument: `callsFunction(2, 3, fn(x, y) { x + y; });`

## Final words & Resources

If you didn't have the opportunity, take a look at the posts from the [Building an Interpreter series](https://leandrotk.github.io/series/building-an-interpreter/):

- [Building an Interpreter: Lexical Analysis - Part 1](https://leandrotk.github.io/series/building-an-interpreter/building-an-interpreter-lexical-analysis-part-1.html)
- [Building an Interpreter: Lexical Analysis - Part 2](https://leandrotk.github.io/series/building-an-interpreter/building-an-interpreter-lexical-analysis-part-2.html)
- [Building an Interpreter: Lexical Analysis - Part 3](https://leandrotk.github.io/series/building-an-interpreter/building-an-interpreter-lexical-analysis-part-3.html)
- [Building an Interpreter: REPL](https://leandrotk.github.io/series/building-an-interpreter/building-an-interpreter-repl.html)

These are the resources I'm using to learn more about this field:

- [monkey-ts](https://github.com/leandrotk/monkey-ts): the open-source project of the compiler for the TypeScript version of the Monkey programming language.
- [Programming Language Theory](https://github.com/leandrotk/programming-language-theory): a bunch of resources about my studies on Programming Language Theory & Applied PLT.
- [Writing an Interpreter in Go](https://www.goodreads.com/book/show/32681092-writing-an-interpreter-in-go): the book I'm reading to learn and implement the Monkey compiler.
