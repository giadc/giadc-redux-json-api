import { Map, Set } from 'immutable';
import pluralize from 'pluralize';

/**
 * Insert an Entity or group of Entities
 * into the state as well as any includes
 *
 * @param  {Object} state
 * @param  {Object} payload
 * @return {Object}
 */
export const insertOrUpdateEntities = (state, payload) => {
    const data = payload.data || [payload];
    let entities = Array.isArray(data) ? data : [data];
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

    return state.mergeIn(
        [pluralKey, 'byId', entity.id, 'data'],
        transformEntity(entity)
    );
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
    const transformedEntity = Map(entity.attributes);

    return entity.relationships
        ? transformedEntity.merge(
            transformRelationships(entity.relationships)
        )
        : transformedEntity;
};

/**
 * Normalize an Entity's relationships
 *
 * @param  {Object} relationships
 * @return {Array|String}
 */
const transformRelationships = (relationships) => {
    const result = Object.keys(relationships).reduce((transformedRelationships, key) => (
        (Array.isArray(relationships[key].data))
            ? {
                ...transformedRelationships,
                [pluralize(key)]: Set(relationships[key].data.map(relationship => relationship.id)),
            }
            : {
                ...transformedRelationships,
                [key]: relationships[key].data.id,
            }
    ), {});

    return result;
};

/**
 * Insert an Entity into the state and
 * add it as a relationship to another Entity
 *
 * @param  {Object}         initialState
 * @param  {String}         entityKey
 * @param  {String}         entityId
 * @param  {String}         relationshipKey
 * @param  {Object|String}  relationshipObject  Can be either a valid JSON API object or a string ID
 * @return {Object}
 */
export const addRelationshipToEntity = (initialState, entityKey, entityId, relationshipKey, relationshipObject) => {
    const pluralEntityKey = pluralize(entityKey);

    const wrappedRelationshipObject = (!relationshipObject.data)
        ? { data: relationshipObject }
        : relationshipObject;

    if (Array.isArray(wrappedRelationshipObject.data)) {
        return wrappedRelationshipObject.data.reduce((carrier, singleItem) => 
            addRelationshipToEntity(carrier, pluralEntityKey, entityId, relationshipKey, singleItem),
            initialState
        );
    }

    if (typeof wrappedRelationshipObject.data === 'string') {
        return initialState.updateIn(
            [pluralEntityKey, 'byId', entityId, 'data', relationshipKey],
            Set(),
            arr => arr.add(wrappedRelationshipObject.data),
        );
    }

    const newState = insertOrUpdateEntities(initialState, wrappedRelationshipObject);

    return newState.updateIn(
        [pluralEntityKey, 'byId', entityId, 'data', relationshipKey],
        Set(),
        arr => arr.add(wrappedRelationshipObject.data.id),
    );
};

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

    return initialState.updateIn(
        [pluralEntityKey, 'byId', entityId, 'data', relationshipKey],
        arr => arr.remove(relationshipId),
    );
};

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
    return metaKey
        ? state.setIn([pluralKey, 'meta', metaKey], value)
        : state.setIn([pluralKey, 'meta'], Map(value));
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
    return metaKey
        ? state.setIn([pluralKey, 'byId', entityId, 'meta', metaKey], value)
        : state.setIn([pluralKey, 'byId', entityId, 'meta'], Map(value));
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
    return state.deleteIn([pluralKey, 'byId', entityId]);
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
    return state.delete(pluralKey);
};
