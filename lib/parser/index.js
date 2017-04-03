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
        var $ = _this;
        $.RULE("selectStatement", function () {
            $.SUBRULE($.selectClause);
            $.SUBRULE($.fromClause);
            $.OPTION(function () {
                $.SUBRULE($.whereClause);
            });
        });
        $.RULE("selectClause", function () {
            $.CONSUME(lexer_1.Select);
            $.AT_LEAST_ONE_SEP(lexer_1.Comma, function () {
                $.CONSUME(lexer_1.Identifier);
            });
        });
        $.RULE("fromClause", function () {
            $.CONSUME(lexer_1.From);
            $.CONSUME(lexer_1.Identifier);
        });
        $.RULE("whereClause", function () {
            $.CONSUME(lexer_1.Where);
            $.SUBRULE($.expression);
        });
        $.RULE("expression", function () {
            $.SUBRULE($.atomicExpression);
            $.SUBRULE($.relationalOperator);
            $.SUBRULE2($.atomicExpression); // note the '2' suffix to distinguish
            // from the 'SUBRULE(atomicExpression)'
            // 2 lines above.
        });
        $.RULE("atomicExpression", function () {
            $.OR([
                { ALT: function () { $.CONSUME(lexer_1.Integer); } },
                { ALT: function () { $.CONSUME(lexer_1.Identifier); } }
            ]);
        });
        $.RULE("relationalOperator", function () {
            return $.OR([
                { ALT: function () { $.CONSUME(lexer_1.GreaterThan); } },
                { ALT: function () { $.CONSUME(lexer_1.LessThan); } }
            ]);
        });
        chevrotain_1.Parser.performSelfAnalysis(_this);
        return _this;
    }
    return SelectParser;
}(chevrotain_1.Parser));
exports.SelectParser = SelectParser;
//# sourceMappingURL=index.js.map