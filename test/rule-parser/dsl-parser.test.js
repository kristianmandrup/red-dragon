import test from 'ava'

import {
  Parser
} from 'chevrotain'


import {
  allTokens,
  Select,
  Where,
  From,
  Comma,
  Identifier,
  SelectLexer
} from '../../lib/lexer'

import {
  rule,
  RuleParser
} from 'chevrotain-rule-dsl'

export class SelectParser extends Parser {
  registry = {}

  constructor(input) {
    super(input, allTokens)
  }
}

const defaultOptions = {
    // logging: true
}

function createParser(text, options) {
  let lexingResult = SelectLexer.tokenize(text)
  let parser = new SelectParser(lexingResult)
  options = Object.assign(defaultOptions, options)
  return {
    rp: new RuleParser(parser, options),
    parser
  }
}

function check(parser) {
  if (parser.errors.length > 0) {
    throw new Error("sad sad panda, Parsing errors detected")
  }
}


test('or: string split', t => {
  let text = 'SELECT WHERE'
  let {
    rp,
    parser
  } = createParser(text)

  let selectRule = rp.createRule('orRule', [Select, {
    or: 'From Where'
  }], {
    logMap: {
        createRule: true
    }
  })
  // console.log('selectRule', selectRule)
  selectRule()
  check(parser)
  t.pass()
})


test('subrule by name', t => {
  let text = 'SELECT WHERE ,'
  let {
    rp,
    parser
  } = createParser(text)

  let commaRule = rp.createRule('commaRule', [Comma])
  let selectRule = rp.createRule('orRule', [
    'Select',
    'commaRule',
    {
      or: ['From', 'Where']
    }
  ])
  // console.log('selectRule', selectRule)
  selectRule()
  check(parser)
  t.pass()
})

test('subrule function', t => {
  let text = 'SELECT WHERE ,'
  let {
    rp,
    parser
  } = createParser(text)

  let commaRule = rp.createRule('commaRule', [Comma])
  let selectRule = rp.createRule('orRule', [
    Select,
    commaRule,
    {
      or: [From, Where]
    }
  ], {logging: true})
  // console.log('selectRule', selectRule)
  selectRule()
  check(parser)
  t.pass()
})

test('split text', t => {
  let text = 'SELECT WHERE ,'
  let {
    rp,
    parser
  } = createParser(text)

  let commaRule = rp.createRule('commaRule', [Comma])
  let splitRule = rp.createRule('orRule', [
    'Select commaRule',
    'From or Where'
  ])
  // console.log('selectRule', selectRule)
  splitRule()
  check(parser)
  t.pass()
})