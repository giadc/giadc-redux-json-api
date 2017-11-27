import { iState } from './interfaces/state';
/**
 * Grab an Entity from the state
 *
 * @param  {Object} state
 * @param  {String} key
 * @param  {String} id
 * @return {Object}
 */
export declare const getEntity: (state: iState, key: string, id: string) => any;
/**
 * Get an array of Entities from the state
 */
export declare const getEntities: (state: iState, key: string, ids?: string[]) => any[];
/**
 * Grab the ID from JSON API response containing a single Entity
 *
 * @param  {Object} jsonData
 * @return {String}
 */
export declare const getId: (jsonData: any) => string;
/**
 * Grab the ID's from a JSON API response containing an array of Entities
 *
 * @param  {Object} jsonData
 * @return {Array}
 */
export declare const getIds: (jsonData: any) => string[];
/**
 * Grab an Entity group's meta data from the state
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} metaKey
 * @return {Mixed}
 */
export declare const getEntitiesMeta: (state: iState, entityKey: string, metaKey?: string) => any;
/**
 * Grab an Entity's meta data from the state
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} metaKey
 * @return {Mixed}
 */
export declare const getEntityMeta: (state: iState, entityKey: string, entityId: string, metaKey?: string) => any;
