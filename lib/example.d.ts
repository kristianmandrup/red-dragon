export declare function parseJson(text: any): {
    value: any;
    lexErrors: chevrotain.ILexingError[];
    parseErrors: chevrotain.exceptions.IRecognitionException[];
};
