import { Attributes, ResourceObject, JsonApiResponseWithData } from 'ts-json-api';
import { iState } from './interfaces/state';
/**
 * Insert an Entity or group of Entities
 * into the state as well as any includes
 *
 * @param state
 * @param payload
 */
export declare const insertOrUpdateEntities: (state: iState, payload: ResourceObject | ResourceObject[] | JsonApiResponseWithData) => iState;
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
export declare const addRelationshipToEntity: (initialState: iState, entityKey: string, entityId: string, relationshipKey: string, relationshipObject: ResourceObject | JsonApiResponseWithData) => iState;
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
export declare const removeRelationshipFromEntity: (initialState: iState, entityKey: string, entityId: string, relationshipKey: string, relationshipId: string) => iState;
/**
 * Update an Entity's attributes
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {Object} data
 * @return {Object}
 */
export declare const updateEntity: (state: iState, entityKey: string, entityId: string, data: Attributes | ResourceObject) => iState;
/**
 * Update the meta data for an Entity group
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} metaKey
 * @param  {Mixed}  value
 * @return {Object}
 */
export declare const updateEntitiesMeta: (state: iState, entityKey: string, metaKey: string, value: any) => iState;
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
export declare const updateEntityMeta: (state: iState, entityKey: string, entityId: string, metaKey: string, value: any) => iState;
/**
 * Remove a single Entity
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} entityId
 * @return {Object}
 */
export declare const removeEntity: (state: iState, entityKey: string, entityId: string) => iState;
/**
 * Clear all of the Entities out of an Entity type
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @return {Object}
 */
export declare const clearEntityType: (state: iState, entityKey: string) => iState;
