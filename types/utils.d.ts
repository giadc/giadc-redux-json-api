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
/**
 * Reduce an Entity to its `id` and `type`
 */
export declare const partializeEntity: <T, U>(obj: T) => U;
/**
 * Remove an object's wrapping `data` prop, if it exists
 */
export declare const unwrapDataProp: (a: any) => any;
/**
 * Apply a function in a map if the given data is an array.
 * Otherwise, simply apply it once to the data
 *
 * @param func Function to perform
 */
export declare const mapOrOnce: (...a: any[]) => any;
/**
 * If the given data is an array, concat it.
 * If it is a single item, append it.
 */
export declare const appendOrConcat: (a: any) => any;
