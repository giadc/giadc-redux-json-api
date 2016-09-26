import pluralize from 'pluralize';

export const getEntity = (state, key, id) => {
    let pluralKey = pluralize(key);

    if (!state[pluralKey] || !state[pluralKey].byId || !state[pluralKey].byId[id]) {
        return null;
    }

    return state[pluralKey].byId[id];
}

export const getEntities = (state, key, ids = null) => {
    let pluralKey = pluralize(key);

    if (ids === null) {
        const data = state[pluralKey];

        if (!data || !data.byId) {
            return [];
        }

        return Object.keys(data.byId).map((id) => data.byId[id]);
    }

    let returnedEntities = [];

    ids.forEach((id) => {
        let entity = getEntity(state, key, id);

        if (entity) {
            returnedEntities.push(entity);
        }
    });

    return returnedEntities;
}

export const getId = (jsonData) => {
    return jsonData.data.id;
}

export const getIds = (jsonData) => {
    return jsonData.data.map((entity) => entity.id);
}

export const getEntitiesMeta = (state, entityKey, metaKey = null) => {
    if (metaKey === null) {
        return state[entityKey].meta;
    }

    return state[entityKey].meta[metaKey];
}
