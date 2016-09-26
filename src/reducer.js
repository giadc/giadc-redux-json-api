import { actionNames } from './constants';
import {
    insertOrUpdateEntities,
    addRelationshipToEntity,
    removeRelationshipFromEntity,
    updateEntity,
    updateEntitiesMeta,
} from './json-api-transformer';

export const reducer = (state = {}, action) => {
    switch (action.type) {
        case actionNames.LOAD_JSON_API_ENTITY_DATA:
            return insertOrUpdateEntities(state, action.data);

        case actionNames.ADD_RELATIONSHIP_TO_ENTITY:
            return addRelationshipToEntity(
                state,
                action.entityKey,
                action.entityId,
                action.relationshipKey,
                action.relationshipObject
            );

        case actionNames.REMOVE_RELATIONSHIP_FROM_ENTITY:
            return removeRelationshipFromEntity(
                state,
                action.entityKey,
                action.entityId,
                action.relationshipKey,
                action.relationshipId
            );

        case actionNames.UPDATE_ENTITY:
            return updateEntity(
                state,
                action.entityKey,
                action.entityId,
                action.data
            );

        case actionNames.UPDATE_ENTITIES_META:
            return updateEntitiesMeta(
                state,
                action.entityKey,
                action.metaKey,
                action.value,
            );

        default:
            return state;
    }
};
