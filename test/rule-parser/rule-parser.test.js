import test from 'ava'

import {
  Parser
} from 'chevrotain'


import {
  allTokens,
  Select,
  Where,
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

test('consume token', t => {
  let text = 'SELECT'
  let rp = createParser(text)
  let config = {
    code: `() => {
      this.CONSUME(Select)
    }`
  }
  let selectRule = rp.createRule('selectRule', [Select])
  // console.log('selectRule', selectRule)
  selectRule()
  t.pass()
})

test('option obj', t => {
  let text = 'SELECT WHERE'
  let rp = createParser(text)
  let config = {
    code: `() => {
      this.CONSUME(Select)
    }`
  }
  let selectRule = rp.createRule('selectRule', [Select, {
    option: {
      consume: Where
    }
  }])
  // console.log('selectRule', selectRule)
  selectRule()
  t.pass()
})

test('option token', t => {
  let text = 'SELECT WHERE'
  let rp = createParser(text)
  let config = {
    code: `() => {
      this.CONSUME(Select)
    }`
  }
  let selectRule = rp.createRule('selectRule', [Select, {
    option: Where
  }])
  // console.log('selectRule', selectRule)
  selectRule()
  t.pass()
})

test('alt', t => {

})

test('or', t => {

})

test('subrule', t => {

})