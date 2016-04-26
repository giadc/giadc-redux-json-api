import pluralize from 'pluralize';

export const getEntity = (state, key, id) => {
    let pluralKey = pluralize(key);

    return state[pluralKey].filter(entity => entity.id === id)[0];
}

export const getEntities = (state, key, ids = null) => {
    let pluralKey = pluralize(key);

    if (ids === null) {
        return state[pluralKey];
    }

    if (ids.length === 0) {
        return [];
    }

    let returnedEntities = [];

    ids.forEach((id) => {
        returnedEntities.push(
            getEntity(state, key, id)
        );
    });

    return returnedEntities;
}
