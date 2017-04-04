import test from 'ava'
import {
  parseJson
} from '../lib/example'

test('typescript parser', t => {
  var inputText = '{ "arr": [1,2,3], "obj": {"num":666}}'
  var lexAndParseResult = parseJson(inputText)

  t.deepEqual(lexAndParseResult.lexErrors.length, 0)
  t.deepEqual(lexAndParseResult.parseErrors.length, 0)

  t.pass()
})