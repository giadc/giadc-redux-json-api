import pluralize from 'pluralize';
import { getEntity } from './helpers';

export const insertOrUpdateEntities = (state, payload) => {
    let entities = Array.isArray(payload.data) ? payload.data : [payload.data];
    let included = payload.included || [];

    entities = entities.concat(included);

    return entities.reduce(
        insertOrUpdateEntity,
        state
    );
};

const insertOrUpdateEntity = (state, entity) => {
    let pluralKey = pluralize(entity.type);
    let entities = state[pluralKey] || {};
    let existingEntity = entities[entity.id] || {};
    
    return {
        ...state,
        [pluralKey]: {
            ...entities,
            [entity.id]: {...existingEntity, ...transformEntity(entity)}
        }
    };
}

const transformEntity = (entity) => {
    let transformedEntity = { id: entity.id };
    
    if (entity.attributes) {
        transformedEntity = {...transformedEntity, ...entity.attributes}
    }

    if (entity.relationships) {
        transformedEntity = {
            ...transformedEntity,
            ...transformRelationships(entity.relationships)
        }
    }

    return transformedEntity;
}

const transformRelationships = (relationships) => {
    let transformedRelationships = {};

    Object.keys(relationships).forEach((key) => {
        let pluralKey = pluralize(key);
        transformedRelationships[pluralKey] = relationships[pluralKey].data.map((relationship) => {
            return relationship.id;
        });
    });

    return transformedRelationships;
}

export const addRelationshipToEntity = (initialState, entityKey, entityId, relationshipKey, relationshipObject) => {
    let pluralEntityKey = pluralize(entityKey);
    let pluralRelationshipKey = pluralize(relationshipKey);
    let newState = insertOrUpdateEntity(initialState, relationshipObject);
    let entity = getEntity(newState, entityKey, entityId);

    newState[pluralEntityKey] = {
        ...newState[pluralEntityKey],
        [entityId]: addEntityIdToRelationshipArray(
            entity, 
            relationshipKey, 
            relationshipObject.id
        )
    };

    return newState;
}

const addEntityIdToRelationshipArray = (entity, relationshipKey, relationshipId) => {
    return {
        ...entity,
        [relationshipKey]: [
            ...entity[relationshipKey].filter(id => id !== relationshipId), 
            relationshipId
        ]
    };
}

export const removeRelationshipFromEntity = (initialState, entityKey, entityId, relationshipKey, relationshipId) => {
    let pluralEntityKey = pluralize(entityKey);
    let pluralRelationshipKey = pluralize(relationshipKey);
    let newState = {...initialState};
    let entity = getEntity(newState, entityKey, entityId);

    newState[pluralEntityKey] = {
        ...newState[pluralEntityKey],
        [entityId]: removeEntityIdFromRelationshipArray(
            entity, 
            relationshipKey, 
            relationshipId
        )
    };

    return newState;
}

const removeEntityIdFromRelationshipArray = (entity, relationshipKey, relationshipId) => {
    return {
        ...entity,
        [relationshipKey]: entity[relationshipKey].filter(id => id !== relationshipId)
    };
}

export const updateEntity = (state, entityKey, entityId, data) => {
    return insertOrUpdateEntities(state, {
        data: {
            type: entityKey,
            id: entityId,
            attributes: data
        }
    })
}
