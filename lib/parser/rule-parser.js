"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RuleParser = (function () {
    function RuleParser(parser, options) {
        if (options === void 0) { options = { logging: true }; }
        this.usedRules = {};
        this.$ = parser;
        this.usedRules = {};
        this.logging = options.logging;
    }
    RuleParser.prototype.parse = function (rule) {
        if (Array.isArray(rule)) {
            return this.parseList(rule);
        }
        if (typeof rule === 'object') {
            return this.parseObj(rule);
        }
        if (typeof rule === 'function') {
            return rule;
        }
        throw new Error("Invalid rule(s) " + typeof rule);
    };
    RuleParser.prototype.parseList = function (rules) {
        var _this = this;
        return function () {
            rules.map(function (rule) { return _this.parse(rule); });
        };
    };
    RuleParser.prototype.parseObj = function (rule) {
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
            return RuleParser.registry;
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
    RuleParser.prototype.consume = function (value) {
        return this.$.CONSUME(value);
    };
    RuleParser.prototype.alt = function (value) {
        return { ALT: this.parseObj(value) };
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
        return this.parseList(alternatives);
    };
    RuleParser.prototype.option = function (value) {
        var rule = (typeof value === 'string') ? this.findRule[value] : value;
        if (typeof rule !== 'function') {
            throw new Error("option must be function, was " + typeof rule);
        }
        this.$.OPTION(rule);
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