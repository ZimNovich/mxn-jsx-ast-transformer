# mxn-jsx-ast-transformer.js

Transforms JSX AST into ESTree-compilant AST with JS call expressions.

- ~3kb minified
- ~1.5kb minified + gzipped

## Usage

We suggest you to load the module via `require` until the stabilization of ES modules in Node.js:
```javascript
const transform = require("mxn-jsx-ast-transformer");
```

Now you can transform all JSX entries into JS calls like this:
```javascript
let ast_new = transform(ast, { factory: "h" });
```

Where

 - `ast` {Object} - ESTree-compilant JSX AST to transform JSX in
 - `factory` {String} - factory function to use, e.g. `h`, `m`, `React.createElement`

<dl>
  <dt>ast {Object}</dt>
  <dd>ESTree-compilant JSX AST to transform JSX in</dd>
  <dt>factory {String}</dt>
  <dd>factory function to use, e.g. `h`, `m`, `React.createElement`</dd>
</dl>

Please note that this tool only converts JSX AST into regular ES5-compliant JavaScript AST. If you want to transpile your source code, check out Babel and Buble transpilers.

```javascript
// Acorn & Astring
const acorn = require("acorn");
const acornJsx = require("acorn-jsx");
const { generate } = require("astring");
const { JsxGenerator } = require("astring-jsx");

// MXN JSX Transpiler
const conv = require("mxn-jsx-transpiler");

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

// Convert AST
let ast_new = conv(ast, { factory: "h" });

// Generate code
let formattedCode = generate(ast_new, {
    indent: "    ",
    lineEnd: "\n",
    comments: false,
    generator: JsxGenerator
    //sourceMap: map
});
```
## API

```javascript
jsx(
	str, {string}
	extend: {(Object<string, function>|string)}
);
```

This method recieves a string and optional extend object/string that is used to create
a custom mapping for the javascript output, for example...

```javascript
jsx(str, {
	text: function (children) {
	 	// return string
	},
	element: function (type, props, children) {
	 	// return string
	},
	component: function (type, props, children) {
		// return string
	}
	props: function (props, node) {
		// return string
	}
	node: function (node) {
		// return string
	}
});

jsx(str, 'React.createElement');
```

If the input string has a pragma comment, for example`/* @jsx h */` it will use that for the output mapping, if no pragma comment/custom mapping has been specicifed it defaults to hyperscript `h(...)`.

## License

This plugin is issued under the MIT license.
