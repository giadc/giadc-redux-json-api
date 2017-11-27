import { Meta, ResourceObject } from 'ts-json-api';
export interface iEntityCollection {
    meta: Meta;
    byId: {
        [index: string]: ResourceObject;
    };
}
export interface iState {
    [index: string]: iEntityCollection;
}
