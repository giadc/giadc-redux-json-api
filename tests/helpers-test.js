import { expect } from 'chai';
import { getEntity, getEntities, getId, getIds } from '../lib/helpers';

const state = {"articles":{"1":{"id":"1","title":"JSON API paints my bikeshed!","author":"9","comments":["5","12"]}},"people":{"9":{"id":"9","first-name":"Dan","last-name":"Gebhardt","twitter":"dgeb"}},"comments":{"5":{"id":"5","body":"First!","author":"2"},"12":{"id":"12","body":"I like XML better","author":"9"},"44":{"author":"9","body":"JSON API is love","id":"44"}}};

describe('getEntity', () => {
    it('should return an entity', () => {
        expect(getEntity(state, 'article', 1)).to.eql({
            "id": "1",
            "title": "JSON API paints my bikeshed!",
            "author": "9",
            "comments": ["5","12"]
        });
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
    })
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
