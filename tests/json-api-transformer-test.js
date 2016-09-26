import { expect } from 'chai';
import { 
    insertOrUpdateEntities, 
    addRelationshipToEntity, 
    removeRelationshipFromEntity,
    updateEntity,
    setEntitiesMeta,
} from '../lib/json-api-transformer';

const initialJsonResponse = {"links":{"self":"http://example.com/articles","next":"http://example.com/articles?page[offset]=2","last":"http://example.com/articles?page[offset]=10"},"data":[{"type":"articles","id":"1","attributes":{"title":"JSON API paints my bikeshed!"},"relationships":{"author":{"links":{"self":"http://example.com/articles/1/relationships/author","related":"http://example.com/articles/1/author"},"data":{"type":"people","id":"9"}},"comments":{"links":{"self":"http://example.com/articles/1/relationships/comments","related":"http://example.com/articles/1/comments"},"data":[{"type":"comments","id":"5"},{"type":"comments","id":"12"}]}},"links":{"self":"http://example.com/articles/1"}}],"included":[{"type":"people","id":"9","attributes":{"first-name":"Dan","last-name":"Gebhardt","twitter":"dgeb"},"links":{"self":"http://example.com/people/9"}},{"type":"comments","id":"5","attributes":{"body":"First!"},"relationships":{"author":{"data":{"type":"people","id":"2"}}},"links":{"self":"http://example.com/comments/5"}},{"type":"comments","id":"12","attributes":{"body":"I like XML better"},"relationships":{"author":{"data":{"type":"people","id":"9"}}},"links":{"self":"http://example.com/comments/12"}}]};

describe('insertOrUpdateEntities', () => {
    it('parses json data', () => {
        let result = insertOrUpdateEntities({}, initialJsonResponse);

        expect(result).to.be.an('object');
        expect(result).to.have.all.keys(['articles', 'comments', 'people']);
        expect(result.articles).to.be.an('object');
        expect(result.comments).to.be.an('object');
        expect(result.people).to.be.an('object');

        expect(result.articles.byId[1].author).to.equal('9');
        expect(result.articles.byId[1].comments).to.eql(['5', '12']);
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
    it('Adds new relationships', () => {
        let state = insertOrUpdateEntities({}, initialJsonResponse);
        let result = addRelationshipToEntity(state, 'articles', 1, 'comments', commentJsonResponse);

        expect(result.comments.byId).to.have.all.keys('5', '12', '42');

        expect(result.articles.byId[1].comments).to.be.an('array');
        expect(result.articles.byId[1].comments).to.eql(['5', '12', '42']);
    })
});

describe('removeRelationshipFromEntity', () => {
    it('Removes a relationship', () => {
        let state = insertOrUpdateEntities({}, initialJsonResponse);
        let result = removeRelationshipFromEntity(state, 'articles', 1, 'comments', 5);

        expect(result.articles.byId[1].comments).to.eql(['12']);
    })
});

describe('updateEntity', () => {
    it('Updates an entity', () => {
        let state = insertOrUpdateEntities({}, initialJsonResponse);
        let result = updateEntity(state, 'articles', 1, {
            title: 'New Title'
        });

        expect(result.articles.byId[1].title).to.equal('New Title');
    });
});

describe('setEntitiesMeta', () => {
    it('should set a meta property for an entity', () => {
        let state = insertOrUpdateEntities({}, initialJsonResponse);
        let updatedState = setEntitiesMeta(state, 'articles', 'isLoading', true);

        console.log(updatedState);

        expect(updatedState.articles.meta.isLoading).to.equal(true);
    });
});
