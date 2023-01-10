migrate((db) => {
  const collection = new Collection({
    "id": "y7on03qqap875lj",
    "created": "2023-01-10 08:07:47.161Z",
    "updated": "2023-01-10 08:07:47.161Z",
    "name": "acupuncture_points",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ywtosrhc",
        "name": "point",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("y7on03qqap875lj");

  return dao.deleteCollection(collection);
})
