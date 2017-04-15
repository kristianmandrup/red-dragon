"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chevrotain_1 = require("chevrotain");
var RuleParser = (function () {
    function RuleParser(parser, options) {
        if (options === void 0) { options = { logging: true, registry: null }; }
        this.usedRules = {};
        this._registry = {};
        this.$ = parser;
        this.usedRules = {};
        this.logging = options.logging;
        this._registry = parser.registry || options.registry || RuleParser.registry;
    }
    RuleParser.prototype.parse = function (rule, options) {
        if (options === void 0) { options = {}; }
        if (Array.isArray(rule)) {
            return this.parseList(rule, options);
        }
        if (rule.prototype instanceof chevrotain_1.Token) {
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
            return rule;
        }
        throw new Error("Invalid rule(s) " + typeof rule);
    };
    RuleParser.prototype.parseList = function (rules, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return function () {
            rules.map(function (rule) { return _this.parse(rule, options); });
        };
    };
    RuleParser.prototype.parseObj = function (rule, options) {
        if (options === void 0) { options = {}; }
        function isRepeat(value) {
            return value.repeat || value.sep || value.min || value.def;
        }
        function isAlt(value) {
            return value && value.parent === 'or';
        }
        var key = Object.keys(rule)[0];
        var value = rule[key];
        if (typeof value === 'object') {
            if (isAlt(options)) {
                return this.alt(value);
            }
            if (isRepeat(value)) {
                return this.repeat(value);
            }
        }
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
    RuleParser.prototype.subrule = function (value, fun) {
        if (fun === void 0) { fun = 'SUBRULE'; }
        this.log('subrule', value);
        var rule = (typeof value === 'string') ? this.findRule(value) : value;
        if (typeof rule !== 'function') {
            console.warn('Not yet registered, evaluate later...', rule, value, this.findRule(value), Object.keys(this.registry));
            // throw new Error(`subrule must be function, was ${typeof rule}`)
        }
        // auto-detect reuse of subrule!
        if (this.usedRules[fun]) {
            this.log('repeat rule');
            fun = 'SUBRULE2';
        }
        this.usedRules[fun] = true;
        return this.$[fun](rule);
    };
    // must be a Token
    RuleParser.prototype.consume = function (value) {
        return this.$.CONSUME(value);
    };
    RuleParser.prototype.alt = function (value) {
        return { ALT: this.parse(value) };
    };
    RuleParser.prototype.repeat = function (value) {
        var rule = {
            SEP: '',
            DEF: function () { }
        };
        var prefix = value.min > 0 ? 'AT_LEAST_ONE' : 'MANY';
        var postfix = value.sep ? 'SEP' : null;
        var fun = postfix ? [prefix, postfix].join('_') : prefix;
        rule.SEP = value.sep || value.separator;
        var def = value.rule || value.def;
        var definition = this.parse(def);
        rule.DEF = definition;
        return this.$[fun](rule);
    };
    RuleParser.prototype.or = function (alternatives) {
        return this.parseList(alternatives, { parent: 'or' });
    };
    RuleParser.prototype.option = function (value) {
        var rule = (typeof value === 'string') ? this.findRule[value] : value;
        if (typeof rule !== 'function') {
            throw new Error("option must be function, was " + typeof rule);
        }
        var parsedRule = this.parse(rule);
        this.$.OPTION(parsedRule);
    };
    RuleParser.prototype.rule = function (name, rules) {
        if (typeof name !== 'string') {
            throw new Error("rule name must be a valid name (string), was " + name);
        }
        return this.$.RULE(name, rules);
    };
    RuleParser.prototype.createRule = function (name, rules) {
        var parsedRule = this.rule(name, this.parse(rules));
        this.register(name, parsedRule);
        return parsedRule;
    };
    return RuleParser;
}());
RuleParser.registry = {};
exports.RuleParser = RuleParser;
function rule(parser, name, rules, options) {
    var rule = new RuleParser(parser, options).createRule(name, rules);
    return rule;
}
exports.rule = rule;
//# sourceMappingURL=rule-parser.js.map