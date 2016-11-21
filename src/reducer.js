import actionNames from './action-names';
import {
    addRelationshipToEntity,
    clearEntityType,
    insertOrUpdateEntities,
    removeEntity,
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

    [actionNames.REMOVE_ENTITY]: (state, action) => removeEntity(
        state,
        action.entityKey,
        action.entityId,
    ),

    [actionNames.CLEAR_ENTITY_TYPE]: (state, action) => clearEntityType(
        state,
        action.entityKey,
        action.entityId,
    ),

    default: state => state,
};

/**
 * The giadc-redux-json-api reducer
 *
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object}
 */
export default (state = {}, action) => {
    const actionKey = Object.keys(reducerMap)
        .find(key => action.type && action.type.match(new RegExp(`^${key}(_[_A-Z]+)?$`)));

    if (actionKey) {
        return reducerMap[actionKey](state, action);
    }

    return reducerMap.default(state, action);
};
