import { iAttributes,  iJsonApiResponseWithData, iResourceObject } from "ts-json-api";

import { FlexiblePayload } from './other';

export interface iLoadAction {
    type: string,
    data: FlexiblePayload,
}

export interface iAddRelationshipAction {
    type: string,
    entityKey: string,
    entityId: string,
    relationshipKey: string,
    relationshipObject: FlexiblePayload,
}

export interface iRemoveRelationshipAction {
    type: string,
    entityKey: string,
    entityId: string,
    relationshipKey: string,
    relationshipId: string,
}

export interface iSetRelationshipAction {
    type: string,
    entityKey: string,
    entityId: string,
    relationshipKey: string,
    relationshipObject: FlexiblePayload,
}

export interface iClearRelationshipAction {
    type: string,
    entityKey: string,
    entityId: string,
    relationshipKey: string,
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
    data: iAttributes,
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
    | iSetRelationshipAction
    | iUpdateEntitiesMetaAction
    | iUpdateEntityMetaAction
    | iUpdateEntityAction
    | iRemoveEntityAction
    | iClearEntityTypeAction;
