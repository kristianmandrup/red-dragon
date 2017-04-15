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
} from '../../lib/lexer'

import {
  rule,
  RuleParser
} from '../../lib/parser/rule-parser'

export class SelectParser extends Parser {
  registry = {}

  constructor(input) {
    super(input, allTokens)
  }
}

test('RuleParser', t => {
  let text = 'SELECT'
  let lexingResult = SelectLexer.tokenize(text)
  let parser = new SelectParser(lexingResult);
  let rp = new RuleParser(parser)

  let config = {
    code: `() => {
      this.CONSUME(Select)
    }`
  }
  let selectRule = rp.createRule('selectRule', [{
    consume: Select
  }], {})
  // console.log('selectRule', selectRule)
  selectRule()
  t.pass()
})

test('consume', t => {

})

test('subrule', t => {

})

test('option', t => {

})

test('option', t => {

})

test('alt', t => {

})

test('or', t => {

})