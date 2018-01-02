import { iAttributes, iResourceObject } from 'ts-json-api';
import { iState } from './interfaces/state';
import { FlexiblePayload } from './interfaces/other';
/**
 * Insert an Entity or group of Entities
 * into the state as well as any includes
 *
 * @param state
 * @param payload
 */
export declare const insertOrUpdateEntities: (state: iState, payload: FlexiblePayload) => iState;
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
export declare const addRelationshipToEntity: (initialState: iState, entityKey: string, entityId: string, relationshipKey: string, relationshipObject: FlexiblePayload) => iState;
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
 * Set a relationship on an Entity to another Entity or Entities
 *
 * @param initialState
 * @param entityKey  Type of entity on which to set relationship
 * @param entityId  ID of entity on which to set relationship
 * @param relationshipKey  Name of the relationship
 * @param relationshipObject  Can be a JsonApiResponse, a Resource Object, or an array of Resource Objects
 */
export declare const setRelationshipOnEntity: (initialState: iState, entityKey: string, entityId: string, relationshipKey: string, relationshipObject: FlexiblePayload) => iState;
/**
 * Update an Entity's attributes
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {Object} data
 * @return {Object}
 */
export declare const updateEntity: (state: iState, entityKey: string, entityId: string, data: iAttributes | iResourceObject) => iState;
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
