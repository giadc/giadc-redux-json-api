import chai from 'chai';
import {
    addRelationshipToEntity,
    clearEntityType,
    insertOrUpdateEntities,
    removeEntity,
    removeRelationshipFromEntity,
    updateEntity,
    updateEntitiesMeta,
} from '../lib/json-api-transformer';

chai.config.includeStack = true;

const expect = chai.expect;

const initialJsonResponse = {"links": {"self": "http://example.com/articles","next": "http://example.com/articles?page[offset]=2","last": "http://example.com/articles?page[offset]=10"},"data": [{"type": "articles","id": "1","attributes": {"title": "JSON API paints my bikeshed!"},"relationships": {"author": {"links": {"self": "http://example.com/articles/1/relationships/author","related": "http://example.com/articles/1/author"},"data": {"type": "people","id": "9"}},"comments": {"links": {"self": "http://example.com/articles/1/relationships/comments","related": "http://example.com/articles/1/comments"},"data": [{"type": "comments","id": "5"}, {"type": "comments","id": "12"}]}},"links": {"self": "http://example.com/articles/1"}}],"included": [{"type": "people","id": "9","attributes": {"first-name": "Dan","last-name": "Gebhardt","twitter": "dgeb"},"links": {"self": "http://example.com/people/9"}}, {"type": "comments","id": "5","attributes": {"body": "First!"},"relationships": {"author": {"data": {"type": "people","id": "2"}}},"links": {"self": "http://example.com/comments/5"}}, {"type": "comments","id": "12","attributes": {"body": "I like XML better"},"relationships": {"author": {"data": {"type": "people","id": "9"}}},"links": {"self": "http://example.com/comments/12"}}],"meta": {"exampleMeta": true}};

describe('insertOrUpdateEntities', () => {
    it('parses json data', () => {
        const result = insertOrUpdateEntities({}, initialJsonResponse);

        expect(result).to.be.an('object');
        expect(result).to.have.all.keys(['articles', 'comments', 'people']);
        expect(result.articles).to.be.an('object');
        expect(result.comments).to.be.an('object');
        expect(result.people).to.be.an('object');

        expect(result.articles.byId[1].data.author).to.equal('9');
        expect(result.articles.byId[1].data.comments).to.eql(['5', '12']);
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

        expect(result).to.be.an('object');
        expect(result.movies).to.be.an('object');
        expect(result.movies.byId['123'].data.title).to.equal('Puppy goes swimming');
        expect(result.movies.byId['123'].data.rating).to.equal(5);
    });

    it('throws an error if an entity doesn\'t have an id', () => {
        const entityWithNoId = {
            data: {
                type: 'TestEntity',
            },
        };

        const functionCallWithInvalidEntity = () => insertOrUpdateEntities({}, entityWithNoId);
        expect(functionCallWithInvalidEntity).to.throw(Error, /must have an `id`/);
    });

    it('throws an error if an entity doesn\'t have a type', () => {
        const entityWithNoId = {
            data: {
                id: '123',
            },
        };

        const functionCallWithInvalidEntity = () => insertOrUpdateEntities({}, entityWithNoId);
        expect(functionCallWithInvalidEntity).to.throw(Error, /must have a `type`/);
    });
});

const commentJsonResponse = {
    "type": "comments",
    "id": "42",
    "attributes": {
      "body": "Banana!"
    },
    "relationships": {
      "author": {
        "data": { "type": "people", "id": "2" }
      }
    },
    "links": {
      "self": "http://example.com/comments/5"
    }
};

describe('addRelationshipToEntity', ()=> {
    it('Adds new relationships when given a data wrapped object', () => {
        const state = insertOrUpdateEntities({}, initialJsonResponse);
        const result = addRelationshipToEntity(state, 'articles', 1, 'comments', { data: commentJsonResponse });

        expect(result.comments.byId).to.have.all.keys('5', '12', '42');

        expect(result.articles.byId[1].data.comments).to.be.an('array');
        expect(result.articles.byId[1].data.comments).to.eql(['5', '12', '42']);
    })

    it('Adds new relationships when given a non-data wrapped object', () => {
        const state = insertOrUpdateEntities({}, initialJsonResponse);
        const result = addRelationshipToEntity(state, 'articles', 1, 'comments', commentJsonResponse);

        expect(result.comments.byId).to.have.all.keys('5', '12', '42');

        expect(result.articles.byId[1].data.comments).to.be.an('array');
        expect(result.articles.byId[1].data.comments).to.eql(['5', '12', '42']);
    })

    it('Adds new relationships when given an id', () => {
        const state = insertOrUpdateEntities({}, initialJsonResponse);
        const result = addRelationshipToEntity(state, 'articles', 1, 'comments', '42');

        expect(result.articles.byId[1].data.comments).to.be.an('array');
        expect(result.articles.byId[1].data.comments).to.eql(['5', '12', '42']);
    })
});

describe('removeRelationshipFromEntity', () => {
    it('removes a relationship', () => {
        const state = insertOrUpdateEntities({}, initialJsonResponse);
        const result = removeRelationshipFromEntity(state, 'articles', '1', 'comments', '5');

        expect(result.articles.byId['1'].data.comments).to.eql(['12']);
    })
});

describe('updateEntity', () => {
    it('updates an entity', () => {
        const state = insertOrUpdateEntities({}, initialJsonResponse);
        const result = updateEntity(state, 'articles', '1', {
            title: 'New Title'
        });

        expect(result.articles.byId[1].data.title).to.equal('New Title');
    });
});

describe('updateEntitiesMeta', () => {
    it('should set a meta property for an entity', () => {
        const state = insertOrUpdateEntities({}, initialJsonResponse);
        const updatedState = updateEntitiesMeta(state, 'articles', 'isLoading', true);

        expect(updatedState.articles.meta.isLoading).to.equal(true);
    });

    it('should completely replace the metadata for an entity', () => {
        const state = insertOrUpdateEntities({}, initialJsonResponse);
        const updatedState = updateEntitiesMeta(state, 'articles', null, { newMetaProperty: 'newMetaValue' });

        expect(updatedState.articles.meta).to.eql({
            newMetaProperty: 'newMetaValue',
        });
    });
});

describe('removeEntity', () => {
    it('should delete an entity', () => {
        const state = insertOrUpdateEntities({}, initialJsonResponse);
        const updatedState = removeEntity(state, 'articles', '1');
        expect(updatedState.articles.byId).to.eql({});
    });
});

describe('clearEntityType', () => {
    it('should reset an entity type', () => {
        const state = insertOrUpdateEntities({}, initialJsonResponse);
        const updatedState = clearEntityType(state, 'articles');
        expect(updatedState.articles).to.eql({
            byId: {},
            meta: {},
        });
    });
});
