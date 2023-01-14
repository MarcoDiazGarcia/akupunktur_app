migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("b04ghq28dps8kyc")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xauh7jxq",
    "name": "disease",
    "type": "text",
    "required": true,
    "unique": true,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("b04ghq28dps8kyc")

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
})