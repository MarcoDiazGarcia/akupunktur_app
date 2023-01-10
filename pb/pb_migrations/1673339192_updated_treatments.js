migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p8gowkzdsmbk2p8")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hvyhuhbs",
    "name": "physio",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": true
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p8gowkzdsmbk2p8")

  // remove
  collection.schema.removeField("hvyhuhbs")

  return dao.saveCollection(collection)
})
