const { db } = require('./firebaseSetup');
const firebase = require('firebase-admin');
const dbaccess = require('./dbaccess');

const clientdb = async (uuid, authuid) => {
  const tryAccess = await dbaccess(uuid, authuid);
  if (tryAccess[0] !== 200) {
    return tryAccess;
  }

  let config = await db.ref(`/projectConfigs/${uuid}`).once('value').then(snapshot => snapshot.val());

  if (!config) {
    return [200, 'unconfigured'];
  }
  config.private_key = config.private_key.replace(/\\n/g, '\n');

  let dbURL = config.databaseURL;
  delete config.databaseURL;

  const existingApps = firebase.apps.map(app => app.name);
  let privatedb;

  // we don't want to create a new app each time
  if (existingApps.includes(uuid)) {
    privatedb = firebase.app(uuid).database();
  } else {
    privatedb = firebase.initializeApp({
      credential: firebase.credential.cert(config),
      databaseURL: dbURL
    }, uuid).database();
  }

  return [200, privatedb];
}

module.exports = clientdb;