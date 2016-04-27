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
