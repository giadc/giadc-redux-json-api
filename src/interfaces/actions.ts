import { Attributes, JsonApiResponseWithData, ResourceObject } from "ts-json-api";

export interface iLoadAction {
    type: string,
    data: JsonApiResponseWithData,
}

export interface iAddRelationshipAction {
    type: string,
    entityKey: string,
    entityId: string,
    relationshipObject: ResourceObject | JsonApiResponseWithData,
}

export interface iRemoveRelationshipAction {
    type: string,
    entityKey: string,
    entityId: string,
    relationshipKey: string,
    relationshipId: string,
}

export interface iUpdateEntitiesMetaAction {
    type: string,
    entityKey: string,
    metaKey: string,
    value: any,
}

export interface iUpdateEntityMetaAction {
    type: string,
    entityKey: string,
    entityId: string
    metaKey: string,
    value: any,
}

export interface iUpdateEntityAction {
    type: string,
    entityKey: string,
    entityId: string,
    data: Attributes,
}

export interface iRemoveEntityAction {
    type: string,
    entityKey: string,
    entityId: string,
}

export interface iClearEntityTypeAction {
    type: string,
    entityKey: string,
}

export type Action = iLoadAction
    | iAddRelationshipAction
    | iRemoveRelationshipAction
    | iUpdateEntitiesMetaAction
    | iUpdateEntityMetaAction
    | iUpdateEntityAction
    | iRemoveEntityAction
    | iClearEntityTypeAction;
