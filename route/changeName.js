const { db } = require('../helpers/firebaseSetup');

module.exports = {
  path: '/change-project-name',
  execute: async (req, res) => {
    const projectname = req.query.projectname;
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

    if (projectPublic.trashed) {
      res.status(403).send('project-trashed');
      return;
    }

    if (!projectname.match(/^[ A-Za-z0-9]+$/g) || projectname.length > 32) {
      res.status(400).send('bad-project-name');
      return;
    }

    const date = new Date();
    const now = date.getTime();
    await db.ref(`projectPublic/${uuid}/name`).set(projectname);
    await db.ref(`projectPublic/${uuid}/editors/${authuid}/lastEdit`).set(now);

    res.status(201).send(`Success. Project is now updated to have name ${projectname}.`);
  }
}
