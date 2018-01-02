import { iResourceObject, iJsonApiResponseWithData } from 'ts-json-api';

export type FlexiblePayload = iResourceObject | iResourceObject[] | iJsonApiResponseWithData;
