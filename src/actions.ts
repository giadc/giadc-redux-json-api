import * as pluralize from 'pluralize';
import { JsonApiResponse } from 'ts-json-api';
import actionNames from './action-names';

/**
 * Load a JSON API response into the state
 *
 * @param  {Object} data
 * @return {Object}
 */
export const loadJsonApiEntityData = (data: JsonApiResponse) => ({
    type: actionNames.LOAD_JSON_API_ENTITY_DATA,
    data,
});

/**
 * Add a relationship to an Entity
 *
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} relationshipKey
 * @param  {Object} relationshipObject
 * @return {Object}
 */
export const addRelationshipToEntity = (
    entityKey: string,
    entityId: string,
    relationshipKey: string,
    relationshipObject: JsonApiResponse
) => ({
    type: `${actionNames.ADD_RELATIONSHIP_TO_ENTITY}_${pluralize(entityKey, 1).toUpperCase()}_${pluralize(relationshipKey).toUpperCase()}`,
    entityKey,
    entityId,
    relationshipKey,
    relationshipObject,
});

/**
 * Remove a relationship from an Entity
 *
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} relationshipKey
 * @param  {String} relationshipId
 * @return {Object}
 */
export const removeRelationshipFromEntity = (
    entityKey: string,
    entityId: string,
    relationshipKey: string,
    relationshipId: string
) => ({
    type: `${actionNames.REMOVE_RELATIONSHIP_FROM_ENTITY}_${pluralize(entityKey, 1).toUpperCase()}_${pluralize(relationshipKey).toUpperCase()}`,
    entityKey,
    entityId,
    relationshipKey,
    relationshipId,
});

/**
 * Update an Entity's attributes
 *
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {Object} data
 * @return {Object}
 */
export const updateEntity = (
    entityKey: string,
    entityId: string,
    data: JsonApiResponse
) => ({
    type: `${actionNames.UPDATE_ENTITY}_${pluralize(entityKey, 1).toUpperCase()}`,
    entityKey,
    entityId,
    data,
});

/**
 * Update an Entity group's meta data
 *
 * @param  {String} entityKey
 * @param  {String} metaKey
 * @param  {Mixed}  value
 * @return {Object}
 */
export const updateEntitiesMeta = (
    entityKey: string,
    metaKey: string,
    value:any
) => ({
    type: `${actionNames.UPDATE_ENTITIES_META}_${pluralize(entityKey).toUpperCase()}`,
    entityKey,
    metaKey,
    value,
});

/**
 * Update an Entity's meta data
 *
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} metaKey
 * @param  {Mixed}  value
 * @return {Object}
 */
export const updateEntityMeta = (
    entityKey: string,
    entityId: string,
    metaKey: string,
    value: any
) => ({
    type: `${actionNames.UPDATE_ENTITY_META}_${pluralize(entityKey, 1).toUpperCase()}`,
    entityKey,
    entityId,
    metaKey,
    value,
});

/**
 * Remove a single Entity
 *
 * @param  {String} entityKey
 * @param  {String} entityId
 * @return {Object}
 */
export const removeEntity = (
    entityKey: string,
    entityId: string
) => ({
    type: `${actionNames.REMOVE_ENTITY}_${pluralize(entityKey, 1).toUpperCase()}`,
    entityKey,
    entityId,
});

/**
 * Clear all the Entities from an Entity type
 *
 * @param  {String} entityKey
 * @return {Object}
 */
export const clearEntityType = (entityKey: string) => ({
    type: `${actionNames.CLEAR_ENTITY_TYPE}_${pluralize(entityKey).toUpperCase()}`,
    entityKey,
});
