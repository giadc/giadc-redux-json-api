# giadc-redux-json-api
[![npm](https://img.shields.io/npm/v/giadc-redux-json-api.svg?maxAge=2592000)]()

A package for consuming and accessing [JSON API](http://jsonapi.org/) data with Redux.

__This package is currently in development and not ready for usage in production. USE AT YOUR OWN RISK.__

## Hooking up the store
```javascript
import { reducer as entities } from 'giadc-redux-json-api';
import * as your-reducers from './reducers';

const store = createStore(
    combineReducers({...your-reducers, entities}),
);
```

## Consuming JSON data
```javascript
import { loadJsonApiEntityData } from 'giadc-redux-json-api';

dispatch(loadJsonApiEntityData(jsonApiData));
```

## Manipulating entities
```javascript
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
removeRelationshipFromEntity(entityKey, entityId, relationshipKey, relationshipId);

/**
 * dispatch(updateEntity('article', articleId, {
 *     isUserFavorite: true
 * }));
 */
updateEntity(entityKey, entityId, dataObject);
```

## Fetching data
```javascript
import { getEntity, getEntities } from 'giadc-redux-json-api';

// Get single article
let article = getEntity(state.entities, 'article', articleId);

// Get all articles
let articles = getEntities(state.entities, 'articles');

// Get array of articles
let articles = getEntities(state.entities, 'articles', [id1, id2, id3]);
```

## Helpers
```javascript
import { getId, getIds } from 'giadc-redux-json-api';

// Extract item ID from JSON API response
getId(jsonResponse);

// Extract collection ID's from JSON API response
getIds(jsonResponse);
```
