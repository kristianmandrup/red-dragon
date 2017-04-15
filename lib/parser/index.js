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
var SelectParser = (function (_super) {
    __extends(SelectParser, _super);
    function SelectParser(input) {
        var _this = _super.call(this, input, lexer_1.allTokens) || this;
        _this.registry = {};
        _this.selectStatement = _this.RULE("selectStatement", function () {
            _this.SUBRULE(_this.selectClause);
            _this.SUBRULE(_this.fromClause);
            _this.OPTION(function () {
                _this.SUBRULE(_this.whereClause);
            });
        });
        _this.selectClause = _this.RULE("selectClause", function () {
            _this.CONSUME(lexer_1.Select);
            _this.AT_LEAST_ONE_SEP({
                SEP: lexer_1.Comma, DEF: function () {
                    _this.CONSUME(lexer_1.Identifier);
                }
            });
        });
        _this.fromClause = _this.RULE("fromClause", function () {
            _this.CONSUME(lexer_1.From);
            _this.CONSUME(lexer_1.Identifier);
        });
        _this.whereClause = _this.RULE("whereClause", function () {
            _this.CONSUME(lexer_1.Where);
            _this.SUBRULE(_this.expression);
        });
        _this.relationalOperator = _this.RULE("relationalOperator", function () {
            return _this.OR([
                { ALT: function () { this.CONSUME(lexer_1.GreaterThan); } },
                { ALT: function () { this.CONSUME(lexer_1.LessThan); } }
            ]);
        });
        _this.expression = _this.RULE("expression", function () {
            _this.SUBRULE(_this.atomicExpression);
            _this.SUBRULE(_this.relationalOperator);
            _this.SUBRULE2(_this.atomicExpression); // note the '2' suffix to distinguish
            // from the 'SUBRULE(atomicExpression)'
            // 2 lines above.
        });
        _this.atomicExpression = _this.RULE("atomicExpression", function () {
            _this.OR([
                { ALT: function () { _this.CONSUME(lexer_1.Integer); } },
                { ALT: function () { _this.CONSUME(lexer_1.Identifier); } }
            ]);
        });
        // must be called at the end of the constructor!
        chevrotain_1.Parser.performSelfAnalysis(_this);
        return _this;
    }
    return SelectParser;
}(chevrotain_1.Parser));
exports.SelectParser = SelectParser;
//# sourceMappingURL=index.js.map