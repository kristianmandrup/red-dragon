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
        // selectStatement = this.RULE("selectStatement", () => {
        //     this.SUBRULE(this.selectClause)
        //     this.SUBRULE(this.fromClause)
        //     this.OPTION(() => {
        //         this.SUBRULE(this.whereClause)
        //     })
        // })
        _this.selectClause = rule_parser_1.rule(_this, 'selectClause', [{
                // TODO: auto-matically detect token and use consume:
                consume: lexer_1.Select
            }, {
                // TODO: automatically detect REPEAT if min or sep
                repeat: {
                    min: 1,
                    sep: lexer_1.Comma,
                    rule: {
                        consume: lexer_1.Identifier
                    }
                }
            }
        ]);
        _this.selectStatement = rule_parser_1.rule(_this, 'selectStatement', [{
                rule: 'selectClause',
            }, {
                rule: 'fromClause',
            }, {
                option: { rule: 'whereClause' }
            }
        ]);
        // selectClause = this.RULE("selectClause", () => {
        //     this.CONSUME(Select)
        //     this.AT_LEAST_ONE_SEP({
        //         SEP: Comma, DEF: () => {
        //             this.CONSUME(Identifier)
        //         }
        //     })
        // })
        // fromClause = this.RULE("fromClause", () => {
        //     this.CONSUME(From)
        //     this.CONSUME(Identifier)
        // })
        _this.fromClause = rule_parser_1.rule(_this, 'fromClause', [{
                consume: lexer_1.From
            }, {
                consume: lexer_1.Identifier
            }]);
        // whereClause = this.RULE("whereClause", () => {
        //     this.CONSUME(Where)
        //     this.SUBRULE(this.expression)
        // })
        _this.whereClause = rule_parser_1.rule(_this, 'whereClause', [{
                consume: lexer_1.Where
            }, {
                // TODO: automatically asume {rule: ...} if a simple string
                rule: 'expression'
            }
        ]);
        _this.atomicExpression = rule_parser_1.rule(_this, 'atomicExpression', {
            // TODO: automatically use alt for each OR rule
            or: [
                { alt: { consume: lexer_1.Integer } },
                { alt: { consume: lexer_1.Identifier } }
            ]
        });
        // relationalOperator = this.RULE("relationalOperator", () => {
        //     return this.OR([
        //         { ALT: function () { this.CONSUME(GreaterThan) } },
        //         { ALT: function () { this.CONSUME(LessThan) } }
        //     ]);
        // });
        _this.relationalOperator = rule_parser_1.rule(_this, 'relationalOperator', [{
                or: [
                    { alt: { consume: lexer_1.GreaterThan } },
                    { alt: { consume: lexer_1.LessThan } }
                ]
            }]);
        _this.expression = rule_parser_1.rule(_this, 'expression', [{
                rule: 'atomicExpression'
            }, {
                rule: 'relationalOperator'
            }, {
                // auto-detect repeat!
                rule: 'atomicExpression'
            }
        ]);
        // must be called at the end of the constructor!
        chevrotain_1.Parser.performSelfAnalysis(_this);
        return _this;
    }
    return SelectParser;
}(chevrotain_1.Parser));
exports.SelectParser = SelectParser;
//# sourceMappingURL=index.js.map