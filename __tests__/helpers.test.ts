import * as R from 'ramda';
import { iJsonApiResponseWithData } from 'ts-json-api';

import {
    getEntity,
    getEntities,
    getId,
    getIds,
    getEntitiesMeta,
    getEntityMeta,
} from '../src/helpers';

import { iState } from '../src/interfaces/state';

import { commentJsonResponse, initialJsonApiResponse } from './exampleData';
import { insertOrUpdateEntities } from '../src/json-api-transformer';

const reverseMerge = R.flip(R.merge);

const state = R.pipe(
    R.assocPath(['articles', 'meta'], { isLoading: true, anotherMetaProperty: 666 }),
    R.assocPath(['articles', 'byId', '1', 'meta', 'isLoading'], true)
)(
    insertOrUpdateEntities({}, initialJsonApiResponse)
);

describe('getEntity', () => {
    it('should return an entity', () => {
        const entity = getEntity(<iState>state, 'article', '1');

        expect(entity.id).toEqual('1');
        expect(entity.type).toEqual('articles');
        expect(entity.attributes).toEqual({
            'title': 'JSON API paints my bikeshed!',
        });
    });

    it('should return `undefined` if the entity does not exist', () => {
        expect(getEntity(<iState>state, 'article', '666')).toEqual(undefined);
    });
});

describe('getEntities', () => {
    it('should return all entities', () => {
        const results = getEntities(<iState>state, 'comments');
        expect(results[0].attributes).toEqual({
            "body": "First!",
        });

        expect(results[1].attributes).toEqual({
            "body": "I like XML better",
        });
    });

    it('should return a subset of entities', () => {
        const results = getEntities(<iState>state, 'comments', ["5", "12"]);

        expect(results[0].attributes).toEqual({
            "body": "First!",
        });

        expect(results[1].attributes).toEqual({
            "body": "I like XML better",
        });
    });

    it('should return only entities that exist', () => {
        const results = getEntities(<iState>state, 'comments', ["5", "666"]);
        expect(results.length).toEqual(1);
        expect(results[0].attributes).toEqual({
            "body": "First!",
        });
    });

    it('should return an empty array if the entities do not exist', () => {
        expect(getEntities(<iState>state, 'comments', ['666', '777'])).toEqual([]);
        expect(getEntities(<iState>state, 'spicyboys')).toEqual([]);
    });
});

describe('getId', () => {
    it('should return a single id', () => {
        expect(getId(commentJsonResponse)).toEqual('44');
    });
});

describe('getIds', () => {
    it('should return an array of ids', () => {
        const jsonResponse = {"data":[{"type":"tag","id":"banana","attributes":{"name":"Banana"}},{"type":"tag","id":"hammock","attributes":{"name":"Hammock"}},{"type":"tag","id":"sop","attributes":{"name":"SOP"}}],"meta":{"pagination":{"total":6,"count":6,"per_page":15,"current_page":1,"total_pages":1,"links":[]}}};
        expect(getIds(jsonResponse)).toEqual(["banana", "hammock", "sop"]);
    });
});

describe('getEntitiesMeta', () => {
    it('should return all the meta data for an entity type', () => {
        expect(getEntitiesMeta(<iState>state, 'articles')).toEqual({
            isLoading: true,
            anotherMetaProperty: 666
        });
    });

    it('should return a specific meta property\'s value for an entity group', () => {
        expect(getEntitiesMeta(<iState>state, 'articles', 'isLoading')).toEqual(true);
    });

    it('should return `undefined` if no meta data exists for an entity group', () => {
        expect(getEntitiesMeta(<iState>state, 'articles', 'invalidMetaKey')).toEqual(undefined);
        expect(getEntitiesMeta(<iState>state, 'authors')).toEqual(undefined);
    })
});

describe('getEntityMeta', () => {
    it('should return all the meta data for an entity type', () => {
        expect(getEntityMeta(<iState>state, 'articles', '1')).toEqual({
            isLoading: true,
        });
    });

    it('should return a specific meta property\'s value for an entity group', () => {
        expect(getEntityMeta(<iState>state, 'articles', '1', 'isLoading')).toEqual(true);
    });

    it('should return `undefined` if no meta data exists for an entity group', () => {
        expect(getEntityMeta(<iState>state, 'articles', '1', 'invalidMetaKey')).toEqual(undefined);
        expect(getEntityMeta(<iState>state, 'authors', '1')).toEqual(undefined);
    })
});
