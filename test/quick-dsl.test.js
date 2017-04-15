import test from 'ava'

import {
  Parser
} from 'chevrotain'


import {
  allTokens,
  SelectLexer
} from '../lib/lexer'

import {
  rule
} from '../lib/parser/rule-parser'

export class SelectParser extends Parser {
  registry = {}

  constructor(input) {
    super(input, allTokens)
    // must be called at the end of the constructor!
    this.normal()
    // Parser.performSelfAnalysis(this)
  }

  normal() {
    this.selectStatement = this.RULE("selectStatement", () => {
      this.SUBRULE(this.selectClause)
      this.SUBRULE(this.fromClause)
      this.OPTION(() => {
        this.SUBRULE(this.whereClause)
      })
    })
  }

  quick() {
    this.quickSelectStatement = rule(this, 'selectStatement', [
      'selectClause', 'fromClause', {
        option: ['whereClause']
      }
    ])
  }
}

test('parser', t => {
  let text = "SELECT column1 FROM table2"
  let lexingResult = SelectLexer.tokenize(text)
  let parser = new SelectParser(lexingResult.tokens);
  console.log(parser.selectStatement.toString())
  t.pass()
  // parser.selectStatement()
})