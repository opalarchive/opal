const { db } = require('../helpers/firebaseSetup');

module.exports = {
  path: '/delete-forever-project',
  execute: async (req, res) => {
    const uuid = req.query.uuid;
    const authuid = req.query.authuid;

    const projectPublic = await db.ref(`projectPublic/${uuid}`).once('value').then(snapshot => snapshot.val());
    if (!projectPublic) {
      // it doesn't exist
      res.status(404).send('does-not-exist');
      return;
    }

    if (projectPublic.owner !== authuid) {
      // you're not the owner
      res.status(403).send('forbidden');
      return;
    }

    const date = new Date();
    await db.ref(`projectPublic/${uuid}`).set(null);
    //await db.ref(`projectConfigs/${uuid}`).set();

    res.status(201).send(`Success. Project is now permanently trashed.`);
  }
}
