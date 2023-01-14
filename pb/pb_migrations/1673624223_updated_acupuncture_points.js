migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("y7on03qqap875lj")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ywtosrhc",
    "name": "point",
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
  const collection = dao.findCollectionByNameOrId("y7on03qqap875lj")

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
})
