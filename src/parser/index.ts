// selectStatement
//    : selectClause fromClause (whereClause)?

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

import {
    Token,
    Parser
} from 'chevrotain'

import {
    allTokens,
    WhiteSpace,
    Select,
    From,
    Where,
    Comma,
    Identifier,
    Integer,
    GreaterThan,
    LessThan
} from '../lexer'

export class SelectParser extends Parser {

    constructor(input: Token[]) {
        super(input, allTokens)
        // must be called at the end of the constructor!
        Parser.performSelfAnalysis(this)
    }

    selectStatement = this.RULE("selectStatement", () => {
        this.SUBRULE(this.selectClause)
        this.SUBRULE(this.fromClause)
        this.OPTION(() => {
            this.SUBRULE(this.whereClause)
        })
    })

    selectClause = this.RULE("selectClause", () => {
        this.CONSUME(Select)
        this.AT_LEAST_ONE_SEP({
            SEP: Comma, DEF: () => {
                this.CONSUME(Identifier)
            }
        })
    })

    fromClause = this.RULE("fromClause", () => {
        this.CONSUME(From)
        this.CONSUME(Identifier)
    })

    whereClause = this.RULE("whereClause", () => {
        this.CONSUME(Where)
        this.SUBRULE(this.expression)
    })

    expression = this.RULE("expression", () => {
        this.SUBRULE(this.atomicExpression)
        this.SUBRULE(this.relationalOperator)
        this.SUBRULE2(this.atomicExpression) // note the '2' suffix to distinguish
        // from the 'SUBRULE(atomicExpression)'
        // 2 lines above.
    })

    atomicExpression = this.RULE("atomicExpression", () => {
        this.OR([
            {ALT: () => { this.CONSUME(Integer) }},
            {ALT: () => { this.CONSUME(Identifier) }}
        ]);
    })

    relationalOperator = this.RULE("relationalOperator", () => {
        return this.OR([
            {ALT: function () { this.CONSUME(GreaterThan) }},
            {ALT: function () { this.CONSUME(LessThan) }}
        ]);
    });
}
