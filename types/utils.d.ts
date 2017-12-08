/// <reference types="ramda" />
/**
 * Ensure the given value is an array. If not, return it as a single-item array
 *
 * @param value
 */
export declare const ensureArray: (value: any) => any[];
/**
 * Ramda's mergeDeepRight with paramater order flipped
 */
export declare const reverseMergeDeepLeft: (arg1: {}, arg0?: any) => <B>(b: B) => any;
export declare const partializeEntity: <T, U>(obj: T) => U;
