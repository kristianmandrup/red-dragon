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
var Select = (function (_super) {
    __extends(Select, _super);
    function Select() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Select;
}(chevrotain_1.Token));
Select.PATTERN = /SELECT/;
exports.Select = Select;
var From = (function (_super) {
    __extends(From, _super);
    function From() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return From;
}(chevrotain_1.Token));
From.PATTERN = /FROM/;
exports.From = From;
var Where = (function (_super) {
    __extends(Where, _super);
    function Where() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Where;
}(chevrotain_1.Token));
Where.PATTERN = /WHERE/;
exports.Where = Where;
var Comma = (function (_super) {
    __extends(Comma, _super);
    function Comma() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Comma;
}(chevrotain_1.Token));
Comma.PATTERN = /,/;
exports.Comma = Comma;
var Identifier = (function (_super) {
    __extends(Identifier, _super);
    function Identifier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Identifier;
}(chevrotain_1.Token));
Identifier.PATTERN = /\w+/;
exports.Identifier = Identifier;
var Integer = (function (_super) {
    __extends(Integer, _super);
    function Integer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Integer;
}(chevrotain_1.Token));
Integer.PATTERN = /0|[1-9]\d+/;
exports.Integer = Integer;
var GreaterThan = (function (_super) {
    __extends(GreaterThan, _super);
    function GreaterThan() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GreaterThan;
}(chevrotain_1.Token));
GreaterThan.PATTERN = /</;
exports.GreaterThan = GreaterThan;
var LessThan = (function (_super) {
    __extends(LessThan, _super);
    function LessThan() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LessThan;
}(chevrotain_1.Token));
LessThan.PATTERN = />/;
exports.LessThan = LessThan;
var WhiteSpace = (function (_super) {
    __extends(WhiteSpace, _super);
    function WhiteSpace() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return WhiteSpace;
}(chevrotain_1.Token));
WhiteSpace.PATTERN = /\s+/;
WhiteSpace.GROUP = chevrotain_1.Lexer.SKIPPED;
exports.WhiteSpace = WhiteSpace;
exports.allTokens = [WhiteSpace, Select, From, Where, Comma, Identifier, Integer, GreaterThan, LessThan];
exports.SelectLexer = new chevrotain_1.Lexer(exports.allTokens);
var inputText = "SELECT column1 FROM table2";
var lexingResult = exports.SelectLexer.tokenize(inputText);
console.log(lexingResult);
//# sourceMappingURL=index.js.map