import { Token, Parser } from 'chevrotain';
export declare class SelectParser extends Parser {
    registry: {};
    constructor(input: Token[]);
    selectClause: Function;
    selectStatement: Function;
    fromClause: Function;
    whereClause: Function;
    atomicExpression: Function;
    relationalOperator: Function;
    expression: Function;
}
