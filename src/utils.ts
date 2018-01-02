import {
    append, compose, concat, curry, curryN, evolve, ifElse, flip, has,
    identity, map, mergeDeepRight, pick, pipe, prop,
} from 'ramda';

/**
 * Ensure the given value is an array. If not, return it as a single-item array
 *
 * @param value
 */
export const ensureArray = (value: any) => Array.isArray(value) ? value : [value];

/**
 * Ramda's mergeDeepRight with paramater order flipped
 */
export const reverseMergeDeepLeft = flip(mergeDeepRight);

/**
 * Reduce an Entity to its `id` and `type`
 */
export const partializeEntity = pick(['id', 'type']);

/**
 * Remove an object's wrapping `data` prop, if it exists
 */
export const unwrapDataProp = ifElse(
    has('data'),
    prop('data'),
    identity,
);

/**
 * Apply a function in a map if the given data is an array.
 * Otherwise, simply apply it once to the data
 *
 * @param func Function to perform
 */
export const mapOrOnce = curryN(
    2,
    (func: (input: any) => any, value: any) => ifElse(
        Array.isArray,
        map(func),
        func
    )(value)
);

/**
 * If the given data is an array, concat it.
 * If it is a single item, append it.
 */
export const appendOrConcat = ifElse(
    Array.isArray,
    concat,
    append
);