migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nghmyps0r7dczj4")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "c0zomlsr",
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
  const collection = dao.findCollectionByNameOrId("nghmyps0r7dczj4")

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
})
