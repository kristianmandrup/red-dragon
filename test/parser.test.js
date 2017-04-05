import test from 'ava'
import {
  SelectParser
} from '../lib/parser'

import {
  SelectLexer
} from '../lib/lexer'

function parseInput(text) {
  let lexingResult = SelectLexer.tokenize(text)
  let parser = new SelectParser(lexingResult.tokens);
  parser.selectStatement()

  if (parser.errors.length > 0) {
    throw new Error("sad sad panda, Parsing errors detected")
  }
}

test('parser', t => {
  let inputText = "SELECT column1 FROM table2"
  parseInput(inputText)

  t.pass()
})