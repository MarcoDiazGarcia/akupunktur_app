migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p8gowkzdsmbk2p8")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "p1lkmipn",
    "name": "disease",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "collectionId": "b04ghq28dps8kyc",
      "cascadeDelete": true
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qxnx2ozn",
    "name": "effectiveness",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": 10
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p8gowkzdsmbk2p8")

  // remove
  collection.schema.removeField("p1lkmipn")

  // remove
  collection.schema.removeField("qxnx2ozn")

  return dao.saveCollection(collection)
})
