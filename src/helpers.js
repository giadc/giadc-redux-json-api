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

    if (
        !state[pluralKey] || !state[pluralKey].byId || !state[pluralKey].byId[id] || !state[pluralKey].byId[id].data
    ) {
        return null;
    }

    return { ...state[pluralKey].byId[id].data, id };
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
        const data = state[pluralKey];

        if (!data || !data.byId) {
            return [];
        }

        return Object.keys(data.byId).map(id => getEntity(state, key, id));
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
export const getEntitiesMeta = (state, entityKey, metaKey = null) => {
    if (metaKey === null) {
        return (state[entityKey] && state[entityKey].meta)
            ? state[entityKey].meta
            : null;
    }

    return (state[entityKey] && state[entityKey].meta && state[entityKey].meta[metaKey])
        ? state[entityKey].meta[metaKey]
        : null;
};

/**
 * Grab an Entity's meta data from the state
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} metaKey
 * @return {Mixed}
 */
export const getEntityMeta = (state, entityKey, entityId, metaKey = null) => {
    if (metaKey === null) {
        return (
            state[entityKey] && state[entityKey].byId && state[entityKey].byId[entityId]
            && state[entityKey].byId[entityId].meta
        )
            ? state[entityKey].byId[entityId].meta
            : null;
    }

    return (
        state[entityKey] && state[entityKey].byId && state[entityKey].byId[entityId]
        && state[entityKey].byId[entityId].meta && state[entityKey].byId[entityId].meta[metaKey]
    )
        ? state[entityKey].byId[entityId].meta[metaKey]
        : null;
};

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
