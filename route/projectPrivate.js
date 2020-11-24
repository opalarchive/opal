const { db } = require('../helpers/firebaseSetup');
const firebase = require('firebase-admin');

module.exports = {
  path: '/project-private',
  execute: async (req, res) => {
    const uuid = req.query.uuid;
    const authuid = req.query.authuid;


    const projectPublic = await db.ref(`projectPublic/${uuid}`).once('value').then(snapshot => snapshot.val());

    if (!projectPublic) {
      // it doesn't exist
      res.status(404).send('does-not-exist');
      return;
    }

    if (!projectPublic.editors[authuid]) {
      // you can't access it
      res.status(403).send('forbidden');
      return;
    }

    if (projectPublic.trashed) {
      // trashed
      res.status(403).send('trashed');
      return;
    }

    let config = await db.ref(`/projectConfigs/${uuid}`).once('value').then(snapshot => snapshot.val());

    if (!config) {
      res.status(200).send('unconfigured');
      return;
    }
    config.private_key = config.private_key.replace(/\\n/g, '\n');

    let dbURL = config.databaseURL;
    delete config.databaseURL;

    const existingApps = firebase.apps.map(app => app.name);
    let cliendb;

    // we don't want to create a new app each time
    if (existingApps.includes(uuid)) {
      cliendb = firebase.app(uuid).database();
    } else {
      clientdb = firebase.initializeApp({
        credential: firebase.credential.cert(config),
        databaseURL: dbURL
      }, uuid).database();
    }

    const dbstatus = await clientdb.ref('/').once('value').then(snapshot => snapshot.val());
    dbstatus.name = projectPublic.name;

    res.status(200).send(dbstatus);
  }
}
