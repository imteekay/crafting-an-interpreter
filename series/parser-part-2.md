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
