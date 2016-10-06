import { expect } from 'chai';
import {
    getEntity,
    getEntities,
    getId,
    getIds,
    getEntitiesMeta,
    getEntityMeta,
    getMostRecentlyLoaded,
    generateEntity,
} from '../lib/giadc-redux-json-api';

const state = {"articles": {"meta": {"isLoading": true,"anotherMetaProperty": 666},"byId": {"1": {"meta": {"isLoading": true},"data": {"id": "1","title": "JSON API paints my bikeshed!","author": "9","comments": ["5", "12"]}}}},"people": {"byId": {"9": {"meta": {},"data": {"id": "9","first-name": "Dan","last-name": "Gebhardt","twitter": "dgeb"}}}},"comments": {"byId": {"5": {"meta": {},"data": {"id": "5","body": "First!","author": "2"}},"12": {"meta": {},"data": {"id": "12","body": "I like XML better","author": "9"}},"44": {"meta": {},"data": {"author": "9","body": "JSON API is love","id": "44"}}}}};

describe('getEntity', () => {
    it('should return an entity', () => {
        expect(getEntity(state, 'article', 1)).to.eql({
            "id": "1",
            "title": "JSON API paints my bikeshed!",
            "author": "9",
            "comments": ["5","12"]
        });
    });

    it('should return `null` if the entity does not exist', () => {
        expect(getEntity(state, 'article', 666)).to.equal(null);
    });
});

describe('getEntities', () => {
    it('should return all entities', () => {
        expect(getEntities(state, 'comments')).to.eql([
            {
                "author": "2",
                "body": "First!",
                "id": "5"
            },
            {
                "author": "9",
                "body": "I like XML better",
                "id": "12"
            },
            {
                "author": "9",
                "body": "JSON API is love",
                "id": "44"
            }
        ]);
    });

    it('should return a subset of entities', () => {
        expect(getEntities(state, 'comments', [5, 44])).to.eql([
            {
                "author": "2",
                "body": "First!",
                "id": "5"
            },
            {
                "author": "9",
                "body": "JSON API is love",
                "id": "44"
            }
        ]);
    });

    it('should return only entities that exist', () => {
        expect(getEntities(state, 'comments', [5, 666])).to.eql([
            {
                "author": "2",
                "body": "First!",
                "id": "5"
            }
        ]);
    });

    it('should return an empty array if the entities do not exist', () => {
        expect(getEntities(state, 'comments', [666, 777])).to.eql([]);
        expect(getEntities(state, 'spicyboys')).to.eql([]);
    });
});

describe('getId', () => {
    it('should return a single id', () => {
        const jsonResponse = {"data":{"type":"article","id":"ba1582be-15d9-454e-ac8a-5ff9d2139d4d","attributes":{"title":"RootPage","slug":"root_page","path":"/root_page","published":true,"updatedAt":"2016-04-2616:16:06","isUserFavorite":true,"userCanEdit":true,"index":[{"level":"2","name":"heading-1","title":"Setup"},{"level":"2","name":"heading-2","title":"Config"},{"level":"2","name":"heading-3","title":"UsingthePackage"},{"level":"2","name":"heading-4","title":"ProcessingtheQueue"}]}}};
        expect(getId(jsonResponse)).to.equal("ba1582be-15d9-454e-ac8a-5ff9d2139d4d");
    });
});

describe('getIds', () => {
    it('should return an array of ids', () => {
        const jsonResponse = {"data":[{"type":"tag","id":"banana","attributes":{"name":"Banana"}},{"type":"tag","id":"hammock","attributes":{"name":"Hammock"}},{"type":"tag","id":"sop","attributes":{"name":"SOP"}}],"meta":{"pagination":{"total":6,"count":6,"per_page":15,"current_page":1,"total_pages":1,"links":[]}}};
        expect(getIds(jsonResponse)).to.eql(["banana", "hammock", "sop"]);
    });
});

describe('getEntitiesMeta', () => {
    it('should return all the meta data for an entity type', () => {
        expect(getEntitiesMeta(state, 'articles')).to.eql({
            isLoading: true,
            anotherMetaProperty: 666
        });
    });

    it('should return a specific meta property\'s value for an entity group', () => {
        expect(getEntitiesMeta(state, 'articles', 'isLoading')).to.eql(true);
    });

    it('should return null if no meta data exists for an entity group', () => {
        expect(getEntitiesMeta(state, 'articles', 'invalidMetaKey')).to.eql(null);
        expect(getEntitiesMeta(state, 'authors')).to.eql(null);
    })
});

describe('getEntityMeta', () => {
    it('should return all the meta data for an entity type', () => {
        expect(getEntityMeta(state, 'articles', '1')).to.eql({
            isLoading: true,
        });
    });

    it('should return a specific meta property\'s value for an entity group', () => {
        expect(getEntityMeta(state, 'articles', '1', 'isLoading')).to.eql(true);
    });

    it('should return null if no meta data exists for an entity group', () => {
        expect(getEntityMeta(state, 'articles', '1', 'invalidMetaKey')).to.eql(null);
        expect(getEntityMeta(state, 'authors', '1')).to.eql(null);
    })
});

describe('generateEntity', () => {
    it('should generate a valid entity object', () => {
        const entityKey = 'article';
        const attributes = {
            id: '123',
            title: 'New Entity',
        };

        const result = generateEntity(entityKey, attributes);

        expect(result).to.contain.have.all.keys('id', 'type', 'attributes');
        expect(result.type).to.equal(entityKey);
        expect(result.attributes).to.eql({ title: 'New Entity' });
    });

    it('should generate an id if one wasn\'t provided', () => {
        const entityKey = 'article';
        const attributes = {
            title: 'New Entity',
        };

        const result = generateEntity(entityKey, attributes);

        expect(result).to.contain.have.all.keys('id', 'type', 'attributes');
        expect(result.type).to.equal(entityKey);
        expect(result.id.length).to.equal(36);
        expect(result.attributes).to.eql(attributes);
    });
});
