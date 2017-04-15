import {
  Parser,
  Token
} from 'chevrotain'

import {
  Identifier,
} from '../lexer'

export class RuleParser {
  static registry = {}
  usedRules = {}
  _registry = {}
  logging: boolean
  $: any

  constructor(parser, options = { logging: true, registry: null }) {
    this.$ = parser
    this.usedRules = {}
    this.logging = options.logging
    this._registry = parser.registry || options.registry || RuleParser.registry
  }

  parse(rule, options = {}) {
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
      return rule
    }
    throw new Error(`Invalid rule(s) ${typeof rule}`)
  }

  parseList(rules, options = {}) {
    this.log('parseList', rules, options)
    return () => {
      rules.map(rule => this.parse(rule, options))
    }
  }

  parseObj(rule, options = {}) {
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

  subrule(value, fun = 'SUBRULE') {
    this.log('subrule', value)
    let rule = (typeof value === 'string') ? this.findRule(value) : value
    if (typeof rule !== 'function') {
      console.warn('Not yet registered, evaluate later...', rule, value, this.findRule(value), Object.keys(this.registry))
      // throw new Error(`subrule must be function, was ${typeof rule}`)
    }
    // auto-detect reuse of subrule!
    if (this.usedRules[fun]) {
      this.log('repeat rule')
      fun = 'SUBRULE2'
    }
    this.usedRules[fun] = true
    return this.$[fun](rule)
  }

  // must be a Token
  consume(value) {
    this.log('consume', value)
    return this.$.CONSUME(value)
  }

  alt(value) {
    this.log('alt', value)
    return { ALT: this.parse(value) }
  }

  repeat(value) {
    this.log('repeat', value)
    let rule = {
      SEP: '',
      DEF: () => { }
    }
    let prefix = value.min > 0 ? 'AT_LEAST_ONE' : 'MANY'
    let postfix = value.sep ? 'SEP' : null
    let fun = postfix ? [prefix, postfix].join('_') : prefix

    this.log('type', fun)

    rule.SEP = value.sep || value.separator
    this.log('separator', rule.SEP)

    let def = value.rule || value.def
    this.log('def:', def)
    let definition = () => this.parse(def)
    this.log('definition', definition)

    rule.DEF = () => {
      this.$.CONSUME(Identifier)
    }

    this.log('repeat rule:', fun, rule)
    return this.$[fun](rule)
  }

  or(alternatives) {
    this.log('or', alternatives)
    return this.parseList(alternatives, { parent: 'or' })
  }

  option(value) {
    this.log('option', value)
    let rule = (typeof value === 'string') ? this.findRule[value] : value
    if (typeof rule !== 'function') {
      throw new Error(`option must be function, was ${typeof rule}`)
    }
    let parsedRule = this.parse(rule)
    this.$.OPTION(parsedRule)
  }

  rule(name, rules, config) {
    this.log('rule', name, rules)
    if (typeof name !== 'string') {
      throw new Error(`rule name must be a valid name (string), was ${name}`)
    }
    return this.$.RULE(name, rules, config)
  }

  createRule(name: string, rules, options) {
    let parsedRule = this.rule(name, this.parse(rules, options), options)
    this.register(name, parsedRule)
    return parsedRule
  }
}

export function rule(parser, name: string, rules, options?): Function {
  let rule = new RuleParser(parser, options).createRule(name, rules, options)
  return rule
}