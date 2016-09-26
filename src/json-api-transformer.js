import pluralize from 'pluralize';
import { getEntity } from './helpers';

export const insertOrUpdateEntities = (state, payload) => {
    let entities = Array.isArray(payload.data) ? payload.data : [payload.data];
    const included = payload.included || [];

    entities = entities.concat(included);

    return entities.reduce(
        insertOrUpdateEntity,
        state
    );
};

const insertOrUpdateEntity = (state, entity) => {
    const pluralKey = pluralize(entity.type);
    const store = state[pluralKey] || {};
    const meta = store.meta || {};
    const entities = store.byId || {};
    const existingEntity = entities[entity.id] || {};

    return {
        ...state,
        [pluralKey]: {
            meta,
            byId: {
                ...entities,
                [entity.id]: { ...existingEntity, ...transformEntity(entity) },
            },
        },
    };
};

const transformEntity = (entity) => {
    let transformedEntity = { id: entity.id };

    if (entity.attributes) {
        transformedEntity = { ...transformedEntity, ...entity.attributes };
    }

    if (entity.relationships) {
        transformedEntity = {
            ...transformedEntity,
            ...transformRelationships(entity.relationships),
        };
    }

    return transformedEntity;
};

const transformRelationships = (relationships) => {
    const transformedRelationships = {};

    Object.keys(relationships).forEach((key) => {
        if (Array.isArray(relationships[key].data)) {
            const pluralKey = pluralize(key);

            transformedRelationships[pluralKey] = relationships[key].data.map(relationship => relationship.id);
        } else {
            transformedRelationships[key] = relationships[key].data.id;
        }
    });

    return transformedRelationships;
};

export const addRelationshipToEntity = (initialState, entityKey, entityId, relationshipKey, relationshipObject) => {
    const pluralEntityKey = pluralize(entityKey);
    const newState = insertOrUpdateEntities(initialState, { data: relationshipObject });
    const entity = getEntity(newState, entityKey, entityId);

    newState[pluralEntityKey] = {
        meta: newState[pluralEntityKey].meta || {},
        byId: {
            ...newState[pluralEntityKey].byId,
            [entityId]: addEntityIdToRelationshipArray(
                entity,
                relationshipKey,
                relationshipObject.id
            ),
        },
    };

    return newState;
};

const addEntityIdToRelationshipArray = (entity, relationshipKey, relationshipId) => ({
    ...entity,
    [relationshipKey]: [
        ...entity[relationshipKey].filter(id => id !== relationshipId),
        relationshipId,
    ],
});

export const removeRelationshipFromEntity = (initialState, entityKey, entityId, relationshipKey, relationshipId) => {
    const pluralEntityKey = pluralize(entityKey);
    const newState = { ...initialState };
    const entity = getEntity(newState, entityKey, entityId);

    newState[pluralEntityKey] = {
        meta: newState[pluralEntityKey].meta || {},
        byId: {
            ...newState[pluralEntityKey].byId,
            [entityId]: removeEntityIdFromRelationshipArray(
                entity,
                relationshipKey,
                relationshipId
            ),
        },
    };

    return newState;
};

const removeEntityIdFromRelationshipArray = (entity, relationshipKey, relationshipId) => ({
    ...entity,
    [relationshipKey]: entity[relationshipKey].filter(id => id !== relationshipId),
});

export const updateEntity = (state, entityKey, entityId, data) => insertOrUpdateEntities(
    state, {
        data: {
            type: entityKey,
            id: entityId,
            attributes: data,
        },
    }
);

export const setEntitiesMeta = (state, entityKey, metaKey, value) => {
    const pluralKey = pluralize(entityKey);
    const store = state[pluralKey] || {};
    const meta = store.meta || {};
    const byId = store.byId || {};

    return {
        ...state,
        [pluralKey]: {
            meta: {
                ...meta,
                [metaKey]: value,
            },
            byId,
        },
    };
};
