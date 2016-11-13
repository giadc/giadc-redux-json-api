# giadc-redux-json-api
[![npm](https://img.shields.io/npm/v/giadc-redux-json-api.svg?maxAge=2592000)]()
[![Travis](https://img.shields.io/travis/giadc/giadc-redux-json-api.svg)]()

A package for consuming and accessing [JSON API](http://jsonapi.org/) data with Redux.
It will take a standard JSON API response, automatically flatten its structure, and
update your redux store. For most apps, this greatly cuts down on the number of reducers
that need to be written.

Note: This package does not make/handle network requests. Its purpose is to consume
JSON API data that has already been retrieved from a server.

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

dispatch(loadJsonApiEntityData(jsonApiResponseFromServer));
```

## Manipulating entities
```javascript
import { addRelationshipToEntity, removeRelationshipFromEntity, updateEntity } from 'giadc-reduc-json-api';

/**
 * dispatch(updateEntity('article', articleId, {
 *     isUserFavorite: true
 * }));
 */
updateEntity(entityKey, entityId, dataObject);

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
```

## Retrieving entities from the store
```javascript
import { getEntity, getEntities } from 'giadc-redux-json-api';

// Get single article
const article = getEntity(state.entities, 'article', articleId);

// Get all articles
const articles = getEntities(state.entities, 'articles');

// Get array of articles
const articles = getEntities(state.entities, 'articles', [id1, id2, id3]);
```

## Metadata
```javascript
import { updateEntitiesMeta, getEntitiesMeta } from 'giadc-redux-json-api';

// Set a metadata value for an Entity type
dispatch(updateEntitiesMeta('articles', 'isLoading', true));

// Get all metadata for an Entity type
const metadata = getEntitiesMeta(state.entities, 'articles');

// Get a specific metadata value for an Entity type
const isLoading = getEntitiesMeta(state.entities, 'articles', 'isLoading');

// Set a metadata value for a specific Entity
dispatch(updateEntityMeta('articles', '123', 'isLoading', true));

// Get all metadata for a specific Entity
const metadata = getEntityMeta(state.entities, 'articles', '123');

// Get a specific metadata value for a specific Entity
const isLoading = getEntityMeta(state.entities, 'articles', '123', 'isLoading');
```

## Helpers
```javascript
import { getId, getIds } from 'giadc-redux-json-api';

// Extract item ID from JSON API response
getId(jsonResponse);

// Extract collection ID's from JSON API response
getIds(jsonResponse);
```

## Generate an entity locally
Sometimes you may need to generate and store an entity that didn't actually come from a JSON API.    
__json-redux-json-api__ provides a simple `generateEntity` helper function for that.

```javascript
import { generateEntity, loadJsonApiEntityData, addRelationshipToEntity } from 'giadc-redux-json-api';

// Generate an Article entity and store it
// generateEntity(entityKey, attributes);
const article = generateEntity('article', { id: '123', title: 'Example Title' });
dispatch(loadJsonApiData(article));

// If no ID is provided, one will be generated automatically using UUID v4
const user = generateEntity('user', { name: 'Bob Ross' });
dispatch(addRelationshipToEntity('articles', '123', 'readers', user));
```
