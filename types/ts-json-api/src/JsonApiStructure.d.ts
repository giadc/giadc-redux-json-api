export interface Attributes {
    [index: string]: string | number | boolean;
}
export interface Relationships {
    [index: string]: {
        data: ResourceObject | ResourceObject[];
        links?: Links;
        meta?: Meta;
    };
}
export interface LinkObject {
    href: string;
    meta: Meta;
}
export interface Links {
    [index: string]: string | LinkObject;
}
export interface Meta {
    [index: string]: any;
}
export interface ResourceObject {
    type: string;
    id?: string;
    attributes?: Attributes;
    relationships?: Relationships;
    links?: Links;
}
export interface Error {
    id?: string;
    links?: Links;
    status?: string;
    code?: string;
    title?: string;
    detail?: string;
    source?: {
        pointer?: string;
        parameter?: string;
    };
    meta?: Meta;
}
export interface JsonApiResponseWithData {
    data: ResourceObject | ResourceObject[];
    included?: ResourceObject[];
    links?: Links;
}
export interface JsonApiResponseWithError {
    errors: [Error];
}
export interface JsonApiResponseWithMetaData {
    meta: Meta;
}
export declare type JsonApiResponse = JsonApiResponseWithData | JsonApiResponseWithError | JsonApiResponseWithMetaData | (JsonApiResponseWithData & JsonApiResponseWithError) | (JsonApiResponseWithData & JsonApiResponseWithMetaData) | (JsonApiResponseWithError & JsonApiResponseWithMetaData) | (JsonApiResponseWithData & JsonApiResponseWithError & JsonApiResponseWithMetaData);
