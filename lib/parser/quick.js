// selectStatement
//    : selectClause fromClause (whereClause)?
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
// selectClause
//    : "SELECT" IDENTIFIER ("," IDENTIFIER)*
// fromClause
//    : "FROM" IDENTIFIER
// fromClause
//    : "WHERE" expression
// expression
//    : atomicExpression relationalOperator atomicExpression
// atomicExpression
//    : INTEGER | IDENTIFIER
// relationalOperator
//    : ">" | "<"
var chevrotain_1 = require("chevrotain");
var lexer_1 = require("../lexer");
var rule_parser_1 = require("./rule-parser");
var SelectParser = (function (_super) {
    __extends(SelectParser, _super);
    function SelectParser(input) {
        var _this = _super.call(this, input, lexer_1.allTokens) || this;
        _this.registry = {};
        _this.selectClause = rule_parser_1.rule(_this, 'selectClause', [
            // auto-matically detect token and use consume:
            lexer_1.Select, {
                // automatically detect REPEAT if min or sep
                min: 1,
                sep: lexer_1.Comma,
                def: lexer_1.Identifier
            }
        ]);
        _this.selectStatement = rule_parser_1.rule(_this, 'selectStatement', [
            'selectClause', 'fromClause', {
                option: ['whereClause']
            }
        ]);
        _this.fromClause = rule_parser_1.rule(_this, 'fromClause', [{
                consume: lexer_1.From
            }, {
                consume: lexer_1.Identifier
            }]);
        _this.whereClause = rule_parser_1.rule(_this, 'whereClause', [lexer_1.Where, 'expression']);
        _this.atomicExpression = rule_parser_1.rule(_this, 'atomicExpression', {
            // automatically use alt for each OR rule
            or: [lexer_1.Integer, lexer_1.Identifier]
        });
        _this.relationalOperator = rule_parser_1.rule(_this, 'relationalOperator', [{
                or: [lexer_1.GreaterThan, lexer_1.LessThan]
            }]);
        _this.expression = rule_parser_1.rule(_this, 'expression', [
            'atomicExpression',
            'relationalOperator',
            // auto-detect repeat!
            'atomicExpression'
        ]);
        // must be called at the end of the constructor!
        chevrotain_1.Parser.performSelfAnalysis(_this);
        return _this;
    }
    return SelectParser;
}(chevrotain_1.Parser));
exports.SelectParser = SelectParser;
//# sourceMappingURL=quick.js.map