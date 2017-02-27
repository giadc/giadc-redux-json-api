import pluralize from 'pluralize';
import uuid from 'uuid';

/**
 * Grab an Entity from the state
 *
 * @param  {Object} state
 * @param  {String} key
 * @param  {String} id
 * @return {Object}
 */
export const getEntity = (state, key, id) => {
    const pluralKey = pluralize(key);
    const entity = state.getIn([pluralKey, 'byId', id, 'data']);

    return (entity === undefined)
        ? undefined
        : {
            ...entity.toJS(),
            id,
        };
};

/**
 * Get an array of Entities from the state
 *
 * @param  {Object}     state
 * @param  {String}     key
 * @param  {Array|null} ids
 * @return {Array}
 */
export const getEntities = (state, key, ids = null) => {
    const pluralKey = pluralize(key);

    if (ids === null) {
        if (!state.hasIn([pluralKey, 'byId'])) {
            return [];
        }

        const idsToFetch = state.getIn([pluralKey, 'byId']).keySeq().toArray();

        return idsToFetch.map(id => getEntity(state, pluralKey, id));
    }

    return ids.map(id => getEntity(state, key, id))
        .filter(entity => !!entity);
};

/**
 * Grab the ID from JSON API response containing a single Entity
 *
 * @param  {Object} jsonData
 * @return {String}
 */
export const getId = jsonData => jsonData.data.id;

/**
 * Grab the ID's from a JSON API response containing an array of Entities
 *
 * @param  {Object} jsonData
 * @return {Array}
 */
export const getIds = jsonData => jsonData.data.map(entity => entity.id);

/**
 * Grab an Entity group's meta data from the state
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} metaKey
 * @return {Mixed}
 */
export const getEntitiesMeta = (state, entityKey, metaKey = null) => (
    (metaKey === null)
        ? state.getIn([entityKey, 'meta']) && state.getIn([entityKey, 'meta']).toJS()
        : state.getIn([entityKey, 'meta', metaKey])
);

/**
 * Grab an Entity's meta data from the state
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} metaKey
 * @return {Mixed}
 */
export const getEntityMeta = (state, entityKey, entityId, metaKey = null) => (
    (metaKey === null)
        ? state.getIn([entityKey, 'byId', entityId, 'meta']) && state.getIn([entityKey, 'byId', entityId, 'meta']).toJS()
        : state.getIn([entityKey, 'byId', entityId, 'meta', metaKey])
);

/**
 * Generate a valid Entity with the given attributes
 *
 * @param  {String} entityKey
 * @param  {Object} attributes
 * @return {Object}
 */
export const generateEntity = (entityKey, attributes) => {
    const id = attributes.id || uuid.v4();

    return {
        type: entityKey,
        id,
        attributes: Object.keys(attributes)
            .filter(key => key !== 'id')
            .reduce((carrier, key) => ({ ...carrier, [key]: attributes[key] }), {}),
    };
};
