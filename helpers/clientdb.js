const { db } = require('./firebaseSetup');
const firebase = require('firebase-admin');

const clientdb = async (uuid, authuid) => {
  const projectPublic = await db.ref(`projectPublic/${uuid}`).once('value').then(snapshot => snapshot.val());

  if (!projectPublic) {
    // it doesn't exist
    return [404, 'does-not-exist'];
  }

  if (!projectPublic.editors[authuid]) {
    // you can't access it
    return [403, 'forbidden'];
  }

  if (projectPublic.trashed) {
    // trashed
    return [403, 'trashed'];
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

module.exports = { clientdb }