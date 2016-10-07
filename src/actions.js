import pluralize from 'pluralize';
import { actionNames } from './constants';

export const loadJsonApiEntityData = data => ({
    type: actionNames.LOAD_JSON_API_ENTITY_DATA,
    data,
});

export const addRelationshipToEntity = (entityKey, entityId, relationshipKey, relationshipObject) => ({
    type: `${actionNames.ADD_RELATIONSHIP_TO_ENTITY}_${pluralize(entityKey, 1).toUpperCase()}_${pluralize(relationshipKey).toUpperCase()}`,
    entityKey,
    entityId,
    relationshipKey,
    relationshipObject,
});

export const removeRelationshipFromEntity = (entityKey, entityId, relationshipKey, relationshipId) => ({
    type: `${actionNames.REMOVE_RELATIONSHIP_FROM_ENTITY}_${pluralize(entityKey, 1).toUpperCase()}_${pluralize(relationshipKey).toUpperCase()}`,
    entityKey,
    entityId,
    relationshipKey,
    relationshipId,
});

export const updateEntity = (entityKey, entityId, data) => ({
    type: `${actionNames.UPDATE_ENTITY}_${pluralize(entityKey, 1).toUpperCase()}`,
    entityKey,
    entityId,
    data,
});

export const updateEntitiesMeta = (entityKey, metaKey, value) => ({
    type: `${actionNames.UPDATE_ENTITIES_META}_${pluralize(entityKey).toUpperCase()}`,
    entityKey,
    metaKey,
    value,
});

export const updateEntityMeta = (entityKey, entityId, metaKey, value) => ({
    type: `${actionNames.UPDATE_ENTITY_META}_${pluralize(entityKey, 1).toUpperCase()}`,
    entityKey,
    entityId,
    metaKey,
    value,
});
