import { Token, Parser } from 'chevrotain';
export declare class SelectParser extends Parser {
    constructor(input: Token[]);
    selectStatement: (idxInCallingRule?: number, ...args: any[]) => any;
    selectClause: (idxInCallingRule?: number, ...args: any[]) => any;
    fromClause: (idxInCallingRule?: number, ...args: any[]) => any;
    whereClause: (idxInCallingRule?: number, ...args: any[]) => any;
    expression: (idxInCallingRule?: number, ...args: any[]) => any;
    atomicExpression: (idxInCallingRule?: number, ...args: any[]) => any;
    relationalOperator: (idxInCallingRule?: number, ...args: any[]) => any;
}
