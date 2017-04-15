import {
  Parser,
  Token
} from 'chevrotain'

import {
  Identifier,
} from '../lexer'

export interface IResult {
  rule: any
  code: string
}

function codeOf(value) {
  return typeof value === 'function' ? value.name : new String(value)
}

export class RuleParser {
  static registry = {}
  usedRules = {}
  _registry = {}
  code = []
  public codeStr: string
  logging: boolean
  $: any

  constructor(parser, options = { logging: false, registry: null }) {
    if (!(parser instanceof Parser)) {
      console.error('parser', parser)
      throw new Error('RuleParser must be created with a Parser instance')
    }
    this.$ = parser
    this.usedRules = {}
    this.logging = options.logging
    this._registry = parser.registry || options.registry || RuleParser.registry
  }

  parse(rule, options = {}): IResult {
    this.log('parse', rule, options)

    if (Array.isArray(rule)) {
      return this.parseList(rule, options)
    }
    if (rule.prototype instanceof Token) {
      this.log('consume since rule is token', rule)
      return this.consume(rule)
    }

    if (typeof rule === 'object') {
      return this.parseObj(rule, options)
    }
    // if string, always assume subrule
    if (typeof rule === 'string') {
      return this.subrule(rule)
    }
    if (typeof rule === 'function') {
      return { rule, code: rule.name }
    }
    throw new Error(`Invalid rule(s) ${typeof rule}`)
  }

  protected parseList(rules, options = {}): IResult {
    this.log('parseList', rules, options)
    let parsedRules = rules.map(rule => this.parse(rule, options))
    let codeStmts = parsedRules.map(pr => pr.code).join('\n')

    this.log('parsedRules', parsedRules)
    this.log('codeStmts', codeStmts)
    let rule = () => {
      parsedRules.map(pr => pr.rule())
    }
    this.log('rule', rule)
    let code = '() => {\n' + codeStmts + '\n}\n'
    let result = {
      rule,
      code
    }
    this.log('parsedList', result)
    return result
  }

  protected parseObj(rule, options = {}): IResult {
    this.log('parseObj', rule, options)

    function isRepeat(value) {
      return value.repeat || value.sep || value.min || value.def
    }
    function isAlt(value) {
      return value && value.parent === 'or'
    }

    if (isAlt(options)) {
      return this.alt(rule)
    }

    if (isRepeat(rule)) {
      return this.repeat(rule)
    }

    let key = Object.keys(rule)[0]
    let value = rule[key]

    switch (key) {
      case 'rule':
        return this.subrule(value)
      case 'rule2':
        return this.subrule(value, 'SUBRULE2')
      case 'option':
        return this.option(value)
      case 'consume':
        return this.consume(value)
      case 'repeat':
        return this.repeat(value)
      case 'alt':
        return this.alt(value)
      case 'or':
        return this.or(value)
      default:
        throw new Error(`Unknown key in rule object: ${key}`)
    }
  }

  log(msg, ...args) {
    if (this.logging) {
      console.log(msg, ...args)
    }
  }

  findRule(name) {
    return this.registry[name]
  }

  get registry() {
    return this._registry
  }

  register(name, rule) {
    this.registry[name] = rule
  }

  addCode(ruleCode) {
    this.code.push(ruleCode)
  }

  subrule(value, fun = 'SUBRULE') {
    this.log('subrule', value)
    let _rule = (typeof value === 'string') ? this.findRule(value) : value
    if (typeof _rule !== 'function') {
      console.warn('Not yet registered, evaluate later...', _rule, value, this.findRule(value), Object.keys(this.registry))
      // throw new Error(`subrule must be function, was ${typeof rule}`)
    }
    // auto-detect reuse of subrule!
    if (this.usedRules[fun]) {
      this.log('repeat rule')
      fun = 'SUBRULE2'
    }
    this.usedRules[fun] = true
    let code = `$.${fun}(` + _rule + ')'
    let rule = () => this.$[fun](rule)
    return { rule, code }
  }

  // must be a Token
  protected consume(value): IResult {
    this.log('consume', value)
    let code = '$.CONSUME(' + codeOf(value) + ')'
    let $ = this.$
    let rule = () => $.CONSUME(value).bind($)
    let result = { rule, code }
    this.log('consumed', result)
    return result
  }

  protected alt(value): IResult {
    this.log('alt', value)
    let parsedRule = this.parse(value)
    let code = '{ALT: ' + parsedRule.code + '}'
    let rule = { ALT: parsedRule.rule }
    return { rule, code }
  }

  protected repeat(value): IResult {
    this.log('repeat', value)
    let rep = {
      SEP: '',
      DEF: () => { }
    }
    let prefix = value.min > 0 ? 'AT_LEAST_ONE' : 'MANY'
    let postfix = value.sep ? 'SEP' : null
    let fun = postfix ? [prefix, postfix].join('_') : prefix

    this.log('type', fun)

    rep.SEP = value.sep || value.separator
    this.log('separator', rep.SEP)

    let def = value.rule || value.def
    this.log('def:', def)
    let definition = this.parse(def)
    this.log('definition', definition)

    rep.DEF = () => definition.rule
    let codeRep = {
      SEP: rep.SEP,
      DEF: definition.code
    }
    this.log('repeat rule:', fun, rep)
    let rule = this.$[fun](rep)
    let code = (`$.${fun}(` + codeRep + ')')
    return { rule, code }
  }

  protected or(alternatives): IResult {
    this.log('or', alternatives)
    let parsed = this.parseList(alternatives, { parent: 'or' })
    let code = '$.OR([' + parsed.code + '])'
    let rule = () => this.$.OR(parsed.rule)
    return { rule, code }
  }

  protected option(value): IResult {
    this.log('option', value)
    let _rule = (typeof value === 'string') ? this.findRule[value] : value
    let parsed = this.parse(_rule)
    if (typeof parsed.rule !== 'function') {
      throw new Error(`option must be function, was ${typeof parsed.rule}`)
    }

    let rule = () => this.$.OPTION(parsed.rule)
    let code = parsed.code
    return { rule, code }
  }

  protected rule(name, rules, config): Function {
    this.log('rule', name, rules)
    if (typeof name !== 'string') {
      throw new Error(`rule name must be a valid name (string), was ${name}`)
    }
    let $ = this.$
    let rule = () => $.RULE(name, rules.rule, config).bind($)
    // let code = 'this.$.RULE(' + rules.code + ')'
    return rule
  }

  public createRule(name: string, rules, options): Function {
    options = options || {}
    let parsed = this.parse(rules, options)
    this.log('createRule: parsedRule', parsed.rule)
    options.code = options.code || parsed.code
    this.codeStr = parsed.code
    this.log('createRule: parsedCode', parsed.code)
    let parsedRule = this.rule(name, parsed.rule, options)
    this.log('createRule: parsedRule', parsedRule)
    this.register(name, parsedRule)
    return parsedRule
  }
}

export function rule(parser, name: string, rules, options?): Function {
  return new RuleParser(parser, options).createRule(name, rules, options)
}