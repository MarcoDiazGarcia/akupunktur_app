migrate((db) => {
  const collection = new Collection({
    "id": "oa77t9y9754bkna",
    "created": "2023-01-10 08:09:50.595Z",
    "updated": "2023-01-10 08:09:50.595Z",
    "name": "acupuncture_points_for_diseases",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ice0lt5q",
        "name": "disease",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "collectionId": "b04ghq28dps8kyc",
          "cascadeDelete": true
        }
      },
      {
        "system": false,
        "id": "d3un74x5",
        "name": "acupuncture_point",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "collectionId": "y7on03qqap875lj",
          "cascadeDelete": true
        }
      },
      {
        "system": false,
        "id": "axiopiuv",
        "name": "effectiveness",
        "type": "number",
        "required": true,
        "unique": false,
        "options": {
          "min": 0,
          "max": 10
        }
      },
      {
        "system": false,
        "id": "w4bzbmbx",
        "name": "amount_used",
        "type": "number",
        "required": true,
        "unique": false,
        "options": {
          "min": 0,
          "max": null
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
  const collection = dao.findCollectionByNameOrId("oa77t9y9754bkna");

  return dao.deleteCollection(collection);
})
