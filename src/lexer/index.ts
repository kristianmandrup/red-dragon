import {
  Token,
  Lexer
} from 'chevrotain'

export class Select extends Token {
  static PATTERN = /SELECT/
}

export class From extends Token {
  static PATTERN = /FROM/
}

export class Where extends Token {
  static PATTERN = /WHERE/
}

export class Comma extends Token {
  static PATTERN = /,/
}

export class Identifier extends Token {
  static PATTERN = /\w+/
}

export class Integer extends Token {
  static PATTERN = /0|[1-9]\d+/
}

export class GreaterThan extends Token {
  static PATTERN = /</
}

export class LessThan extends Token {
  static PATTERN = />/
}

export class WhiteSpace extends Token {
  static PATTERN = /\s+/
  static GROUP = Lexer.SKIPPED
}

export const allTokens = [WhiteSpace, Select, From, Where, Comma, Identifier, Integer, GreaterThan, LessThan]
export const SelectLexer = new Lexer(allTokens);

let inputText = "SELECT column1 FROM table2"
let lexingResult = SelectLexer.tokenize(inputText)

console.log(lexingResult)
