import test from 'ava'

import {
  Parser
} from 'chevrotain'


import {
  allTokens,
  Select,
  Comma,
  Identifier,
  SelectLexer
} from '../lib/lexer'

import {
  rule
} from '../lib/parser/rule-parser'

let selectStr = `() => {
  this.CONSUME(Select)
}`

let selectClauseStr = `() => {
    this.CONSUME(Select)
    this.AT_LEAST_ONE_SEP({
        SEP: Comma, DEF: () => {
            this.CONSUME(Identifier)
        }
    })
}`

export class SelectParser extends Parser {
  registry = {}

  constructor(input) {
    super(input, allTokens)
    // must be called at the end of the constructor!
    this.smallMap()
    // this.normal()
    // this.quick()
    Parser.performSelfAnalysis(this)
  }

  small() {
    this.statement = this.RULE("selectClause", () => {
      this.CONSUME(Select)
    }, {
      code: selectStr
    })
  }

  smallMap() {
    this.statement = this.RULE("selectClause", () => {
      [0].map(n => {
        this.CONSUME(Select)
      })
    }, {
      code: selectStr
    })
  }

  normal() {
    let def = {
      SEP: Comma,
      DEF: () => {
        this.CONSUME(Identifier)
      }
    }

    let execRule = () => {
      this.CONSUME(Select)
      this.AT_LEAST_ONE_SEP(def)
    }

    this.selectClause = this.RULE("selectClause", execRule, {
      code: selectClauseStr
    })

    this.selectStatement = this.RULE("selectStatement", () => {
      this.SUBRULE(this.selectClause)
    })
  }

  quick() {
    // this.quickSelectStatement = rule(this, 'selectStatement', [
    //   'selectClause', 'fromClause', {
    //     option: ['whereClause']
    //   }
    // ])

    rule(this, 'selectClause', [
      // auto-matically detect token and use consume:
      Select, {
        // automatically detect REPEAT if min or sep
        min: 1,
        sep: Comma,
        def: Identifier
      }
    ])
    // ], {
    //   code: selectClauseStr
    // })

    this.quickSelectStatement = rule(this, 'selectStatement', [
      'selectClause'
    ], {
      code: `() => {
        this.SUBRULE(this.selectClause)
      }`
    })
  }
}

test('small', t => {
  let text = "SELECT"
  let lexingResult = SelectLexer.tokenize(text)
  let parser = new SelectParser(lexingResult.tokens);
  parser.statement()
  t.pass()
})

// test('parser', t => {
//   let text = "SELECT column1 FROM table2"
//   let lexingResult = SelectLexer.tokenize(text)
//   let parser = new SelectParser(lexingResult.tokens);
//   parser.selectStatement()
//   t.pass()
// })