migrate((db) => {
  const collection = new Collection({
    "id": "p8gowkzdsmbk2p8",
    "created": "2023-01-10 08:03:47.270Z",
    "updated": "2023-01-10 08:03:47.270Z",
    "name": "treatments",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "izpnfpud",
        "name": "horse_name",
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
  const collection = dao.findCollectionByNameOrId("p8gowkzdsmbk2p8");

  return dao.deleteCollection(collection);
})
