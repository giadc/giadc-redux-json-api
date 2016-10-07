import { actionNames } from './constants';
import {
    insertOrUpdateEntities,
    addRelationshipToEntity,
    removeRelationshipFromEntity,
    updateEntity,
    updateEntitiesMeta,
    updateEntityMeta,
} from './json-api-transformer';

const reducerMap = {
    [actionNames.LOAD_JSON_API_ENTITY_DATA]: (state, action) => insertOrUpdateEntities(state, action.data),

    [actionNames.ADD_RELATIONSHIP_TO_ENTITY]: (state, action) => addRelationshipToEntity(
        state,
        action.entityKey,
        action.entityId,
        action.relationshipKey,
        action.relationshipObject
    ),

    [actionNames.REMOVE_RELATIONSHIP_FROM_ENTITY]: (state, action) => removeRelationshipFromEntity(
        state,
        action.entityKey,
        action.entityId,
        action.relationshipKey,
        action.relationshipId
    ),

    [actionNames.UPDATE_ENTITIES_META]: (state, action) => updateEntitiesMeta(
        state,
        action.entityKey,
        action.metaKey,
        action.value,
    ),

    [actionNames.UPDATE_ENTITY_META]: (state, action) => updateEntityMeta(
        state,
        action.entityKey,
        action.entityId,
        action.metaKey,
        action.value,
    ),

    [actionNames.UPDATE_ENTITY]: (state, action) => updateEntity(
        state,
        action.entityKey,
        action.entityId,
        action.data
    ),

    default: state => state,
};

export default (state = {}, action) => {
    const actionKey = Object.keys(reducerMap)
        .find(key => action.type && action.type.match(new RegExp(`^${key}(_[_A-Z]+)?$`)));

    if (actionKey) {
        return reducerMap[actionKey](state, action);
    }

    return reducerMap.default(state, action);
};
