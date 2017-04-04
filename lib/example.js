"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var chevrotain_1 = require("chevrotain");
// Using TypeScript we have both classes and static properties to define Tokens
var True = (function (_super) {
    __extends(True, _super);
    function True() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return True;
}(chevrotain_1.Token));
True.PATTERN = /true/;
var False = (function (_super) {
    __extends(False, _super);
    function False() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return False;
}(chevrotain_1.Token));
False.PATTERN = /false/;
var Null = (function (_super) {
    __extends(Null, _super);
    function Null() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Null;
}(chevrotain_1.Token));
Null.PATTERN = /null/;
var LCurly = (function (_super) {
    __extends(LCurly, _super);
    function LCurly() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LCurly;
}(chevrotain_1.Token));
LCurly.PATTERN = /{/;
var RCurly = (function (_super) {
    __extends(RCurly, _super);
    function RCurly() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RCurly;
}(chevrotain_1.Token));
RCurly.PATTERN = /}/;
var LSquare = (function (_super) {
    __extends(LSquare, _super);
    function LSquare() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LSquare;
}(chevrotain_1.Token));
LSquare.PATTERN = /\[/;
var RSquare = (function (_super) {
    __extends(RSquare, _super);
    function RSquare() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RSquare;
}(chevrotain_1.Token));
RSquare.PATTERN = /]/;
var Comma = (function (_super) {
    __extends(Comma, _super);
    function Comma() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Comma;
}(chevrotain_1.Token));
Comma.PATTERN = /,/;
var Colon = (function (_super) {
    __extends(Colon, _super);
    function Colon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Colon;
}(chevrotain_1.Token));
Colon.PATTERN = /:/;
var StringLiteral = (function (_super) {
    __extends(StringLiteral, _super);
    function StringLiteral() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StringLiteral;
}(chevrotain_1.Token));
StringLiteral.PATTERN = /"(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/;
var NumberLiteral = (function (_super) {
    __extends(NumberLiteral, _super);
    function NumberLiteral() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NumberLiteral;
}(chevrotain_1.Token));
NumberLiteral.PATTERN = /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/;
var WhiteSpace = (function (_super) {
    __extends(WhiteSpace, _super);
    function WhiteSpace() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return WhiteSpace;
}(chevrotain_1.Token));
WhiteSpace.PATTERN = /\s+/;
WhiteSpace.GROUP = chevrotain_1.Lexer.SKIPPED;
var allTokens = [WhiteSpace, NumberLiteral, StringLiteral, LCurly, RCurly, LSquare, RSquare, Comma, Colon, True, False, Null];
var JsonLexer = new chevrotain_1.Lexer(allTokens);
var JsonParserTypeScript = (function (_super) {
    __extends(JsonParserTypeScript, _super);
    function JsonParserTypeScript(input) {
        var _this = _super.call(this, input, allTokens) || this;
        // In TypeScript the parsing rules are explicitly defined as class instance properties
        // This allows for using access control (public/private/protected) and more importantly "informs" the TypeScript compiler
        // about the API of our Parser, so referencing an invalid rule name (this.SUBRULE(this.oopsType);)
        // is now a TypeScript compilation error.
        _this.json = _this.RULE("json", function () {
            _this.OR([
                // using ES6 Arrow functions to reduce verbosity.
                { ALT: function () { _this.SUBRULE(_this.object); } },
                { ALT: function () { _this.SUBRULE(_this.array); } }
            ]);
        });
        // example for private access control
        _this.object = _this.RULE("object", function () {
            _this.CONSUME(LCurly);
            _this.MANY_SEP({
                SEP: Comma, DEF: function () {
                    _this.SUBRULE2(_this.objectItem);
                }
            });
            _this.CONSUME(RCurly);
        });
        _this.objectItem = _this.RULE("objectItem", function () {
            _this.CONSUME(StringLiteral);
            _this.CONSUME(Colon);
            _this.SUBRULE(_this.value);
        });
        _this.array = _this.RULE("array", function () {
            _this.CONSUME(LSquare);
            _this.MANY_SEP({
                SEP: Comma, DEF: function () {
                    _this.SUBRULE(_this.value);
                }
            });
            _this.CONSUME(RSquare);
        });
        _this.value = _this.RULE("value", function () {
            _this.OR([
                { ALT: function () { return _this.CONSUME(StringLiteral); } },
                { ALT: function () { return _this.CONSUME(NumberLiteral); } },
                { ALT: function () { return _this.SUBRULE(_this.object); } },
                { ALT: function () { return _this.SUBRULE(_this.array); } },
                { ALT: function () { return _this.CONSUME(True); } },
                { ALT: function () { return _this.CONSUME(False); } },
                { ALT: function () { return _this.CONSUME(Null); } }
            ]);
        });
        chevrotain_1.Parser.performSelfAnalysis(_this);
        return _this;
    }
    return JsonParserTypeScript;
}(chevrotain_1.Parser));
// reuse the same parser instance.
var parser = new JsonParserTypeScript([]);
function parseJson(text) {
    var lexResult = JsonLexer.tokenize(text);
    // setting a new input will RESET the parser instance's state.
    parser.input = lexResult.tokens;
    // any top level rule may be used as an entry point
    var value = parser.json();
    // this would be a TypeScript compilation error because our parser now has a clear API.
    // let value = parser.json_OopsTypo()
    var result = {
        value: value,
        lexErrors: lexResult.errors,
        parseErrors: parser.errors
    };
    console.log(result);
    return result;
}
exports.parseJson = parseJson;
//# sourceMappingURL=example.js.map