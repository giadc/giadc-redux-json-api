import * as pluralize from 'pluralize';
import * as R from 'ramda';
import { Entity, iAttributes, iResourceObject, JsonApiResponse, iJsonApiResponseWithData } from 'ts-json-api';

import { iState } from './interfaces/state';
import { isObject } from 'util';

/**
 * Grab an Entity from the state
 *
 * @param  {Object} state
 * @param  {String} key
 * @param  {String} id
 * @return {Object}
 */
export const getEntity = (state: iState, key: string, id: string) => {
    const pluralKey = pluralize(key);
    return R.path([pluralKey, 'byId', id], state) as iResourceObject;
};

/**
 * Get an array of Entities from the state
 */
export const getEntities = (state: iState, key: string, ids: string[] | null = null): iResourceObject[] => {
    const pluralKey = pluralize(key);

    if (ids === null) {
        return R.pipe(
            R.pathOr({}, [pluralKey, 'byId']),
            R.values
        )(state);
    }

    const isUndefined = (value: any) => typeof value === 'undefined';

    return R.pipe(
        R.pathOr({}, [key, 'byId']),
        R.props(ids),
        R.reject(isUndefined)
    )(state) as iResourceObject[];
};

/**
 * Grab the ID from JSON API response containing a single Entity
 *
 * @param  {Object} jsonData
 * @return {String}
 */
export const getId = R.path(['data', 'id']);

/**
 * Grab the ID's from a JSON API response containing an array of Entities
 *
 * @param  {Object} jsonData
 * @return {Array}
 */
export const getIds = R.pipe(
    R.prop('data'),
    R.map(R.prop('id'))
);

/**
 * Grab an Entity group's meta data from the state
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} metaKey
 * @return {Mixed}
 */
export const getEntitiesMeta = (state: iState, entityKey: string, metaKey: string | null = null) => (
    (metaKey === null)
        ? R.path([entityKey, 'meta'], state)
        : R.path([entityKey, 'meta', metaKey], state)
);

/**
 * Grab an Entity's meta data from the state
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} metaKey
 * @return {Mixed}
 */
export const getEntityMeta = (
    state: iState,
    entityKey: string,
    entityId: string,
    metaKey: string | null = null
) => (
    (metaKey === null)
        ? R.path([entityKey, 'byId', entityId, 'meta'], state)
        : R.path([entityKey, 'byId', entityId, 'meta', metaKey], state)
);
