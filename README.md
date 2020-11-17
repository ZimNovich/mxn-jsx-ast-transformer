# mxn-jsx-ast-transformer

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

options

The default values are shown after each option key.

```javascript
{
    factory: "h",         // factory function to use, e.g. `h`, `m`, `React.createElement`
    quotePropNames: true, // request body. can be null, a string, a Buffer, a Blob, or a Node.js Readable stream
    redirect: 'follow',   // set to `manual` to extract redirect headers, `error` to reject redirect
    signal: null,         // pass an instance of AbortSignal to optionally abort requests
}
```

Below is an advanced usage example:

```javascript
let ast = transform(jsx_ast, { factory: "h", quotePropNames: true });
```

Where
 - `jsx_ast` {Object} - ESTree-compilant JSX AST to transform to regular JS AST
 - `factory` {String} - factory function to use, e.g. `h`, `m`, `React.createElement`
 - `quotePropNames` {Boolean} - if set to true then property names will be put into quotes

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
