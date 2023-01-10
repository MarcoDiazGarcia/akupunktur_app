migrate((db) => {
  const collection = new Collection({
    "id": "b04ghq28dps8kyc",
    "created": "2023-01-10 08:05:36.209Z",
    "updated": "2023-01-10 08:05:36.209Z",
    "name": "diseases",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "xauh7jxq",
        "name": "disease",
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
  const collection = dao.findCollectionByNameOrId("b04ghq28dps8kyc");

  return dao.deleteCollection(collection);
})
