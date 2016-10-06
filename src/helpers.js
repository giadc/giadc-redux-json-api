import pluralize from 'pluralize';
import uuid from 'node-uuid';

export const getEntity = (state, key, id) => {
    const pluralKey = pluralize(key);

    if (
        !state[pluralKey] || !state[pluralKey].byId || !state[pluralKey].byId[id] || !state[pluralKey].byId[id].data
    ) {
        return null;
    }

    return state[pluralKey].byId[id].data;
};

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

export const getId = jsonData => jsonData.data.id;

export const getIds = jsonData => jsonData.data.map(entity => entity.id);

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
