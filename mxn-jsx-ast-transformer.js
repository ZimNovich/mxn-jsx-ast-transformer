// MXN JSX AST Transformer - transforms JSX AST into ESTree-compilant JS AST
// Copyright (c) 2020 Ilya Zimnovich

// ESTree Walker
const walk = require("estree-walker").walk;

const callFunction = function (name, args) {
    return {
        type: "CallExpression",
        callee: { type: "Identifier", name: name },
        arguments: args ? args : []
    };
};

const makeIdentifier = function (name) {
    return { type: "Identifier", name: name };
};

const makeLiteral = function (value) {
    return { type: "Literal", value: value };
};

const makeProperty = function(name, value) {
    return {
        "type": "Property",
        "method": false,
        "shorthand": false,
        "computed": false,
        "key": name,
        "value": value,
        "kind": "init"
    };
};

const makeSpread = function(arg) {
    return {
        "type": "SpreadElement",
        "argument": arg
    };
};

// Transforms name
const transformName = function(name) {
    switch (name.type) {
        case "JSXIdentifier":
            return makeLiteral(name.name);

        case "JSXMemberExpression":
            return name;

        default:
            throw new Error(`Unknown name type (${name.type})`);
    }
}

// Transforms attributes into properties
const transformAttributes = function(attributes) {
    return attributes.map(function(attribute) {
        if (attribute.type == "JSXAttribute") {
            if (!attribute.value) {
                return makeProperty(
                    makeIdentifier(attribute.name.name), // Check it
                    makeLiteral(true)
                ); 
            }
            switch (attribute.value.type) {
                case "Literal":
                case "JSXExpressionContainer":
                        return makeProperty(
                        makeIdentifier(attribute.name.name),
                        attribute.value
                    ); 
        
                default:
                    throw new Error(`Unknown attribute value type (${attribute.value.type})`);
            }
        }

        if (attribute.type == "JSXSpreadAttribute") {
            return makeSpread(attribute.argument);
        }

        throw new Error(`Unknown attribute type (${attribute.type})`);
    });
}

// MXN JSX Converter
var MXNJSXConv = function(tree, options)
{
    // Setting default options
    const defaults = {
        factory: "h",
        keepComments: false
    };

    // Mixing mandatory and user provided arguments
    options = Object.assign(defaults, options);

    walk(tree, {
        enter: function(node, parent, prop, index) {
            // Textual nodes
            if (node.type == "JSXText") {
                if (node.value.match(/^[ \t]*[\r\n][ \t\r\n]*$/) ) {
                    this.remove();
                }
                else {
                    // Remove leading and trailing new lines from a node value
                    let value = node.value.replace(/^\s+/, "").replace(/\s+$/, "");
                    let text_node = makeLiteral(value);
                    this.replace(text_node);
                }
                return;
            }

            if (node.type == "JSXExpressionContainer") {
                switch (node.expression.type) {
                    case "MemberExpression":
                    case "BinaryExpression":
                    case "CallExpression":
                    case "ArrowFunctionExpression":
                    case "Identifier":
                        this.replace(node.expression);
                        return;

                    default:
                        throw new Error("Unknown node expression type (".concat(node.expression.type, ")"));
                  }
            }

            if (node.type == "JSXMemberExpression") {
                let transNode = node;
                transNode.type = "MemberExpression";
                this.replace(transNode);
            }

            if (node.type == "JSXIdentifier") {
                let transNode = node;
                transNode.type = "Identifier";
                this.replace(transNode);
            }

            if (node.type == "JSXElement") {
                const openingElement = node.openingElement;
                const name = openingElement.name;
                const attributes = openingElement.attributes;
                const children = node.children;
            
                let args = [];
                args.push( transformName(name) ); // Name

                // Processing attributes
                if (attributes.length && (attributes.length > 0) ) {
                    let transformedAttributes = {
                        "type": "ObjectExpression",
                        "properties": transformAttributes(attributes)
                    };
                    args.push(transformedAttributes);
                }
                else {
                    // Null attributes
                    args.push( makeLiteral(null) );
                }

                // Processing children
                if (children.length && (children.length > 0) ) {
                    let transformedChildren = {
                        "type": "ArrayExpression",
                        "elements": children
                    };
                    args.push(transformedChildren);
                }

                let callNode = callFunction(options.factory, args);
                this.replace(callNode);
            }
        }
    });

    return tree;
};

MXNJSXConv.version = "0.8.1";

// export the module
module.exports = MXNJSXConv;
