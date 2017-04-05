# Red Dragon

![Red Dragon](https://github.com/kristianmandrup/red-dragon/raw/master/images/red-dragon.jpg)

A Smart python like language that compiles to modern (functional) Javascript.

## Install

`npm i -S red-dragon`

## CST

[Concrete Syntax Tree Creation](https://github.com/SAP/chevrotain/blob/master/docs/concrete_syntax_tree.md)

Chevrotain has the capability to automatically create a concrete syntax tree (CST) during parsing. A CST is a simple structure which represents the entire parse tree. It contains information on every token parsed.

The main advantage of using the automatic CST creation is that it enables writing "pure" grammars. This means that the semantic actions are not embedded into the grammar implementation but are instead completely separated from it.

This separation of concerns makes the grammar easier to maintain and makes it easier to implement different capabilities on the grammar, for example: separate logic for compilation and for IDE support.

CST is enabled by setting the `outputCst` flag.

```js
class MyParser extends chevrotain.Parser {
     constructor(input) {
        super(input, allTokens, {outputCst : true})
    }
}
```

Using:

```js
$.RULE("qualifiedName", () => {
    $.CONSUME(Identifier)
    $.CONSUME(Dot)
    $.CONSUME2(Identifier)
})

input = "foo.bar"

output = {
  name: "qualifiedName",
  children: {
      Dot : ["."],
      Identifier : ["foo", "bar"]
  }
}
```

Note: even when building a CST the performance on most recent versions of Chrome (59) was faster Than any other tested parsing library (Antlr4/PegJS/Jison).

## Transform CST to AST

[CST to AST example](https://github.com/kdex/chi/blob/master/src/Parser.js#L249)

## Contributing

Install dependency modules/packages

`npm i`

### Compile/Build

The project includes a `gulpfile` configured to use Babel 6.
All `/src` files are compiled to `/dist` including source maps.

Scripts:

- start: `npm start`
- build: `npm run build` (ie. compile)
- watch and start: `npm run watch`
- watch and build: `npm run watch:b`

### Run Tests

`npm test` or simply `ava test`

## License

MIT Kristian Mandrup