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
    registry = {}

    constructor(input: Token[]) {
        super(input, allTokens)
        // must be called at the end of the constructor!
        Parser.performSelfAnalysis(this)
    }

    selectClause = rule(this, 'selectClause', [
        // auto-matically detect token and use consume:
        Select, {
            // automatically detect REPEAT if min or sep
            min: 1,
            sep: Comma,
            def: Identifier
        }
    ])

    selectStatement = rule(this, 'selectStatement', [
        'selectClause', 'fromClause', {
            option: ['whereClause']
        }
    ])

    fromClause = rule(this, 'fromClause', [{
        consume: From
    }, {
        consume: Identifier
    }])

    whereClause = rule(this, 'whereClause', [Where, 'expression'])

    atomicExpression = rule(this, 'atomicExpression', {
        // automatically use alt for each OR rule
        or: [Integer, Identifier]
    })

    relationalOperator = rule(this, 'relationalOperator', [{
        or: [GreaterThan, LessThan]
    }])

    expression = rule(this, 'expression', [
        'atomicExpression',
        'relationalOperator',
        // auto-detect repeat!
        'atomicExpression'
    ])
}
