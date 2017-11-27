import { JsonApiResponseWithData, ResourceObject } from 'ts-json-api';
import * as R from 'ramda';

import {
    addRelationshipToEntity,
    clearEntityType,
    insertOrUpdateEntities,
    removeEntity,
    removeRelationshipFromEntity,
    updateEntity,
    updateEntitiesMeta,
} from '../src/json-api-transformer';
import { commentJsonResponse, commentsJsonResponse, initialJsonApiResponse } from './exampleData';

describe('insertOrUpdateEntities', () => {
    it('parses json data', () => {
        const result = insertOrUpdateEntities({}, initialJsonApiResponse);

        expect(Object.keys(result).sort()).toEqual(['articles', 'comments', 'people']);
        expect(R.path(['articles', 'byId', '1', 'relationships', 'author', 'data', 'id'], result)).toEqual('9');
        expect(
            (<ResourceObject[]>R.path(['articles', 'byId', '1', 'relationships', 'comments', 'data'], result))
                .map(comment => comment.id)
        ).toEqual(['5', '12']);
    });

    it('create a brand new type of entity not via json api data', () => {
        const result = insertOrUpdateEntities({}, {
            type: 'movie',
            id: '123',
            attributes: {
                title: 'Puppy goes swimming',
                rating: 5,
            },
        });

        expect(R.path(['movies', 'byId', '123', 'attributes', 'title'], result)).toEqual('Puppy goes swimming');
        expect(R.path(['movies', 'byId', '123', 'attributes', 'rating'], result)).toEqual(5);
    });

    it('throws an error if an entity doesn\'t have an id', () => {
        const entityWithNoId = {
            data: {
                type: 'TestEntity',
            },
        };

        const functionCallWithInvalidEntity = () => insertOrUpdateEntities({}, entityWithNoId);
        expect(functionCallWithInvalidEntity).toThrow(/must have an `id`/);
    });

    it('throws an error if an entity doesn\'t have a type', () => {
        const entityWithNoType = { data: { id: '123', } };

        const functionCallWithInvalidEntity = () => insertOrUpdateEntities({}, entityWithNoType);
        expect(functionCallWithInvalidEntity).toThrow(/must have a `type`/);
    });
});

describe('addRelationshipToEntity', ()=> {
    it('Adds new relationships when given a data wrapped object', () => {
        const state = insertOrUpdateEntities({}, initialJsonApiResponse);
        const result = addRelationshipToEntity(state, 'articles', '1', 'comments', commentJsonResponse);

        expect(Object.keys(R.path(['comments', 'byId'], result))).toEqual(['5', '12', '44']);
        expect(
            (<ResourceObject[]>R.path(['articles', 'byId', '1', 'relationships', 'comments', 'data'], result))
                .map(comment => comment.id)
        ).toEqual(['5', '12', '44']);
    });

    it('Adds new relationships when given a non-data wrapped object', () => {
        const state = insertOrUpdateEntities({}, initialJsonApiResponse);
        const result = addRelationshipToEntity(state, 'articles', '1', 'comments', commentJsonResponse.data);

        expect(Object.keys(R.path(['comments', 'byId'], result))).toEqual(['5', '12', '44']);
        expect(
            (<ResourceObject[]>R.path(['articles', 'byId', '1', 'relationships', 'comments', 'data'], result))
                .map(comment => comment.id)
        ).toEqual(['5', '12', '44']);
   });

    it('Adds new relationships when given an array of objects', () => {
        const state = insertOrUpdateEntities({}, initialJsonApiResponse);
        const result = addRelationshipToEntity(state, 'articles', '1', 'comments', commentsJsonResponse);


        expect(Object.keys(R.path(['comments', 'byId'], result))).toEqual(['5', '12', '42', '44']);
        expect(
            (<ResourceObject[]>R.path(['articles', 'byId', '1', 'relationships', 'comments', 'data'], result))
                .map(comment => comment.id)
        ).toEqual(['5', '12', '42', '44']);
    });
});

describe('removeRelationshipFromEntity', () => {
    it('removes a relationship', () => {
        const state = insertOrUpdateEntities({}, initialJsonApiResponse);
        const result = removeRelationshipFromEntity(state, 'articles', '1', 'comments', '5');

        expect(
            (<ResourceObject[]>R.path(['articles', 'byId', '1', 'relationships', 'comments', 'data'], result))
                .map(comment => comment.id)
        ).toEqual(['12']);
    });
});

describe('updateEntity', () => {
    it('updates an entity', () => {
        const state = insertOrUpdateEntities({}, initialJsonApiResponse);
        const result = updateEntity(state, 'articles', '1', {
            title: 'New Title'
        });

        expect(R.path(['articles', 'byId', '1', 'attributes', 'title'], result)).toEqual('New Title');
    });
});

describe('updateEntitiesMeta', () => {
    it('should set a meta property for an entity', () => {
        const state = insertOrUpdateEntities({}, initialJsonApiResponse);
        const updatedState = updateEntitiesMeta(state, 'articles', 'isLoading', true);

        expect(R.path(['articles', 'meta', 'isLoading'], updatedState)).toEqual(true);
    });

    it('should completely replace the metadata for an entity', () => {
        const state = insertOrUpdateEntities({}, initialJsonApiResponse);
        const updatedState = updateEntitiesMeta(state, 'articles', null, { newMetaProperty: 'newMetaValue' });

        expect(R.path(['articles', 'meta'], updatedState)).toEqual({
            newMetaProperty: 'newMetaValue',
        });
    });
});

describe('removeEntity', () => {
    it('should delete an entity', () => {
        const state = insertOrUpdateEntities({}, initialJsonApiResponse);
        const updatedState = removeEntity(state, 'articles', '1');
        expect(R.path(['articles', 'byId'], updatedState)).toEqual({});
    });
});

describe('clearEntityType', () => {
    it('should reset an entity type', () => {
        const state = insertOrUpdateEntities({}, initialJsonApiResponse);
        const updatedState = clearEntityType(state, 'articles');
        expect(updatedState.articles).toEqual(undefined);
    });
});
