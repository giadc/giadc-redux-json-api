import actionNames from './action-names';
import * as actions from './interfaces/actions';
import { iReducer, iState } from './interfaces/state';
import {
    addRelationshipToEntity,
    clearEntityType,
    insertOrUpdateEntities,
    removeEntity,
    removeRelationshipFromEntity,
    setRelationshipOnEntity,
    updateEntity,
    updateEntitiesMeta,
    updateEntityMeta,
    clearRelationshipOnEntity,
} from './json-api-transformer'

const reducerMap = {
    [actionNames.LOAD_JSON_API_ENTITY_DATA]: (state: iState, action: actions.iLoadAction) => insertOrUpdateEntities(state, action.data),

    [actionNames.ADD_RELATIONSHIP_TO_ENTITY]: (state: iState, action: actions.iAddRelationshipAction) => addRelationshipToEntity(
        state,
        action.entityKey,
        action.entityId,
        action.relationshipKey,
        action.relationshipObject
    ),

    [actionNames.REMOVE_RELATIONSHIP_FROM_ENTITY]: (state: iState, action: actions.iRemoveRelationshipAction) => removeRelationshipFromEntity(
        state,
        action.entityKey,
        action.entityId,
        action.relationshipKey,
        action.relationshipId
    ),

    [actionNames.SET_RELATIONSHIP_ON_ENTITY]: (state: iState, action: actions.iSetRelationshipAction) => setRelationshipOnEntity(
        state,
        action.entityKey,
        action.entityId,
        action.relationshipKey,
        action.relationshipObject
    ),

    [actionNames.CLEAR_RELATIONSHIP_ON_ENTITY]: (state: iState, action: actions.iClearRelationshipAction) => clearRelationshipOnEntity(
        state,
        action.entityKey,
        action.entityId,
        action.relationshipKey,
    ),

    [actionNames.UPDATE_ENTITIES_META]: (state: iState, action: actions.iUpdateEntitiesMetaAction) => updateEntitiesMeta(
        state,
        action.entityKey,
        action.metaKey,
        action.value,
    ),

    [actionNames.UPDATE_ENTITY_META]: (state: iState, action: actions.iUpdateEntityMetaAction) => updateEntityMeta(
        state,
        action.entityKey,
        action.entityId,
        action.metaKey,
        action.value,
    ),

    [actionNames.UPDATE_ENTITY]: (state: iState, action: actions.iUpdateEntityAction) => updateEntity(
        state,
        action.entityKey,
        action.entityId,
        action.data
    ),

    [actionNames.REMOVE_ENTITY]: (state: iState, action: actions.iRemoveEntityAction) => removeEntity(
        state,
        action.entityKey,
        action.entityId,
    ),

    [actionNames.CLEAR_ENTITY_TYPE]: (state: iState, action: actions.iClearEntityTypeAction) => clearEntityType(
        state,
        action.entityKey,
    ),

    default: (state: iState) => state,
};

/**
 * The giadc-redux-json-api reducer
 *
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object}
 */
export default (state: iState = {}, action?: actions.Action) => {
    const actionKey = action && Object.keys(reducerMap)
        .find(key => action.type && !!action.type.match(new RegExp(`^${key}(_[_A-Z]+)?$`)));

    if (actionKey) {
        return (<iReducer>reducerMap[actionKey])(state, action);
    }

    return reducerMap.default(state);
};
