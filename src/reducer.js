import { actionNames } from './constants';
import {
    insertOrUpdateEntities, addRelationshipToEntity, removeRelationshipFromEntity
} from './json-api-transformer';

export const reducer = (state = {}, action) => {
    switch (action.type) {
        case actionNames.INSERT_OR_UPDATE_ENTITIES:
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

        default:
            return state;
    }
}
