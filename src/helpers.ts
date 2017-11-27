import * as pluralize from 'pluralize';
import * as R from 'ramda';
import { Entity, ResourceObject, JsonApiResponse, JsonApiResponseWithData, Attributes } from 'ts-json-api';
import * as uuid from 'uuid';

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
    const entity = R.path([pluralKey, 'byId', id], state) as ResourceObject;

    return (entity === undefined)
        ? undefined
        : new Entity(entity);
};

/**
 * Get an array of Entities from the state
 */
export const getEntities = (state: iState, key: string, ids: string[] | null = null): Entity[] => {
    const pluralKey = pluralize(key);

    if (ids === null) {
        return R.pipe(
            R.pathOr({}, [pluralKey, 'byId']),
            R.values,
            R.map(convertToEntityObject)
        )(state);
    }

    const isUndefined = (value: any) => typeof value === 'undefined';

    return R.pipe(
        R.pathOr({}, [key, 'byId']),
        R.props(ids),
        R.reject(isUndefined),
        R.map(convertToEntityObject),
    )(state);
};

/**
 * Grab the ID from JSON API response containing a single Entity
 *
 * @param  {Object} jsonData
 * @return {String}
 */
export const getId = (jsonData: JsonApiResponseWithData): string =>
    (<ResourceObject>jsonData.data).id;

/**
 * Grab the ID's from a JSON API response containing an array of Entities
 *
 * @param  {Object} jsonData
 * @return {Array}
 */
export const getIds = (jsonData: JsonApiResponseWithData): string[] =>
    (<ResourceObject[]>jsonData.data).map(entity => entity.id);

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

const convertToEntityObject = (entity: ResourceObject) => new Entity(entity);
