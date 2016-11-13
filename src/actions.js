import pluralize from 'pluralize';
import actionNames from './constants';

/**
 * Load a JSON API response into the state
 *
 * @param  {Object} data
 * @return {Object}
 */
export const loadJsonApiEntityData = data => ({
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
export const addRelationshipToEntity = (entityKey, entityId, relationshipKey, relationshipObject) => ({
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
export const removeRelationshipFromEntity = (entityKey, entityId, relationshipKey, relationshipId) => ({
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
export const updateEntity = (entityKey, entityId, data) => ({
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
export const updateEntitiesMeta = (entityKey, metaKey, value) => ({
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
export const updateEntityMeta = (entityKey, entityId, metaKey, value) => ({
    type: `${actionNames.UPDATE_ENTITY_META}_${pluralize(entityKey, 1).toUpperCase()}`,
    entityKey,
    entityId,
    metaKey,
    value,
});
