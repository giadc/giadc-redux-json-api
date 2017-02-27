import { expect } from 'chai';
import pluralize from 'pluralize';

import * as actions from '../src/actions';
import actionNames from '../src/action-names';

describe('actions', () => {
    it('should create an action to load json api data', () => {
        const data = {
            data: {
                type: 'article',
                id: '12345',
                attributes: {
                    title: 'Test Title'
                }
            }
        };
        const expectedAction = {
          type: actionNames.LOAD_JSON_API_ENTITY_DATA,
          data
        };
        expect(actions.loadJsonApiEntityData(data)).to.eql(expectedAction);
    });

    it('should create an action to add a relationship to an entity', () => {
        const entityKey = 'articles';
        const entityId = '1';
        const relationshipKey = 'reader';
        const relationshipObject = {
            type: 'user',
            id: '54321',
            attributes: {
                name: 'Bob Ross'
            }
        };
        const expectedAction = {
            type: actionNames.ADD_RELATIONSHIP_TO_ENTITY + '_ARTICLE_READERS',
            entityKey,
            entityId,
            relationshipKey,    
            relationshipObject
        };
        expect(actions.addRelationshipToEntity(entityKey, entityId, relationshipKey, relationshipObject)).to.eql(expectedAction);
    });

    it('should create an action to remove a relationship from an entity', () => {
        const entityKey = 'articles';
        const entityId = '1';
        const relationshipKey = 'reader';
        const relationshipId = '54321';
        const expectedAction = {
            type: actionNames.REMOVE_RELATIONSHIP_FROM_ENTITY + '_ARTICLE_READERS',
            entityKey,
            entityId,
            relationshipKey,    
            relationshipId
        };
        expect(actions.removeRelationshipFromEntity(entityKey, entityId, relationshipKey, relationshipId)).to.eql(expectedAction);
    });

    it('should create an action to update an entity', () => {
        const entityKey = 'articles';
        const entityId = '1';
        const data = {
            title: 'New Test Title'
        };
        const expectedAction = {
            type: actionNames.UPDATE_ENTITY + '_ARTICLE',
            entityKey,
            entityId,
            data    
        };
        expect(actions.updateEntity(entityKey, entityId, data)).to.eql(expectedAction);
    });

    it('should create an action to update metadata for an entity group', () => {
        const entityKey = 'articles';
        const metaKey = 'isLoading';
        const value = true;

        const expectedAction = {
            type: actionNames.UPDATE_ENTITIES_META + '_ARTICLES',
            entityKey,
            metaKey,
            value,
        };

        expect(actions.updateEntitiesMeta(entityKey, metaKey, value)).to.eql(expectedAction);
    });

    it('should create an action to update metadata for an entity', () => {
        const entityKey = 'article',
            entityId = '1',
            metaKey = 'isLoading',
            value = true;

        const expectedAction = {
            type: actionNames.UPDATE_ENTITY_META + '_ARTICLE',
            entityKey,
            entityId,
            metaKey,
            value,
        };

        expect(actions.updateEntityMeta(entityKey, entityId, metaKey, value)).to.eql(expectedAction);
    });

    it('should create an action to delete an entity', () => {
        const entityKey = 'article',
            entityId = '1';

        const expectedAction = {
            type: actionNames.REMOVE_ENTITY + '_ARTICLE',
            entityKey,
            entityId,
        };

        expect(actions.removeEntity(entityKey, entityId)).to.eql(expectedAction);
    });

    it('should create an action to delete an entity type', () => {
        const entityKey = 'articles';

        const expectedAction = {
            type: actionNames.CLEAR_ENTITY_TYPE + '_ARTICLES',
            entityKey,
        };

        expect(actions.clearEntityType(entityKey)).to.eql(expectedAction);
    });
});
