import { Token } from 'chevrotain';
export declare class Select extends Token {
    static PATTERN: RegExp;
}
export declare class From extends Token {
    static PATTERN: RegExp;
}
export declare class Where extends Token {
    static PATTERN: RegExp;
}
export declare class Comma extends Token {
    static PATTERN: RegExp;
}
export declare class Identifier extends Token {
    static PATTERN: RegExp;
}
export declare class Integer extends Token {
    static PATTERN: RegExp;
}
export declare class GreaterThan extends Token {
    static PATTERN: RegExp;
}
export declare class LessThan extends Token {
    static PATTERN: RegExp;
}
export declare class WhiteSpace extends Token {
    static PATTERN: RegExp;
    static GROUP: any;
}
export declare const allTokens: typeof Select[];
export declare const SelectLexer: any;
