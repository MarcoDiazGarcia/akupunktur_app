migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p8gowkzdsmbk2p8")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6jx0anuf",
    "name": "description",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p8gowkzdsmbk2p8")

  // remove
  collection.schema.removeField("6jx0anuf")

  return dao.saveCollection(collection)
})
