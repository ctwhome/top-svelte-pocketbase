/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "todos_collection",
    "name": "todos",
    "type": "base",
    "system": false,
    "schema": [
      {
        "id": "todo_name",
        "name": "name",
        "type": "text",
        "system": false,
        "required": true,
        "options": {
          "min": 1,
          "max": 255,
          "pattern": ""
        }
      },
      {
        "id": "todo_completed",
        "name": "completed",
        "type": "bool",
        "system": false,
        "required": false,
        "options": {}
      },
      {
        "id": "todo_description",
        "name": "Description",
        "type": "text",
        "system": false,
        "required": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "id": "todo_user",
        "name": "user",
        "type": "relation",
        "system": false,
        "required": true,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": ["email"]
        }
      }
    ],
    "listRule": "@request.auth.id != \"\" && user.id = @request.auth.id",
    "viewRule": "@request.auth.id != \"\" && user.id = @request.auth.id",
    "createRule": "@request.auth.id != \"\" && @request.data.user = @request.auth.id",
    "updateRule": "@request.auth.id != \"\" && user.id = @request.auth.id",
    "deleteRule": "@request.auth.id != \"\" && user.id = @request.auth.id",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("todos_collection");

  return dao.deleteCollection(collection);
});
