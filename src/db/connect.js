const { MongoClient } = require('mongodb');
const CONFDB = require('../config/db');

// Connection URL
let url;
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod') {
  url = CONFDB.REMOTE.URL;
} else {
  url = CONFDB.LOCAL.URL;
}

const client = new MongoClient(url);

exports.connection = async function (req) {
  await client.connect();
  const dbReq = client.db(req);
  return dbReq;
};

exports.close = function () {
  client.close();
  return 'ok';
};
