import { iAttributes } from 'ts-json-api';
import { iLoadAction, iAddRelationshipAction, iRemoveRelationshipAction, iSetRelationshipAction, iUpdateEntitiesMetaAction, iUpdateEntityMetaAction, iUpdateEntityAction, iRemoveEntityAction, iClearEntityTypeAction } from './interfaces/actions';
import { FlexiblePayload } from './interfaces/other';
/**
 * Load a JSON API response into the state
 *
 * @param  {Object} data
 * @return {Object}
 */
export declare const loadJsonApiEntityData: (data: FlexiblePayload) => iLoadAction;
/**
 * Add a relationship to an Entity
 *
 * @param  entityKey
 * @param  entityId
 * @param  relationshipKey
 * @param  relationshipObject
 */
export declare const addRelationshipToEntity: (entityKey: string, entityId: string, relationshipKey: string, relationshipObject: FlexiblePayload) => iAddRelationshipAction;
/**
 * Set a relationship on an Entity
 *
 * @param entityKey
 * @param entityId
 * @param relationshipKey
 * @param relationshipId
 */
export declare const setRelationshipOnEntity: (entityKey: string, entityId: string, relationshipKey: string, relationshipObject: FlexiblePayload) => iSetRelationshipAction;
/**
 * Remove a relationship from an Entity
 *
 * @param  entityKey
 * @param  entityId
 * @param  relationshipKey
 * @param  relationshipId
 */
export declare const removeRelationshipFromEntity: (entityKey: string, entityId: string, relationshipKey: string, relationshipId: string) => iRemoveRelationshipAction;
/**
 * Update an Entity's attributes
 *
 * @param  entityKey
 * @param  entityId
 * @param  {Object} data
 */
export declare const updateEntity: (entityKey: string, entityId: string, data: iAttributes) => iUpdateEntityAction;
/**
 * Update an Entity group's meta data
 *
 * @param  entityKey
 * @param  metaKey
 * @param  value
 */
export declare const updateEntitiesMeta: (entityKey: string, metaKey: string, value: any) => iUpdateEntitiesMetaAction;
/**
 * Update an Entity's meta data
 *
 * @param  entityKey
 * @param  entityId
 * @param  metaKey
 * @param  value
 */
export declare const updateEntityMeta: (entityKey: string, entityId: string, metaKey: string, value: any) => iUpdateEntityMetaAction;
/**
 * Remove a single Entity
 *
 * @param  entityKey
 * @param  entityId
 */
export declare const removeEntity: (entityKey: string, entityId: string) => iRemoveEntityAction;
/**
 * Clear all the Entities from an Entity type
 *
 * @param  entityKey
 */
export declare const clearEntityType: (entityKey: string) => iClearEntityTypeAction;
