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
    const existingEntity = entities[entity.id] || { meta: {}, data: {} };

    return {
        ...state,
        [pluralKey]: {
            meta,
            byId: {
                ...entities,
                [entity.id]: {
                    meta: existingEntity.meta || {},
                    data: {
                        ...existingEntity.data,
                        ...transformEntity(entity),
                    },
                },
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

const transformRelationships = relationships =>
    Object.keys(relationships).reduce((transformedRelationships, key) => (
        (Array.isArray(relationships[key].data))
            ? {
                ...transformedRelationships,
                [pluralize(key)]: relationships[key].data.map(relationship => relationship.id),
            }
            : {
                ...transformedRelationships,
                [key]: relationships[key].data.id,
            }
    ), {});

export const addRelationshipToEntity = (initialState, entityKey, entityId, relationshipKey, relationshipObject) => {
    const pluralEntityKey = pluralize(entityKey);
    const newState = insertOrUpdateEntities(initialState, { data: relationshipObject });
    const entity = getEntity(newState, entityKey, entityId);

    newState[pluralEntityKey] = {
        meta: newState[pluralEntityKey].meta || {},
        byId: {
            ...newState[pluralEntityKey].byId,
            [entityId]: {
                meta: newState[pluralEntityKey].byId[entityId].meta,
                data: addEntityIdToRelationshipArray(
                    entity,
                    relationshipKey,
                    relationshipObject.id
                ),
            },
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
    const entity = getEntity(initialState, entityKey, entityId);

    return {
        ...initialState,
        [pluralEntityKey]: {
            meta: initialState[pluralEntityKey].meta || {},
            byId: {
                ...initialState[pluralEntityKey].byId,
                [entityId]: {
                    meta: initialState[pluralEntityKey].byId[entityId].meta,
                    data: removeEntityIdFromRelationshipArray(
                        entity,
                        relationshipKey,
                        relationshipId
                    ),
                },
            },
        },
    };
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

export const updateEntitiesMeta = (state, entityKey, metaKey, value) => {
    const pluralKey = pluralize(entityKey);
    const store = state[pluralKey] || { meta: {}, byId: {} };
    const meta = store.meta || {};
    const byId = store.byId || {};

    return {
        ...state,
        [pluralKey]: {
            meta: (metaKey === null)
                ? value
                : {
                    ...meta,
                    [metaKey]: value,
                },
            byId,
        },
    };
};

export const updateEntityMeta = (state, entityKey, entityId, metaKey, value) => {
    const pluralKey = pluralize(entityKey);
    const store = state[pluralKey] || { meta: {}, byId: {} };
    const entity = store.byId[entityId] || { meta: {}, data: {} };

    const meta = (metaKey === null)
        ? value
        : {
            ...entity.meta,
            [metaKey]: value,
        };

    const updatedEntity = {
        meta,
        data: entity.data,
    };

    return {
        ...state,
        [pluralKey]: {
            meta: store.meta,
            byId: {
                ...store.byId,
                [entityId]: updatedEntity,
            },
        },
    };
};

