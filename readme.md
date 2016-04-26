# giadc-redux-json-api

A package for consuming and accessing JSON API data with Redux

## Hooking up the store
```
import { reducer as entities } from 'giadc-redux-json-api';
import * as your-reducers from './reducers';

const store = createStore(
    combineReducers({...your-reducers, entities}),
);
```

## Consuming JSON data
```
import { loadJsonApiEntityData } from 'giadc-redux-json-api';

const yourFunction = (jsonApiData) => {
    return (dispatch) => {
        dispatch(loadJsonApiEntityData(jsonApiData));
    }
}
```

## Manipulating entities
```
import { addRelationshipToEntity, removeRelationshipFromEntity, updateEntity } from 'giadc-reduc-json-api';

/** 
 * dispatch(addRelationshipToEntity('article', 54321, 'readers', { 
 *     type: 'user', 
 *     id: 12345, 
 *     attributes: { name: "Bob Ross" }
 * })); 
 */ 
addRelationshipToEntity(entityKey, entityId, relationshipKey, relationshipJsonApiObject);
    
// dispatch(removeRelationshipFromEntity('article', 54321, 'readers', 12345));
updateEntity(entityKey, entityId, relationshipKey, relationshipId);

/**
 * dispatch(updateEntity('article', articleId, {
 *     isUserFavorite: true
 * })); 
 */
updateEntity(entityKey, entityId, dataObject);
```

## Fetching data
```
import { getEntity, getEntities } from 'giadc-redux-json-api';

// Get single article
let article = getEntity(state.entities, 'article', articleId);

// Get all articles
let articles = getEntities(state.entities, 'articles');

// Get array of articles
let articles = getEntities(state.entities, 'articles', [id1, id2, id3]);
```
