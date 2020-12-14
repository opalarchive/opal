const { db } = require('../helpers/firebaseSetup');

module.exports = {
  path: '/delete-project',
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
    await db.ref(`projectPublic/${uuid}/trashed`).set(true);
    await db.ref(`projectPublic/${uuid}/editors/${authuid}/lastEdit`).set(date.getTime());

    const ownerUsername = await db.ref(`userInformation/${authuid}/username`).once('value').then(snapshot => snapshot.val());

    Object.keys(projectPublic.editors).forEach(async editor => {
      let currentNotifications = await db.ref(`userInformation/${editor}/notifications`).once('value').then(snapshot => snapshot.val()) || {};
      currentNotifications = Object.keys(currentNotifications).map(index => currentNotifications[index]) || [];
      currentNotifications.push({ content: `${ownerUsername} has deleted <a href="/project/view/${uuid}">${projectPublic.name}</a>! The OPAL project will now only be view-only until the owner chooses to restore it.`, timestamp: date.getTime(), link: `/project/view/${uuid}`, read: false, title: `Project Deleted!` });
      await db.ref(`userInformation/${editor}/notifications`).set(currentNotifications);
    })

    res.status(201).send(`Success. Project is now trashed.`);
  }
}
