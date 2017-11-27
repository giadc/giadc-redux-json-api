import * as pluralize from 'pluralize';
import * as R from 'ramda';
import { Attributes, ResourceObject, JsonApiResponseWithData } from 'ts-json-api';

import { iState } from './interfaces/state';
import { ensureArray, partializeEntity, reverseMergeDeepLeft } from './utils';

/**
 * Insert an Entity or group of Entities
 * into the state as well as any includes
 *
 * @param state
 * @param payload
 */
export const insertOrUpdateEntities = (
    state: iState,
    payload: JsonApiResponseWithData | ResourceObject | ResourceObject[]
): iState => {
    const entities = (<JsonApiResponseWithData>payload).data || [payload];
    const included = (<JsonApiResponseWithData>payload).included || [];

    return R.pipe(
        ensureArray,
        R.concat(included),
        R.reduce(insertOrUpdateEntity, state)
    )(entities);
};

/**
 * Insert a single Entity into the state
 *
 * @param state
 * @param entity
 */
const insertOrUpdateEntity = (state:iState = {}, entity: ResourceObject): iState => {
    validateEntity(entity);

    return R.over(
        R.lensPath([pluralize(entity.type), 'byId', entity.id]),
        reverseMergeDeepLeft(entity)
    )(state);
};

/**
 * Ensure that an Entity is well-formed
 *
 * @param  {Object} entity
 */
const validateEntity = (entity: ResourceObject) => {
    if (!('type' in entity)) {
        throw new Error('JSON API resource objects must have a `type` property');
    }

    if (!('id' in entity)) {
        throw new Error('JSON API resource objects must have an `id` property');
    }
};

/**
 * Insert an Entity into the state and
 * add it as a relationship to another Entity
 *
 * @param  {Object}         initialState
 * @param  {String}         entityKey
 * @param  {String}         entityId
 * @param  {String}         relationshipKey
 * @param  {Object|String}  relationshipObject  Can be either a valid JSON API object or a string ID
 * @return {Object}
 */
export const addRelationshipToEntity = (
    initialState: iState,
    entityKey: string,
    entityId: string,
    relationshipKey: string,
    relationshipObject: JsonApiResponseWithData | ResourceObject
): iState => {

    const wrappedRelationshipObject: JsonApiResponseWithData = (!(<JsonApiResponseWithData>relationshipObject).data)
        ? { data: <ResourceObject>relationshipObject }
        : <JsonApiResponseWithData>relationshipObject;

    if (Array.isArray(wrappedRelationshipObject.data)) {
        return wrappedRelationshipObject.data.reduce((carrier, singleItem) =>
            addRelationshipToEntity(carrier, entityKey, entityId, relationshipKey, singleItem),
            initialState
        );
    }

    const newState = insertOrUpdateEntities(initialState, wrappedRelationshipObject);
    const pluralEntityKey = pluralize(entityKey);

    const relationshipLens = R.lensPath([pluralEntityKey, 'byId', entityId, 'relationships', relationshipKey, 'data']);

    return R.over(
        relationshipLens,
        R.append(partializeEntity(wrappedRelationshipObject.data))
    )(newState);
};

/**
 * Remove a relationship an Entity
 *
 * @param  {Object} initialState
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} relationshipKey
 * @param  {String} relationshipId
 * @return {Object}
 */
export const removeRelationshipFromEntity = (
    initialState: iState,
    entityKey: string,
    entityId: string,
    relationshipKey: string,
    relationshipId: string
): iState => {
    const pluralEntityKey = pluralize(entityKey);
    const lens = R.lensPath([pluralEntityKey, 'byId', entityId, 'relationships', relationshipKey, 'data']);

    return R.over(
        lens,
        R.reject(R.propEq('id', relationshipId)),
        initialState
    );
};

/**
 * Update an Entity's attributes
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {Object} data
 * @return {Object}
 */
export const updateEntity = (
    state: iState,
    entityKey: string,
    entityId: string,
    data: ResourceObject | Attributes
) => {
    const attributeLens = R.lensPath([pluralize(entityKey), 'byId', entityId, 'attributes']),

    return R.over(
        attributeLens,
        reverseMergeDeepLeft(data)
    )(state);
};

/**
 * Update the meta data for an Entity group
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} metaKey
 * @param  {Mixed}  value
 * @return {Object}
 */
export const updateEntitiesMeta = (
    state: iState,
    entityKey: string,
    metaKey: string,
    value: any
): iState => {
    const pluralKey = pluralize(entityKey);
    return metaKey
        ? R.assocPath([pluralKey, 'meta', metaKey], value, state)
        : R.assocPath([pluralKey, 'meta'], value, state);
};

/**
 * Update the meta data for an Entity
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} metaKey
 * @param  {Mixed}  value
 * @return {Object}
 */
export const updateEntityMeta = (
    state: iState,
    entityKey: string,
    entityId: string,
    metaKey: string,
    value: any
): iState => {
    const pluralKey = pluralize(entityKey);
    return metaKey
        ? R.assocPath([pluralKey, 'byId', entityId, 'meta', metaKey], value, state)
        : R.assocPath([pluralKey, 'byId', entityId, 'meta'], value, state);
};

/**
 * Remove a single Entity
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} entityId
 * @return {Object}
 */
export const removeEntity = (state: iState, entityKey: string, entityId: string): iState => {
    const pluralKey = pluralize(entityKey);
    return R.dissocPath([pluralKey, 'byId', entityId], state);
};

/**
 * Clear all of the Entities out of an Entity type
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @return {Object}
 */
export const clearEntityType = (state: iState, entityKey: string): iState => {
    const pluralKey = pluralize(entityKey);
    return R.dissoc(pluralKey, state);
};
