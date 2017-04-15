export declare class RuleParser {
    static registry: {};
    usedRules: {};
    _registry: {};
    logging: boolean;
    $: any;
    constructor(parser: any, options?: {
        logging: boolean;
        registry: any;
    });
    parse(rule: any): any;
    parseList(rules: any): () => void;
    parseObj(rule: any): any;
    log(msg: any, ...args: any[]): void;
    findRule(name: any): any;
    readonly registry: {};
    register(name: any, rule: any): void;
    subrule(value: any, fun?: string): any;
    consume(value: any): any;
    alt(value: any): any;
    repeat(value: any): any;
    or(alternatives: any): () => void;
    option(value: any): void;
    rule(name: any, rules: any): any;
    createRule(name: string, rules: any): any;
}
export declare function rule(parser: any, name: string, rules: any, options?: any): Function;
