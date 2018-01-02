import { iMeta, iResourceObject } from 'ts-json-api';
import { Action } from './actions';
export interface iEntityCollection {
    meta: iMeta;
    byId: {
        [index: string]: iResourceObject;
    };
}
export interface iState {
    [index: string]: iEntityCollection;
}
export interface iReducer {
    (state: iState, action: Action): iState;
}
