import { expect } from 'chai';
import { reducer } from '../lib/reducer';
import * as actions from '../lib/actions';
import { actionNames } from '../lib/constants';

const initialJsonApiResponse = {"links":{"self":"http://example.com/articles","next":"http://example.com/articles?page[offset]=2","last":"http://example.com/articles?page[offset]=10"},"data":[{"type":"articles","id":"1","attributes":{"title":"JSON API paints my bikeshed!"},"relationships":{"author":{"links":{"self":"http://example.com/articles/1/relationships/author","related":"http://example.com/articles/1/author"},"data":{"type":"people","id":"9"}},"comments":{"links":{"self":"http://example.com/articles/1/relationships/comments","related":"http://example.com/articles/1/comments"},"data":[{"type":"comments","id":"5"},{"type":"comments","id":"12"}]}},"links":{"self":"http://example.com/articles/1"}}],"included":[{"type":"people","id":"9","attributes":{"first-name":"Dan","last-name":"Gebhardt","twitter":"dgeb"},"links":{"self":"http://example.com/people/9"}},{"type":"comments","id":"5","attributes":{"body":"First!"},"relationships":{"author":{"data":{"type":"people","id":"2"}}},"links":{"self":"http://example.com/comments/5"}},{"type":"comments","id":"12","attributes":{"body":"I like XML better"},"relationships":{"author":{"data":{"type":"people","id":"9"}}},"links":{"self":"http://example.com/comments/12"}}]};
const initialExpectedState = {"articles": {"meta": {},"byId": {"1": {"id": "1","title": "JSON API paints my bikeshed!","author": "9","comments": ["5", "12"]}}},"people": {"meta": {},"byId": {"9": {"id": "9","first-name": "Dan","last-name": "Gebhardt","twitter": "dgeb"}}},"comments": {"meta": {},"byId": {"5": {"id": "5","body": "First!","author": "2"},"12": {"id": "12","body": "I like XML better","author": "9"}}}};

describe('reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).to.eql({});
    });

    it('should handle an initial LOAD_JSON_API_ENTITY_DATA', () => {
        expect(reducer({}, {
            type: actionNames.LOAD_JSON_API_ENTITY_DATA,
            data: initialJsonApiResponse
        })).to.eql(initialExpectedState);
    });
    
    it('should handle an additional LOAD_JSON_API_ENTITY_DATA', () => {
        const additionalJsonApiResponse = {"data":{"type":"comment","id":"44","attributes":{"body":"This is a terrible comment"},"relationships":{"author":{"data":{"type":"people","id":"9"}}}}};
        const expectedState = {"articles": {"meta": {},"byId": {"1": {"id": "1","title": "JSON API paints my bikeshed!","author": "9","comments": ["5", "12"]}}},"people": {"meta": {},"byId": {"9": {"id": "9","first-name": "Dan","last-name": "Gebhardt","twitter": "dgeb"}}},"comments": {"meta": {},"byId": {"5": {"id": "5","body": "First!","author": "2"},"12": {"id": "12","body": "I like XML better","author": "9"},"44": {"id": "44","body": "This is a terrible comment","author": "9"}}}};

        expect(reducer(initialExpectedState, {
            type: actionNames.LOAD_JSON_API_ENTITY_DATA,
            data: additionalJsonApiResponse
        })).to.eql(expectedState);
    });

    it('should handle ADD_RELATIONSHIP_TO_ENTITY', () => {
        const relationshipObject = {"type":"comment","id":"44","attributes":{"body":"This is a terrible comment"},"relationships":{"author":{"data":{"type":"people","id":"9"}}}};
        const expectedState = {"articles": {"meta": {},"byId": {"1": {"id": "1","title": "JSON API paints my bikeshed!","author": "9","comments": ["5", "12", "44"]}}},"people": {"meta": {},"byId": {"9": {"id": "9","first-name": "Dan","last-name": "Gebhardt","twitter": "dgeb"}}},"comments": {"meta": {},"byId": {"5": {"id": "5","body": "First!","author": "2"},"12": {"id": "12","body": "I like XML better","author": "9"},"44": {"id": "44","body": "This is a terrible comment","author": "9"}}}};

        expect(reducer(initialExpectedState, {
            type: actionNames.ADD_RELATIONSHIP_TO_ENTITY,
            entityKey: 'article',
            entityId: '1',
            relationshipKey: 'comments',
            relationshipObject
        })).to.eql(expectedState);
    });

    it('should handle REMOVE_RELATIONSHIP_FROM_ENTITY', () => {
        const expectedState = {"articles": {"meta": {},"byId": {"1": {"id": "1","title": "JSON API paints my bikeshed!","author": "9","comments": ["12"]}}},"people": {"meta": {},"byId": {"9": {"id": "9","first-name": "Dan","last-name": "Gebhardt","twitter": "dgeb"}}},"comments": {"meta": {},"byId": {"5": {"id": "5","body": "First!","author": "2"},"12": {"id": "12","body": "I like XML better","author": "9"}}}};

        expect(reducer(initialExpectedState, {
            type: actionNames.REMOVE_RELATIONSHIP_FROM_ENTITY,
            entityKey: 'article',
            entityId: '1',
            relationshipKey: 'comments',
            relationshipId: '5'
        })).to.eql(expectedState);
    });

    it('should handle UPDATE_ENTITY', () => {
        const expectedState = {"articles": {"meta": {},"byId": {"1": {"id": "1","title": "JSON API does not paint my bikeshed!","author": "9","comments": ["5", "12"]}}},"people": {"meta": {},"byId": {"9": {"id": "9","first-name": "Dan","last-name": "Gebhardt","twitter": "dgeb"}}},"comments": {"meta": {},"byId": {"5": {"id": "5","body": "First!","author": "2"},"12": {"id": "12","body": "I like XML better","author": "9"}}}};

        expect(reducer(initialExpectedState, {
            type: actionNames.UPDATE_ENTITY,
            entityKey: 'article',
            entityId: '1',
            data: {
                title:'JSON API does not paint my bikeshed!'
            }
        })).to.eql(expectedState);
    })
});
