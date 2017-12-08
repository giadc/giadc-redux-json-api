import { JsonApiResponse } from 'ts-json-api';
/**
 * Load a JSON API response into the state
 *
 * @param  {Object} data
 * @return {Object}
 */
export declare const loadJsonApiEntityData: (data: JsonApiResponse) => {
    type: string;
    data: JsonApiResponse;
};
/**
 * Add a relationship to an Entity
 *
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} relationshipKey
 * @param  {Object} relationshipObject
 * @return {Object}
 */
export declare const addRelationshipToEntity: (entityKey: string, entityId: string, relationshipKey: string, relationshipObject: JsonApiResponse) => {
    type: string;
    entityKey: string;
    entityId: string;
    relationshipKey: string;
    relationshipObject: JsonApiResponse;
};
/**
 * Remove a relationship from an Entity
 *
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} relationshipKey
 * @param  {String} relationshipId
 * @return {Object}
 */
export declare const removeRelationshipFromEntity: (entityKey: string, entityId: string, relationshipKey: string, relationshipId: string) => {
    type: string;
    entityKey: string;
    entityId: string;
    relationshipKey: string;
    relationshipId: string;
};
/**
 * Update an Entity's attributes
 *
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {Object} data
 * @return {Object}
 */
export declare const updateEntity: (entityKey: string, entityId: string, data: JsonApiResponse) => {
    type: string;
    entityKey: string;
    entityId: string;
    data: JsonApiResponse;
};
/**
 * Update an Entity group's meta data
 *
 * @param  {String} entityKey
 * @param  {String} metaKey
 * @param  {Mixed}  value
 * @return {Object}
 */
export declare const updateEntitiesMeta: (entityKey: string, metaKey: string, value: any) => {
    type: string;
    entityKey: string;
    metaKey: string;
    value: any;
};
/**
 * Update an Entity's meta data
 *
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} metaKey
 * @param  {Mixed}  value
 * @return {Object}
 */
export declare const updateEntityMeta: (entityKey: string, entityId: string, metaKey: string, value: any) => {
    type: string;
    entityKey: string;
    entityId: string;
    metaKey: string;
    value: any;
};
/**
 * Remove a single Entity
 *
 * @param  {String} entityKey
 * @param  {String} entityId
 * @return {Object}
 */
export declare const removeEntity: (entityKey: string, entityId: string) => {
    type: string;
    entityKey: string;
    entityId: string;
};
/**
 * Clear all the Entities from an Entity type
 *
 * @param  {String} entityKey
 * @return {Object}
 */
export declare const clearEntityType: (entityKey: string) => {
    type: string;
    entityKey: string;
};
