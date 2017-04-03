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

    let $ = this

    $.RULE("selectStatement", () => {
      $.SUBRULE($.selectClause)
      $.SUBRULE($.fromClause)
      $.OPTION(() => {
        $.SUBRULE($.whereClause)
      })
    })

    $.RULE("selectClause", () => {
      $.CONSUME(Select)
      $.AT_LEAST_ONE_SEP(Comma, () => {
        $.CONSUME(Identifier)
      })
    })

    $.RULE("fromClause", () => {
      $.CONSUME(From)
      $.CONSUME(Identifier)
    })

    $.RULE("whereClause", () => {
      $.CONSUME(Where)
      $.SUBRULE($.expression)
    })

    $.RULE("expression", () => {
      $.SUBRULE($.atomicExpression)
      $.SUBRULE($.relationalOperator)
      $.SUBRULE2($.atomicExpression) // note the '2' suffix to distinguish
      // from the 'SUBRULE(atomicExpression)'
      // 2 lines above.
    })

    $.RULE("atomicExpression", () => {
      $.OR([
        { ALT: () => { $.CONSUME(Integer) } },
        { ALT: () => { $.CONSUME(Identifier) } }
      ]);
    })

    $.RULE("relationalOperator", () => {
      return $.OR([
        { ALT: function () { $.CONSUME(GreaterThan) } },
        { ALT: function () { $.CONSUME(LessThan) } }
      ]);
    });

    Parser.performSelfAnalysis(this)
  }
}