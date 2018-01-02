import { Entity, iJsonApiResponseWithData } from 'ts-json-api';
import { iState } from './interfaces/state';
/**
 * Grab an Entity from the state
 *
 * @param  {Object} state
 * @param  {String} key
 * @param  {String} id
 * @return {Object}
 */
export declare const getEntity: (state: iState, key: string, id: string) => Entity;
/**
 * Get an array of Entities from the state
 */
export declare const getEntities: (state: iState, key: string, ids?: string[]) => Entity[];
/**
 * Grab the ID from JSON API response containing a single Entity
 *
 * @param  {Object} jsonData
 * @return {String}
 */
export declare const getId: (jsonData: iJsonApiResponseWithData) => string;
/**
 * Grab the ID's from a JSON API response containing an array of Entities
 *
 * @param  {Object} jsonData
 * @return {Array}
 */
export declare const getIds: (jsonData: iJsonApiResponseWithData) => string[];
/**
 * Grab an Entity group's meta data from the state
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} metaKey
 * @return {Mixed}
 */
export declare const getEntitiesMeta: (state: iState, entityKey: string, metaKey?: string) => {};
/**
 * Grab an Entity's meta data from the state
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} metaKey
 * @return {Mixed}
 */
export declare const getEntityMeta: (state: iState, entityKey: string, entityId: string, metaKey?: string) => {};
