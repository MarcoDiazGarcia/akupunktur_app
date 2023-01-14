migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oa77t9y9754bkna")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "d3un74x5",
    "name": "point",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "collectionId": "y7on03qqap875lj",
      "cascadeDelete": true
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("oa77t9y9754bkna")

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
})
