import * as R from 'ramda';
import { iResourceObject } from 'ts-json-api';

import { reducer } from '../src/giadc-redux-json-api';
import actionNames from '../src/action-names';
import { commentJsonResponse, initialJsonApiResponse, serverSideRendering } from './exampleData';

const initialExpectedState = reducer({}, {
    type: actionNames.LOAD_JSON_API_ENTITY_DATA,
    data: initialJsonApiResponse
});

describe('reducer', () => {
    it('should return the initial state', () => {
        const result = reducer(undefined);
        expect(result).toEqual({});
    });

    it('should handle an initial LOAD_JSON_API_ENTITY_DATA', () => {
        expect(Object.keys(initialExpectedState).sort()).toEqual(['articles', 'comments', 'people']);
        expect(R.path(['articles', 'byId', '1', 'relationships', 'author', 'data', 'id'], initialExpectedState)).toEqual('9');
        expect(
            (<iResourceObject[]>R.path(['articles', 'byId', '1', 'relationships', 'comments', 'data'], initialExpectedState))
            .map(comment => comment.id)
        ).toEqual(['5', '12']);
    });

    it('should handle an additional LOAD_JSON_API_ENTITY_DATA', () => {
        const result = reducer(initialExpectedState, {
            type: actionNames.LOAD_JSON_API_ENTITY_DATA,
            data: commentJsonResponse,
        });

        expect(R.path(['comments', 'byId', '44'], result)).toBeTruthy;
        expect(R.path(['comments', 'byId', '44', 'attributes', 'body'], result)).toEqual('This is a terrible comment');
        expect(R.path(['comments', 'byId', '44', 'relationships', 'author', 'data', 'id'], result)).toEqual('9');
    });

    it('should handle ADD_RELATIONSHIP_TO_ENTITY', () => {
        const result = reducer(initialExpectedState, {
            type: actionNames.ADD_RELATIONSHIP_TO_ENTITY + '_ARTICLE_COMMENTS',
            entityKey: 'article',
            entityId: '1',
            relationshipKey: 'comments',
            relationshipObject: commentJsonResponse,
        });

        expect(R.path(['comments', 'byId', '44'], result)).toBeTruthy;
        expect(
            (<iResourceObject[]>R.path(['articles', 'byId', '1', 'relationships', 'comments', 'data'], result))
                .map(comment => comment.id)
        ).toEqual(['5', '12', '44']);
    });

    it('should handle REMOVE_RELATIONSHIP_FROM_ENTITY', () => {
        const result = reducer(initialExpectedState, {
            type: actionNames.REMOVE_RELATIONSHIP_FROM_ENTITY + '_ARTICLE_COMMENTS',
            entityKey: 'article',
            entityId: '1',
            relationshipKey: 'comments',
            relationshipId: '5'
        });
        expect(
            (<iResourceObject[]>R.path(['articles', 'byId', '1', 'relationships', 'comments', 'data'], result))
                .map(comment => comment.id)
        ).toEqual(['12']);
    });

    it('should handle a SET_RELATIONSHIP_ON_ENTITY', () => {
        const result = reducer(initialExpectedState, {
            type: actionNames.SET_RELATIONSHIP_ON_ENTITY + '_ARTICLE_EDITOR',
            entityKey: 'article',
            entityId: '1',
            relationshipKey: 'editor',
            relationshipObject: {
                type: 'people',
                id: '999',
                attributes: {
                    'first-name': 'Triet',
                    'last-name': 'Hill',
                    'twitter': 't_swizzle'
                }
            }
        });

        expect(R.path(['articles', 'byId', '1', 'relationships', 'editor', 'data', 'id'], result)).toEqual('999');
        expect(R.path(['people', 'byId', '999', 'attributes', 'first-name'], result)).toEqual('Triet');
    });

    it('should handle a CLEAR_RELATIONSHIP_ON_ENTITY', () => {
        const result = reducer(initialExpectedState, {
            type: actionNames.CLEAR_RELATIONSHIP_ON_ENTITY + '_ARTICLE_COMMENTS',
            entityKey: 'article',
            entityId: '1',
            relationshipKey: 'comments',
        });

        expect(R.path(['articles', 'byId', '1', 'relationships', 'comments'], result)).toBeUndefined();
    });

    it('should handle UPDATE_ENTITY', () => {
        const result = reducer(initialExpectedState, {
            type: actionNames.UPDATE_ENTITY + '_ARTICLE',
            entityKey: 'article',
            entityId: '1',
            data: {
                title:'JSON API does not paint my bikeshed!'
            }
        });

        expect(R.path(['articles', 'byId', '1', 'attributes', 'title'], result)).toEqual('JSON API does not paint my bikeshed!');
    });

    it('should handle UPDATE_ENTITIES_META and replace a single metadata property', () => {
        const result = reducer(initialExpectedState, {
            type: actionNames.UPDATE_ENTITIES_META + '_ARTICLES',
            entityKey: 'article',
            metaKey: 'randomMetaKey',
            value: true,
        });

        expect(R.path(['articles', 'meta', 'randomMetaKey'], result)).toEqual(true);
    });

    it('should handle UPDATE_ENTITIES_META and completely replace the meta object', () => {
        const result = reducer(initialExpectedState, {
            type: actionNames.UPDATE_ENTITIES_META + '_ARTICLES',
            entityKey: 'article',
            metaKey: null,
            value: { newMetaProperty: 'newMetaValue' },
        });

        expect(R.path(['articles', 'meta'], result)).toEqual({ newMetaProperty: 'newMetaValue' });
    });

    it('should handle UPDATE_ENTITY_META and replace a single metadata property', () => {
        const result = reducer(initialExpectedState, {
            type: actionNames.UPDATE_ENTITY_META + '_ARTICLE',
            entityKey: 'article',
            entityId: '1',
            metaKey: 'isLoading',
            value: true,
        });

        expect(R.path(['articles', 'byId', '1', 'meta', 'isLoading'], result)).toEqual(true);
    });

    it('should handle UPDATE_ENTITY_META and completely replace the meta object', () => {
        const result = reducer(initialExpectedState, {
            type: actionNames.UPDATE_ENTITY_META + '_ARTICLE',
            entityKey: 'article',
            entityId: '1',
            metaKey: null,
            value: { randomMetaKey: true },
        });

        expect(R.path(['articles', 'byId', '1', 'meta'], result)).toEqual({ randomMetaKey: true });
    });

    it('should handle REMOVE_ENTITY', () => {
        const result = reducer(initialExpectedState, {
            type: actionNames.REMOVE_ENTITY + '_ARTICLE',
            entityKey: 'article',
            entityId: '1',
        });
        expect(result.articles.byId).toEqual({});
    });

    it('should handle CLEAR_ENTITY_TYPE', () => {
        const result = reducer(initialExpectedState, {
            type: actionNames.CLEAR_ENTITY_TYPE + '_ARTICLES',
            entityKey: 'articles',
        });

        expect(result.articles).toEqual(undefined);
    });
});
