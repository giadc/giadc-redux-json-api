import { Meta, ResourceObject } from 'ts-json-api';
import { Action } from './actions';

export interface iEntityCollection {
    meta: Meta,
    byId: {
        [index: string]: ResourceObject,
    }
}

export interface iState {
    [index: string]: iEntityCollection,
}

export interface iReducer {
    (state: iState, action: Action): iState
}
