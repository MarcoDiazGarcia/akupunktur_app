migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oa77t9y9754bkna")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "axiopiuv",
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
  const collection = dao.findCollectionByNameOrId("oa77t9y9754bkna")

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
})
