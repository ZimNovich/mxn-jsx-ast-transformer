# mxn-jsx-ast-transformer

[![npm@latest](https://badgen.net/npm/v/mxn-jsx-ast-transformer)](https://www.npmjs.com/package/mxn-jsx-ast-transformer)
[![Install size](https://packagephobia.now.sh/badge?p=mxn-jsx-ast-transformer)](https://packagephobia.now.sh/result?p=mxn-jsx-ast-transformer)
[![Downloads](https://img.shields.io/npm/dm/mxn-jsx-ast-transformer.svg)](https://npmjs.com/mxn-jsx-ast-transformer)

Transforms JSX AST into regular JS AST

- ~5.5kb size
- ~2.5kb minified + gzipped

## Usage

We suggest you to load the module via `require` until the stabilization of ES modules in Node.js:
```javascript
const transform = require("mxn-jsx-ast-transformer");
```

Now you can transform ("desugar") all JSX elements into JS calls as follows:
```javascript
let ast = transform(jsx_ast[, options]);
```

Where
 - `jsx_ast` {Object} - ESTree-compilant JSX AST to transform to regular JS AST
 - `options` {Object} - options for JSX ⇒ JS transformation

The default values for the `options` object are shown below:
```javascript
{
    factory: "h",         // factory function to use, e.g. `h`, `m`, `React.createElement`
    quotePropNames: true  // put property names into quotes
}
```

Below is an advanced usage example:

```javascript
let ast = transform(jsx_ast, { factory: "React.createElement", quotePropNames: false });
```

Please note that this tool only converts JSX AST into regular ES5-compliant JavaScript AST. If you want to transpile your source code, check out [mxn-jsx-transpiler](https://github.com/ZimNovich/mxn-jsx-transpiler) or use a code like:

```javascript
// Acorn & Astring
const acorn = require("acorn");
const acornJsx = require("acorn-jsx");
const { generate } = require("astring");

// MXN JSX AST Transformer
const transform = require("mxn-jsx-ast-transformer");

// Create parser
let parser = acorn.Parser.extend(acornJsx({
    allowNamespaces: false
}) );

let code = 'let a = <Greeting firstName="Maximilian" lastName="Pierpont" age={1 + 2 + 3 + 4} />;';

let ast = parser.parse(code, {
    ecmaVersion: 2020,
    sourceType: "module",
    locations: false,
    plugins: { jsx: true }
});

// Transform AST
let ast_new = transform(ast, { factory: "h" });

// Generate code
let transformedCode = generate(ast_new, {
    indent: "    ",
    lineEnd: "\n",
    comments: false
});
```

## License

This module is released under the MIT license.

## Related

- [mxn-jsx-transpiler](https://github.com/ZimNovich/mxn-jsx-transpiler) - Transpiles JSX to regular JavaScript
- [rollup-plugin-mxn-jsx](https://github.com/ZimNovich/rollup-plugin-mxn-jsx) - Rollup JSX plugin that transpiles JSX into JavaScript
