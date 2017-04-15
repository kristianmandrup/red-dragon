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

function createParser(text) {
  let lexingResult = SelectLexer.tokenize(text)
  let parser = new SelectParser(lexingResult);
  return new RuleParser(parser)
}



test('obj consume', t => {
  let text = 'SELECT'
  let rp = createParser(text)
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
  let text = 'SELECT'
  let rp = createParser(text)
  let config = {
    code: `() => {
      this.CONSUME(Select)
    }`
  }
  let selectRule = rp.createRule('selectRule', [Select], {})
  // console.log('selectRule', selectRule)
  selectRule()
  t.pass()
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