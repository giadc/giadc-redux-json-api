import * as pluralize from 'pluralize';
import * as R from 'ramda';
import { iAttributes, iResourceObject, iJsonApiResponseWithData } from 'ts-json-api';

import { iState } from './interfaces/state';
import { FlexiblePayload } from './interfaces/other';
import { appendOrConcat, ensureArray, mapOrOnce, partializeEntity, reverseMergeDeepLeft, unwrapDataProp } from './utils';

/**
 * Insert an Entity or group of Entities
 * into the state as well as any includes
 *
 * @param state
 * @param payload
 */
export const insertOrUpdateEntities = (
    state: iState,
    payload: FlexiblePayload
): iState => {
    const included: iResourceObject[] = R.propOr([], 'included', payload);

    return R.pipe(
        unwrapDataProp,
        ensureArray,
        R.concat(included),
        R.reduce(insertOrUpdateEntity, state)
    )(payload);
};

/**
 * Insert a single Entity into the state
 *
 * @param state
 * @param entity
 */
const insertOrUpdateEntity = (state: iState = {}, entity: iResourceObject): iState => {
    validateEntity(entity);

    return R.over(
        R.lensPath([pluralize(entity.type), 'byId', entity.id]),
        reverseMergeDeepLeft(entity),
        state,
    );
};

/**
 * Ensure that an Entity is well-formed
 *
 * @param  {Object} entity
 */
const validateEntity = (entity: iResourceObject) => {
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
    relationshipObject: FlexiblePayload
): iState => {
    const unwrappedRelationshipObject = unwrapDataProp(relationshipObject);
    const newState = insertOrUpdateEntities(initialState, unwrappedRelationshipObject);

    const pluralEntityKey = pluralize(entityKey);
    const simplifiedEntities = mapOrOnce(partializeEntity, unwrappedRelationshipObject);

    return R.over(
        R.lensPath([pluralEntityKey, 'byId', entityId, 'relationships', relationshipKey, 'data']),
        appendOrConcat(simplifiedEntities),
        newState
    );
};

/**
 * Remove a relationship an Entity
 *
 * @param  initialState
 * @param  entityKey  Type of entity on which to set relationship
 * @param  entityId  ID of entity on which to set relationship
 * @param  relationshipKey  Name of the relationship
 * @param  relationshipId  Id of the relationship object
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

    return R.over(
        R.lensPath([pluralEntityKey, 'byId', entityId, 'relationships', relationshipKey, 'data']),
        R.reject(R.propEq('id', relationshipId)),
        initialState
    );
};

/**
 * Set a relationship on an Entity to another Entity or Entities
 *
 * @param initialState
 * @param entityKey  Type of entity on which to set relationship
 * @param entityId  ID of entity on which to set relationship
 * @param relationshipKey  Name of the relationship
 * @param relationshipObject  Can be a JsonApiResponse, a Resource Object, or an array of Resource Objects
 */
export const setRelationshipOnEntity = (
    initialState: iState,
    entityKey: string,
    entityId: string,
    relationshipKey: string,
    relationshipObject: FlexiblePayload
): iState => {
    const unwrappedRelationshipObject = unwrapDataProp(relationshipObject);
    const newState = insertOrUpdateEntities(initialState, unwrappedRelationshipObject);
    const pluralEntityKey = pluralize(entityKey);

    return R.set(
        R.lensPath([pluralEntityKey, 'byId', entityId, 'relationships', relationshipKey, 'data']),
        mapOrOnce(partializeEntity, unwrappedRelationshipObject),
        newState
    );
}

/**
 * Completely clear a relationship type on an entity
 *
 * @param initialState
 * @param entityKey Type of entity who owns the relationship
 * @param entityId  Id of entity who owns the relationship
 * @param relationshipKey Name of relationship to clear
 */
export const clearRelationshipOnEntity = (
    initialState: iState,
    entityKey: string,
    entityId: string,
    relationshipKey: string
): iState => {
    const pluralEntityKey = pluralize(entityKey);

    return R.dissocPath(
        [pluralEntityKey, 'byId', entityId, 'relationships', relationshipKey],
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
    entityKeyOrResourceObject: string | iResourceObject,
    entityId?: string,
    data?: iResourceObject | iAttributes
) => {
    if (R.has('type', entityKeyOrResourceObject) && R.has('id', entityKeyOrResourceObject)) {
        return insertOrUpdateEntity(state, <iResourceObject>entityKeyOrResourceObject);
    }

    return R.over(
        R.lensPath([pluralize(<string>entityKeyOrResourceObject), 'byId', entityId, 'attributes']),
        reverseMergeDeepLeft(data),
        state
    );
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
    metaKey: string | undefined,
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
