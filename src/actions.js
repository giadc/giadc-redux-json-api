import { actionNames } from './constants';

export const loadJsonApiEntityData = data => ({
    type: actionNames.LOAD_JSON_API_ENTITY_DATA,
    data,
});

export const addRelationshipToEntity = (entityKey, entityId, relationshipKey, relationshipObject) => ({
    type: actionNames.ADD_RELATIONSHIP_TO_ENTITY,
    entityKey,
    entityId,
    relationshipKey,
    relationshipObject,
});

export const removeRelationshipFromEntity = (entityKey, entityId, relationshipKey, relationshipId) => ({
    type: actionNames.REMOVE_RELATIONSHIP_FROM_ENTITY,
    entityKey,
    entityId,
    relationshipKey,
    relationshipId,
});

export const updateEntity = (entityKey, entityId, data) => ({
    type: actionNames.UPDATE_ENTITY,
    entityKey,
    entityId,
    data,
});
