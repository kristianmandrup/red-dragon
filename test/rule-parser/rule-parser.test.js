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

function createParser(text, options) {
  let lexingResult = SelectLexer.tokenize(text)
  let parser = new SelectParser(lexingResult)
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


test('obj consume', t => {
  let text = 'SELECT'
  let {
    rp,
    parser
  } = createParser(text)
  let config = {
    logging: true,
    code: `() => {
      this.CONSUME(Select)
    }`
  }
  let selectRule = rp.createRule('consumeObjRule', [{
    consume: Select
  }], {logging: true})
  // console.log('selectRule', selectRule)
  selectRule()
  check(parser)
  t.pass()
})

test('consume token', t => {
  let text = 'SELECT'
  let {
    rp,
    parser
  } = createParser(text)

  let selectRule = rp.createRule('consumeTokenRule', [Select])
  // console.log('selectRule', selectRule)
  selectRule()
  check(parser)
  t.pass()
})

test('option obj', t => {
  let text = 'SELECT WHERE'
  let {
    rp,
    parser
  } = createParser(text)

  let selectRule = rp.createRule('optionObjRule', [Select, {
    option: {
      consume: Where
    }
  }])
  // console.log('selectRule', selectRule)
  selectRule()
  check(parser)
  t.pass()
})

// test('option token', t => {
//   let text = 'SELECT WHERE'
//   let {
//     rp,
//     parser
//   } = createParser(text)

//   let selectRule = rp.createRule('optionTokenRule', [Select, {
//     option: Where
//   }], {logging: true})
//   // console.log('selectRule', selectRule)
//   selectRule()
//   check(parser)
//   t.pass()
// })

// test('or', t => {
//   let text = 'SELECT WHERE'
//   let {
//     rp,
//     parser
//   } = createParser(text)

//   let selectRule = rp.createRule('orRule', [Select, {
//     or: [
//       'From',
//       'Where'
//     ]
//   }])
//   // console.log('selectRule', selectRule)
//   selectRule()
//   check(parser)
//   t.pass()
// })
