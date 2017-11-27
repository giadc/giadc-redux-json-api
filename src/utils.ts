import {
    compose,
    evolve,
    flip,
    map,
    mergeDeepRight,
    pick,
    pipe,
    prop,
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

export const partializeEntity = pick(['id', 'type']);
