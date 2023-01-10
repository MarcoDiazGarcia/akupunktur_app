migrate((db) => {
  const collection = new Collection({
    "id": "nghmyps0r7dczj4",
    "created": "2023-01-10 08:13:12.031Z",
    "updated": "2023-01-10 08:13:12.031Z",
    "name": "treatement_acupuncture_points",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "hqjjxpy8",
        "name": "treatment",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "collectionId": "p8gowkzdsmbk2p8",
          "cascadeDelete": true
        }
      },
      {
        "system": false,
        "id": "c0zomlsr",
        "name": "acupunctur_point",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "collectionId": "y7on03qqap875lj",
          "cascadeDelete": true
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
  const collection = dao.findCollectionByNameOrId("nghmyps0r7dczj4");

  return dao.deleteCollection(collection);
})
