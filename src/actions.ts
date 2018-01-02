import * as pluralize from 'pluralize';
import { iJsonApiResponseWithData, iAttributes, iResourceObject } from 'ts-json-api';

import actionNames from './action-names';
import {
    iLoadAction,
    iAddRelationshipAction,
    iRemoveRelationshipAction,
    iSetRelationshipAction,
    iClearRelationshipAction,
    iUpdateEntitiesMetaAction,
    iUpdateEntityMetaAction,
    iUpdateEntityAction,
    iRemoveEntityAction,
    iClearEntityTypeAction
} from './interfaces/actions';

import { FlexiblePayload } from './interfaces/other';

const singularize = (input: string) => pluralize(input, 1);

/**
 * Load a JSON API response into the state
 *
 * @param  {Object} data
 * @return {Object}
 */
export const loadJsonApiEntityData = (data: FlexiblePayload): iLoadAction => ({
    type: actionNames.LOAD_JSON_API_ENTITY_DATA,
    data,
});

/**
 * Add a relationship to an Entity
 *
 * @param  entityKey
 * @param  entityId
 * @param  relationshipKey
 * @param  relationshipObject
 */
export const addRelationshipToEntity = (
    entityKey: string,
    entityId: string,
    relationshipKey: string,
    relationshipObject: FlexiblePayload
): iAddRelationshipAction => ({
    type: `${actionNames.ADD_RELATIONSHIP_TO_ENTITY}_${singularize(entityKey).toUpperCase()}_${pluralize(relationshipKey).toUpperCase()}`,
    entityKey,
    entityId,
    relationshipKey,
    relationshipObject,
});

/**
 * Set a relationship on an Entity
 *
 * @param entityKey
 * @param entityId
 * @param relationshipKey
 * @param relationshipId
 */
export const setRelationshipOnEntity = (
    entityKey: string,
    entityId: string,
    relationshipKey: string,
    relationshipObject: FlexiblePayload
): iSetRelationshipAction => ({
    type: `${actionNames.SET_RELATIONSHIP_ON_ENTITY}_${singularize(entityKey).toUpperCase()}_${pluralize(relationshipKey).toUpperCase()}`,
    entityKey,
    entityId,
    relationshipKey,
    relationshipObject
});

/**
 * Remove a relationship from an Entity
 *
 * @param  entityKey
 * @param  entityId
 * @param  relationshipKey
 * @param  relationshipId
 */
export const removeRelationshipFromEntity = (
    entityKey: string,
    entityId: string,
    relationshipKey: string,
    relationshipId: string
): iRemoveRelationshipAction => ({
    type: `${actionNames.REMOVE_RELATIONSHIP_FROM_ENTITY}_${singularize(entityKey).toUpperCase()}_${pluralize(relationshipKey).toUpperCase()}`,
    entityKey,
    entityId,
    relationshipKey,
    relationshipId,
});

export const clearRelationshipOnEntity = (
    entityKey: string,
    entityId: string,
    relationshipKey: string,
): iClearRelationshipAction => ({
    type: `${actionNames.CLEAR_RELATIONSHIP_ON_ENTITY}_${singularize(entityKey).toUpperCase()}_${pluralize(relationshipKey).toUpperCase()}`,
    entityKey,
    entityId,
    relationshipKey,
})

/**
 * Update an Entity's attributes
 *
 * @param  entityKey
 * @param  entityId
 * @param  {Object} data
 */
export const updateEntity = (
    entityKey: string,
    entityId: string,
    data: iAttributes
): iUpdateEntityAction => ({
    type: `${actionNames.UPDATE_ENTITY}_${singularize(entityKey).toUpperCase()}`,
    entityKey,
    entityId,
    data,
});

/**
 * Update an Entity group's meta data
 *
 * @param  entityKey
 * @param  metaKey
 * @param  value
 */
export const updateEntitiesMeta = (
    entityKey: string,
    metaKey: string,
    value: any
): iUpdateEntitiesMetaAction => ({
    type: `${actionNames.UPDATE_ENTITIES_META}_${pluralize(entityKey).toUpperCase()}`,
    entityKey,
    metaKey,
    value,
});

/**
 * Update an Entity's meta data
 *
 * @param  entityKey
 * @param  entityId
 * @param  metaKey
 * @param  value
 */
export const updateEntityMeta = (
    entityKey: string,
    entityId: string,
    metaKey: string,
    value: any
): iUpdateEntityMetaAction => ({
    type: `${actionNames.UPDATE_ENTITY_META}_${singularize(entityKey).toUpperCase()}`,
    entityKey,
    entityId,
    metaKey,
    value,
});

/**
 * Remove a single Entity
 *
 * @param  entityKey
 * @param  entityId
 */
export const removeEntity = (
    entityKey: string,
    entityId: string
): iRemoveEntityAction => ({
    type: `${actionNames.REMOVE_ENTITY}_${singularize(entityKey).toUpperCase()}`,
    entityKey,
    entityId,
});

/**
 * Clear all the Entities from an Entity type
 *
 * @param  entityKey
 */
export const clearEntityType = (entityKey: string): iClearEntityTypeAction => ({
    type: `${actionNames.CLEAR_ENTITY_TYPE}_${pluralize(entityKey).toUpperCase()}`,
    entityKey,
});
