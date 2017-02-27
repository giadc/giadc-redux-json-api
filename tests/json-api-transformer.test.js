import chai from 'chai';
import Immutable, { Map, Set } from 'immutable';

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

chai.config.includeStack = true;
const expect = chai.expect;

describe('insertOrUpdateEntities', () => {
    it('parses json data', () => {
        const result = insertOrUpdateEntities(Map({}), initialJsonApiResponse);

        expect(Map.isMap(result)).to.be.true;
        expect(result.keySeq().toArray().sort()).to.eql(['articles', 'comments', 'people']);
        expect(Map.isMap(result.get('articles'))).to.be.true;
        expect(Map.isMap(result.get('comments'))).to.be.true;
        expect(Map.isMap(result.get('people'))).to.be.true;

        expect(result.getIn(['articles', 'byId', '1', 'data', 'author'])).to.equal('9');
        expect(result.getIn(['articles', 'byId', '1', 'data', 'comments']).toArray()).to.eql(['5', '12']);
    });

    it('create a brand new type of entity not via json api data', () => {
        const result = insertOrUpdateEntities(Map({}), {
            type: 'movie',
            id: '123',
            attributes: {
                title: 'Puppy goes swimming',
                rating: 5,
            },
        });

        expect(Map.isMap(result)).to.be.true;
        expect(Map.isMap(result.get('movies'))).to.be.true;
        expect(result.getIn(['movies', 'byId', '123', 'data', 'title'])).to.equal('Puppy goes swimming');
        expect(result.getIn(['movies', 'byId', '123', 'data', 'rating'])).to.equal(5);
    });

    it('throws an error if an entity doesn\'t have an id', () => {
        const entityWithNoId = {
            data: {
                type: 'TestEntity',
            },
        };

        const functionCallWithInvalidEntity = () => insertOrUpdateEntities(Map({}), entityWithNoId);
        expect(functionCallWithInvalidEntity).to.throw(Error, /must have an `id`/);
    });

    it('throws an error if an entity doesn\'t have a type', () => {
        const entityWithNoId = { data: { id: '123', } };

        const functionCallWithInvalidEntity = () => insertOrUpdateEntities(Map({}), entityWithNoId);
        expect(functionCallWithInvalidEntity).to.throw(Error, /must have a `type`/);
    });
});

describe('addRelationshipToEntity', ()=> {
    it('Adds new relationships when given a data wrapped object', () => {
        const state = insertOrUpdateEntities(Map({}), initialJsonApiResponse);
        const result = addRelationshipToEntity(state, 'articles', '1', 'comments', commentJsonResponse);

        expect(result.getIn(['comments', 'byId']).keySeq().isSuperset(['5', '12', '44'])).to.be.true;
        expect(Set.isSet(result.getIn(['articles', 'byId', '1', 'data', 'comments']))).to.be.true;
        expect(result.getIn(['articles', 'byId', '1', 'data', 'comments']).toArray()).to.eql(['5', '12', '44']);
    });

    it('Adds new relationships when given a non-data wrapped object', () => {
        const state = insertOrUpdateEntities(Map({}), initialJsonApiResponse);
        const result = addRelationshipToEntity(state, 'articles', '1', 'comments', commentJsonResponse.data);

        expect(result.getIn(['comments', 'byId']).keySeq().isSuperset(['5', '12', '44'])).to.be.true;
        expect(Set.isSet(result.getIn(['articles', 'byId', '1', 'data', 'comments']))).to.be.true;
        expect(result.getIn(['articles', 'byId', '1', 'data', 'comments']).toArray()).to.eql(['5', '12', '44']);
    });

    it('Adds new relationships when given an array of objects', () => {
        const state = insertOrUpdateEntities(Map({}), initialJsonApiResponse);
        const result = addRelationshipToEntity(state, 'articles', '1', 'comments', commentsJsonResponse);


        expect(result.getIn(['comments', 'byId']).keySeq().isSuperset(['5', '12', '42', '44'])).to.be.true;
        expect(Set.isSet(result.getIn(['articles', 'byId', '1', 'data', 'comments']))).to.be.true;
        expect(result.getIn(['articles', 'byId', '1', 'data', 'comments']).toArray()).to.eql(['5', '12', '42', '44']);
    });

    it('Adds new relationships when given an id', () => {
        const state = insertOrUpdateEntities(Map({}), initialJsonApiResponse);
        const result = addRelationshipToEntity(state, 'articles', '1', 'comments', '42');

        // articles.byId[1].data.comments
        expect(Set.isSet(result.getIn(['articles', 'byId', '1', 'data', 'comments']))).to.be.true;
        expect(result.getIn(['articles', 'byId', '1', 'data', 'comments']).toArray()).to.eql(['5', '12', '42']);
    });

    it('Adds new relationships when given an array of ids', () => {
        const state = insertOrUpdateEntities(Map({}), initialJsonApiResponse);
        const result = addRelationshipToEntity(state, 'articles', '1', 'comments', ['42', '44']);

        expect(Set.isSet(result.getIn(['articles', 'byId', '1', 'data', 'comments']))).to.be.true;
        expect(result.getIn(['articles', 'byId', '1', 'data', 'comments']).toArray()).to.eql(['5', '12', '42', '44']);
    });
});

describe('removeRelationshipFromEntity', () => {
    it('removes a relationship', () => {
        const state = insertOrUpdateEntities(Map({}), initialJsonApiResponse);
        const result = removeRelationshipFromEntity(state, 'articles', '1', 'comments', '5');

        expect(result.getIn(['articles', 'byId', '1', 'data', 'comments']).toArray()).to.eql(['12']);
    });
});

describe('updateEntity', () => {
    it('updates an entity', () => {
        const state = insertOrUpdateEntities(Map({}), initialJsonApiResponse);
        const result = updateEntity(state, 'articles', '1', {
            title: 'New Title'
        });

        expect(result.getIn(['articles', 'byId', '1', 'data', 'title'])).to.equal('New Title');
    });
});

describe('updateEntitiesMeta', () => {
    it('should set a meta property for an entity', () => {
        const state = insertOrUpdateEntities(Map({}), initialJsonApiResponse);
        const updatedState = updateEntitiesMeta(state, 'articles', 'isLoading', true);

        expect(updatedState.getIn(['articles', 'meta', 'isLoading'])).to.equal(true);
    });

    it('should completely replace the metadata for an entity', () => {
        const state = insertOrUpdateEntities(Map({}), initialJsonApiResponse);
        const updatedState = updateEntitiesMeta(state, 'articles', null, { newMetaProperty: 'newMetaValue' });

        expect(updatedState.getIn(['articles', 'meta']).toObject()).to.eql({
            newMetaProperty: 'newMetaValue',
        })
    });
});

describe('removeEntity', () => {
    it('should delete an entity', () => {
        const state = insertOrUpdateEntities(Map({}), initialJsonApiResponse);
        const updatedState = removeEntity(state, 'articles', '1');
        expect(updatedState.getIn(['articles', 'byId']).toObject()).to.eql({});
    });
});

describe('clearEntityType', () => {
    it('should reset an entity type', () => {
        const state = insertOrUpdateEntities(Map({}), initialJsonApiResponse);
        const updatedState = clearEntityType(state, 'articles');
        expect(updatedState.get('articles')).to.eql(undefined);
    });
});
