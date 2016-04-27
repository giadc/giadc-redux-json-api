import pluralize from 'pluralize';

export const getEntity = (state, key, id) => {
    let pluralKey = pluralize(key);

    return state[pluralKey][id];
}

export const getEntities = (state, key, ids = null) => {
    let pluralKey = pluralize(key);

    if (ids === null) {
        return Object.keys(state[pluralKey]).map((id) => state[pluralKey][id])
    }

    let returnedEntities = [];

    ids.forEach((id) => {
        returnedEntities.push(
            getEntity(state, key, id)
        );
    });

    return returnedEntities;
}

export const getId = (jsonData) => {
    return jsonData.data.id;
}

export const getIds = (jsonData) => {
    return jsonData.data.map((entity) => entity.id);
}