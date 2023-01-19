# Evaluation

Evaluation defined the semantics of the language.

This code:

```
let num = 5;

if (num) {
  return a;
} else {
  return b;
}
```

with the evaluation process, we know if it will return `a` or `b`.

- different implementations of interpreters
  - “tree-walking interpreters”
  - the evaluation step can be preceded by small optimizations that rewrite the AST (e.g. remove unused variable bindings) or convert it into another intermediate representation (IR) that’s more suitable for recursive and repeated evaluation.
  - convert to bytecode (another IR of the AST)
    - it would be run in a virtual machine that knows how to interpret bytcode (bytecode cannot be interpreted by the CPU)
    - [difference between bytecode and machine code](https://www.geeksforgeeks.org/difference-between-byte-code-and-machine-code)
  - JIT (for “just in time”) interpreter/compiler: the virtual machine compiles the bytecode to native machine code, right before its execution - just in time
- evaluating expressions
  - `func Eval(node ast.Node) object.Object`: it takes a node (every AST node fulfills the node interface) and return the object
  - this structure will help us recursively call eval, evaluate part of the AST node and recall it to evaluate the rest
  - self-evaluating expressions: integers and booleans: they evaluate to themselves. if you type `10`, it will evaluate to `10`. If you type `true`, it will evaluate to `true`.
- operator expressions
  - the operator `!` converts the operand into a boolean and then negates it
    - if not a boolean, the value will be acted like a truthy or falsy value. e.g. `10`. `10` is truthy, so `!10` will be converted into `!true` and then negated `false`.

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
