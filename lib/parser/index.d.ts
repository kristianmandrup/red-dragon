import { Token, Parser } from 'chevrotain';
export declare class SelectParser extends Parser {
    registry: {};
    constructor(input: Token[]);
    selectStatement: any;
    selectClause: any;
    fromClause: any;
    whereClause: any;
    relationalOperator: any;
    expression: any;
    atomicExpression: any;
}
