const { db } = require('../helpers/firebaseSetup');

module.exports = {
  path: '/share-project',
  execute: async (req, res) => {
    const username = req.query.username;
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

    const userinfo = await db.ref(`users/${username}`).once('value').then(snapshot => snapshot.val());
    if (!userinfo) {
      res.status(404).send('username-does-not-exist');
      return;
    }

    if (projectPublic.editors[userinfo.uid]) {
      res.status(403).send('user-is-already-editor');
      return;
    }

    if (projectPublic.trashed) {
      res.status(403).send('project-trashed');
      return;
    }

    const date = new Date();
    const now = date.getTime();
    await db.ref(`projectPublic/${uuid}/editors/${userinfo.uid}`).set({
      lastEdit: now,
      shareDate: now,
      starred: false
    });
    await db.ref(`projectPublic/${uuid}/editors/${authuid}/lastEdit`).set(now);

    res.status(201).send(`Success. Project is now shared with ${username}.`);
  }
}
