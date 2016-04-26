import pluralize from 'pluralize';

export const getEntity = (state, key, id) => {
    let pluralKey = pluralize(key);

    return state[pluralKey][id];
}

export const getEntities = (state, key, ids = null) => {
    let pluralKey = pluralize(key);

    if (ids === null) {
        return state[pluralKey];
    }

    let returnedEntities = [];

    ids.forEach((id) => {
        returnedEntities.push(
            getEntity(state, key, id)
        );
    });

    return returnedEntities;
}
