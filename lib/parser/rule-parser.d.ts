export interface IResult {
    rule: any;
    code: string;
}
export declare class RuleParser {
    static registry: {};
    usedRules: {};
    _registry: {};
    code: any[];
    logging: boolean;
    $: any;
    constructor(parser: any, options?: {
        logging: boolean;
        registry: any;
    });
    parse(rule: any, options?: {}): IResult;
    protected parseList(rules: any, options?: {}): IResult;
    protected parseObj(rule: any, options?: {}): IResult;
    log(msg: any, ...args: any[]): void;
    findRule(name: any): any;
    readonly registry: {};
    register(name: any, rule: any): void;
    addCode(ruleCode: any): void;
    subrule(value: any, fun?: string): any;
    protected consume(value: any): IResult;
    protected alt(value: any): IResult;
    protected repeat(value: any): IResult;
    protected or(alternatives: any): IResult;
    protected option(value: any): IResult;
    protected rule(name: any, rules: any, config: any): IResult;
    createRule(name: string, rules: any, options: any): Function;
}
export declare function rule(parser: any, name: string, rules: any, options?: any): Function;
