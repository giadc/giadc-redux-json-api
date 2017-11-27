/**
 * Insert an Entity or group of Entities
 * into the state as well as any includes
 *
 * @param  {Object} state
 * @param  {Object} payload
 * @return {Object}
 */
export declare const insertOrUpdateEntities: (state: any, payload: any) => any;
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
export declare const addRelationshipToEntity: (initialState: any, entityKey: any, entityId: any, relationshipKey: any, relationshipObject: any) => any;
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
export declare const removeRelationshipFromEntity: (initialState: any, entityKey: any, entityId: any, relationshipKey: any, relationshipId: any) => any;
/**
 * Update an Entity's attributes
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {Object} data
 * @return {Object}
 */
export declare const updateEntity: (state: any, entityKey: any, entityId: any, data: any) => any;
/**
 * Update the meta data for an Entity group
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} metaKey
 * @param  {Mixed}  value
 * @return {Object}
 */
export declare const updateEntitiesMeta: (state: any, entityKey: any, metaKey: any, value: any) => any;
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
export declare const updateEntityMeta: (state: any, entityKey: any, entityId: any, metaKey: any, value: any) => any;
/**
 * Remove a single Entity
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} entityId
 * @return {Object}
 */
export declare const removeEntity: (state: any, entityKey: any, entityId: any) => any;
/**
 * Clear all of the Entities out of an Entity type
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @return {Object}
 */
export declare const clearEntityType: (state: any, entityKey: any) => any;
