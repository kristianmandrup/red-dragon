"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chevrotain_1 = require("chevrotain");
function codeOf(value) {
    return typeof value === 'function' ? value.name : new String(value);
}
var RuleParser = (function () {
    function RuleParser(parser, options) {
        if (options === void 0) { options = { logging: false, registry: null }; }
        this.usedRules = {};
        this._registry = {};
        this.code = [];
        if (!(parser instanceof chevrotain_1.Parser)) {
            console.error('parser', parser);
            throw new Error('RuleParser must be created with a Parser instance');
        }
        this.$ = parser;
        this.usedRules = {};
        this.logging = options.logging;
        this._registry = parser.registry || options.registry || RuleParser.registry;
    }
    RuleParser.prototype.parse = function (rule, options) {
        if (options === void 0) { options = {}; }
        this.log('parse', rule, options);
        if (Array.isArray(rule)) {
            return this.parseList(rule, options);
        }
        if (rule.prototype instanceof chevrotain_1.Token) {
            this.log('consume since rule is token', rule);
            return this.consume(rule);
        }
        if (typeof rule === 'object') {
            return this.parseObj(rule, options);
        }
        // if string, always assume subrule
        if (typeof rule === 'string') {
            return this.subrule(rule);
        }
        if (typeof rule === 'function') {
            return { rule: rule, code: rule.name };
        }
        throw new Error("Invalid rule(s) " + typeof rule);
    };
    RuleParser.prototype.parseList = function (rules, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.log('parseList', rules, options);
        var parsedRules = rules.map(function (rule) { return _this.parse(rule, options); });
        var codeStmts = parsedRules.map(function (pr) { return pr.code; }).join('\n');
        this.log('parsedRules', parsedRules);
        this.log('codeStmts', codeStmts);
        var rule = function () {
            parsedRules.map(function (pr) { return pr.rule(); });
        };
        this.log('rule', rule);
        var code = '() => {\n' + codeStmts + '\n}\n';
        var result = {
            rule: rule,
            code: code
        };
        this.log('parsedList', result);
        return result;
    };
    RuleParser.prototype.parseObj = function (rule, options) {
        if (options === void 0) { options = {}; }
        this.log('parseObj', rule, options);
        function isRepeat(value) {
            return value.repeat || value.sep || value.min || value.def;
        }
        function isAlt(value) {
            return value && value.parent === 'or';
        }
        if (isAlt(options)) {
            return this.alt(rule);
        }
        if (isRepeat(rule)) {
            return this.repeat(rule);
        }
        var key = Object.keys(rule)[0];
        var value = rule[key];
        switch (key) {
            case 'rule':
                return this.subrule(value);
            case 'rule2':
                return this.subrule(value, 'SUBRULE2');
            case 'option':
                return this.option(value);
            case 'consume':
                return this.consume(value);
            case 'repeat':
                return this.repeat(value);
            case 'alt':
                return this.alt(value);
            case 'or':
                return this.or(value);
            default:
                throw new Error("Unknown key in rule object: " + key);
        }
    };
    RuleParser.prototype.log = function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.logging) {
            console.log.apply(console, [msg].concat(args));
        }
    };
    RuleParser.prototype.findRule = function (name) {
        return this.registry[name];
    };
    Object.defineProperty(RuleParser.prototype, "registry", {
        get: function () {
            return this._registry;
        },
        enumerable: true,
        configurable: true
    });
    RuleParser.prototype.register = function (name, rule) {
        this.registry[name] = rule;
    };
    RuleParser.prototype.addCode = function (ruleCode) {
        this.code.push(ruleCode);
    };
    RuleParser.prototype.subrule = function (value, fun) {
        var _this = this;
        if (fun === void 0) { fun = 'SUBRULE'; }
        this.log('subrule', value);
        var _rule = (typeof value === 'string') ? this.findRule(value) : value;
        if (typeof _rule !== 'function') {
            console.warn('Not yet registered, evaluate later...', _rule, value, this.findRule(value), Object.keys(this.registry));
            // throw new Error(`subrule must be function, was ${typeof rule}`)
        }
        // auto-detect reuse of subrule!
        if (this.usedRules[fun]) {
            this.log('repeat rule');
            fun = 'SUBRULE2';
        }
        this.usedRules[fun] = true;
        var code = "$." + fun + "(" + _rule + ')';
        var rule = function () { return _this.$[fun](rule); };
        return { rule: rule, code: code };
    };
    // must be a Token
    RuleParser.prototype.consume = function (value) {
        this.log('consume', value);
        var code = '$.CONSUME(' + codeOf(value) + ')';
        var $ = this.$;
        var rule = function () { return $.CONSUME(value).bind($); };
        var result = { rule: rule, code: code };
        this.log('consumed', result);
        return result;
    };
    RuleParser.prototype.alt = function (value) {
        this.log('alt', value);
        var parsedRule = this.parse(value);
        var code = '{ALT: ' + parsedRule.code + '}';
        var rule = { ALT: parsedRule.rule };
        return { rule: rule, code: code };
    };
    RuleParser.prototype.repeat = function (value) {
        this.log('repeat', value);
        var rep = {
            SEP: '',
            DEF: function () { }
        };
        var prefix = value.min > 0 ? 'AT_LEAST_ONE' : 'MANY';
        var postfix = value.sep ? 'SEP' : null;
        var fun = postfix ? [prefix, postfix].join('_') : prefix;
        this.log('type', fun);
        rep.SEP = value.sep || value.separator;
        this.log('separator', rep.SEP);
        var def = value.rule || value.def;
        this.log('def:', def);
        var definition = this.parse(def);
        this.log('definition', definition);
        rep.DEF = function () { return definition.rule; };
        var codeRep = {
            SEP: rep.SEP,
            DEF: definition.code
        };
        this.log('repeat rule:', fun, rep);
        var rule = this.$[fun](rep);
        var code = ("$." + fun + "(" + codeRep + ')');
        return { rule: rule, code: code };
    };
    RuleParser.prototype.or = function (alternatives) {
        var _this = this;
        this.log('or', alternatives);
        var parsed = this.parseList(alternatives, { parent: 'or' });
        var code = '$.OR([' + parsed.code + '])';
        var rule = function () { return _this.$.OR(parsed.rule); };
        return { rule: rule, code: code };
    };
    RuleParser.prototype.option = function (value) {
        var _this = this;
        this.log('option', value);
        var _rule = (typeof value === 'string') ? this.findRule[value] : value;
        var parsed = this.parse(_rule);
        if (typeof parsed.rule !== 'function') {
            throw new Error("option must be function, was " + typeof parsed.rule);
        }
        var rule = function () { return _this.$.OPTION(parsed.rule); };
        var code = parsed.code;
        return { rule: rule, code: code };
    };
    RuleParser.prototype.rule = function (name, rules, config) {
        this.log('rule', name, rules);
        if (typeof name !== 'string') {
            throw new Error("rule name must be a valid name (string), was " + name);
        }
        var $ = this.$;
        var rule = function () { return $.RULE(name, rules.rule, config).bind($); };
        return rule;
    };
    RuleParser.prototype.createRule = function (name, rules, options) {
        options = options || {};
        var parsed = this.parse(rules, options);
        this.log('createRule: parsedRule', parsed.rule);
        options.code = options.code || parsed.code;
        this.codeStr = parsed.code;
        this.log('createRule: parsedCode', parsed.code);
        var parsedRule = this.rule(name, parsed.rule, options);
        this.log('createRule: rule', parsedRule);
        this.register(name, parsedRule);
        return parsedRule;
    };
    return RuleParser;
}());
RuleParser.registry = {};
exports.RuleParser = RuleParser;
function rule(parser, name, rules, options) {
    return new RuleParser(parser, options).createRule(name, rules, options);
}
exports.rule = rule;
//# sourceMappingURL=rule-parser.js.map