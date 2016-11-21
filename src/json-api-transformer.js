import pluralize from 'pluralize';
import { getEntity } from './helpers';

/**
 * Insert an Entity or group of Entities
 * into the state as well as any includes
 *
 * @param  {Object} state
 * @param  {Object} payload
 * @return {Object}
 */
export const insertOrUpdateEntities = (state, payload) => {
    let entities = Array.isArray(payload.data) ? payload.data : [payload.data];
    const included = payload.included || [];

    entities = entities.concat(included);

    return entities.reduce(
        insertOrUpdateEntity,
        state
    );
};

/**
 * Insert a single Entity into the state
 *
 * @param  {Object} state
 * @param  {Object} entity
 * @return {Object}
 */
const insertOrUpdateEntity = (state, entity) => {
    validateEntity(entity);

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

/**
 * Ensure that an Entity is well-formed
 *
 * @param  {Object} entity
 */
const validateEntity = (entity) => {
    if (!('type' in entity)) {
        throw new Error('JSON API resource objects must have a `type` property');
    }

    if (!('id' in entity)) {
        throw new Error('JSON API resource objects must have an `id` property');
    }
};

/**
 * Get an Entity's attributes
 * and normalize its relationships
 *
 * @param  {Object} entity
 * @return {Object}
 */
const transformEntity = (entity) => {
    const transformedEntity = entity.attributes ? { ...entity.attributes } : {};

    return entity.relationships
        ? {
            ...transformedEntity,
            ...transformRelationships(entity.relationships),
        }
        : transformedEntity;
};

/**
 * Normalize an Entity's relationships
 *
 * @param  {Object} relationships
 * @return {Array|String}
 */
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

/**
 * Insert an Entity into the state and
 * add it as a relationship to another Entity
 *
 * @param  {Object} initialState
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} relationshipKey
 * @param  {Object} relationshipObject
 * @return {Object}
 */
export const addRelationshipToEntity = (initialState, entityKey, entityId, relationshipKey, relationshipObject) => {
    const pluralEntityKey = pluralize(entityKey);
    const newState = insertOrUpdateEntities(initialState, { data: relationshipObject });
    const { id, ...entity } = getEntity(newState, entityKey, entityId); // eslint-disable-line no-unused-vars

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

/**
 * Add a relationship ID to an Entity relationship
 *
 * @param  {Object} entity
 * @param  {String} relationshipKey
 * @param  {String} relationshipId
 * @return {Array}
 */
const addEntityIdToRelationshipArray = (entity, relationshipKey, relationshipId) => ({
    ...entity,
    [relationshipKey]: [
        ...entity[relationshipKey].filter(id => id !== relationshipId),
        relationshipId,
    ],
});

/**
 * Remove a relationship an Entity
 *
 * @param  {Object} initialState
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} relationshipKey
 * @param  {String} relationshipId
 * @return {Object}
 */
export const removeRelationshipFromEntity = (initialState, entityKey, entityId, relationshipKey, relationshipId) => {
    const pluralEntityKey = pluralize(entityKey);
    const { id, ...entity } = getEntity(initialState, entityKey, entityId); // eslint-disable-line no-unused-vars

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

/**
 * Remove an relationship ID from an Entity relationship
 *
 * @param  {Object} entity
 * @param  {String} relationshipKey
 * @param  {String} relationshipId
 * @return {Object}
 */
const removeEntityIdFromRelationshipArray = (entity, relationshipKey, relationshipId) => ({
    ...entity,
    [relationshipKey]: entity[relationshipKey].filter(id => id !== relationshipId),
});

/**
 * Update an Entity's attributes
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {Object} data
 * @return {Object}
 */
export const updateEntity = (state, entityKey, entityId, data) => insertOrUpdateEntities(
    state, {
        data: {
            type: entityKey,
            id: entityId,
            attributes: data,
        },
    }
);

/**
 * Update the meta data for an Entity group
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} metaKey
 * @param  {Mixed}  value
 * @return {Object}
 */
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

/**
 * Update the meta data for an Entity
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} entityId
 * @param  {String} metaKey
 * @param  {Mixed}  value
 * @return {Object}
 */
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

/**
 * Remove a single Entity
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @param  {String} entityId
 * @return {Object}
 */
export const removeEntity = (state, entityKey, entityId) => {
    const pluralKey = pluralize(entityKey);
    const store     = state[pluralKey] || {};
    const entities  = store.byId || {};

    return {
        ...state,
        [pluralKey]: {
            meta: store.meta,
            byId: Object.keys(entities).filter(id => id !== entityId)
                .reduce((accumulator, id) => ({
                    ...accumulator,
                    [id]: entities[id],
                }), {}),
        },
    };
};

/**
 * Clear all of the Entities out of an Entity type
 *
 * @param  {Object} state
 * @param  {String} entityKey
 * @return {Object}
 */
export const clearEntityType = (state, entityKey) => {
    const pluralKey = pluralize(entityKey);

    return {
        ...state,
        [pluralKey]: {
            byId: {},
            meta: {},
        },
    };
};
