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


import { rule } from './rule-parser'

export class SelectParser extends Parser {

    constructor(input: Token[]) {
        super(input, allTokens)
        // must be called at the end of the constructor!
        Parser.performSelfAnalysis(this)
    }

    // selectStatement = this.RULE("selectStatement", () => {
    //     this.SUBRULE(this.selectClause)
    //     this.SUBRULE(this.fromClause)
    //     this.OPTION(() => {
    //         this.SUBRULE(this.whereClause)
    //     })
    // })

    selectClause = rule(this, 'selectClause', [{
        // TODO: auto-matically detect token and use consume:
        consume: Select
    }, {
        // TODO: automatically detect REPEAT if min or sep
        repeat: {
            min: 1,
            sep: Comma,
            rule: {
                consume: Identifier
            }
        }
    }
    ])

    selectStatement = rule(this, 'selectStatement', [{
        rule: 'selectClause',
    }, {
        rule: 'fromClause',
    }, {
        option: { rule: 'whereClause' }
    }
    ])


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

    fromClause = rule(this, 'fromClause', [{
        consume: From
    }, {
        consume: Identifier
    }])


    // whereClause = this.RULE("whereClause", () => {
    //     this.CONSUME(Where)
    //     this.SUBRULE(this.expression)
    // })

    whereClause = rule(this, 'whereClause', [{
        consume: Where
    }, {
        // TODO: automatically asume {rule: ...} if a simple string
        rule: 'expression'
    }
    ])

    atomicExpression = rule(this, 'atomicExpression', {
        // TODO: automatically use alt for each OR rule
        or: [
            { alt: { consume: Integer } },
            { alt: { consume: Identifier } }
        ]
    })

    // relationalOperator = this.RULE("relationalOperator", () => {
    //     return this.OR([
    //         { ALT: function () { this.CONSUME(GreaterThan) } },
    //         { ALT: function () { this.CONSUME(LessThan) } }
    //     ]);
    // });

    relationalOperator = rule(this, 'relationalOperator', [{
        or: [
            { alt: { consume: GreaterThan } },
            { alt: { consume: LessThan } }
        ]
    }])

    expression = rule(this, 'expression', [{
        rule: 'atomicExpression'
    }, {
        rule: 'relationalOperator'
    }, {
        // auto-detect repeat!
        rule: 'atomicExpression'
    }
    ])

    // atomicExpression = this.RULE("atomicExpression", () => {
    //     this.OR([
    //         { ALT: () => { this.CONSUME(Integer) } },
    //         { ALT: () => { this.CONSUME(Identifier) } }
    //     ]);
    // })
}
