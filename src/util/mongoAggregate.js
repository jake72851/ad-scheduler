const { MongoClient } = require('mongodb');
const CONFDB = require('../config/db');

let url;
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod') {
  url = CONFDB.REMOTE.URL;
} else {
  url = CONFDB.LOCAL.URL;
}

exports.request = async function (viewName, baseName, pipeline) {
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(CONFDB.DB.NAME);

    const collectionNames = await db.listCollections().toArray();
    const viewExists = collectionNames.some((collection) => collection.name === viewName);

    // If the view exists, delete it
    if (viewExists) {
      await db.collection(viewName).drop();
      console.log(viewName, 'is already exist. delete it');
    }

    const viewOptions = {
      viewOn: baseName,
      pipeline,
    };
    await db.createCollection(viewName, viewOptions);
    console.log(viewName, 'is create');
  } catch (err) {
    console.log(err.message);
  } finally {
    client.close();
  }
};
