const { db } = require("../helpers/firebaseSetup");
const { v4: uuidv4 } = require('uuid');

module.exports = {
  path: "/new-project",
  execute: async (req, res) => {
    const uid = req.query.uid;
    let uuid = '';

    const projectIds = await db.ref(`/projectIds`).once('value').then(snapshot => snapshot.val());
    const totalProjects = Object.values(projectIds).length;
    
    // just create random uuids until it doesn't exist already
    do {
      uuid = uuidv4();
    } while (Object.values(projectIds).includes(uuid));

    // create default info in the db
    await db.ref(`projectIds/${totalProjects}`).set(uuid);

    const date = new Date();
    await db.ref(`projectPublic/${uuid}`).set({
      name: 'Untitled Project',
      owner: uid,
      trashed: false,
      editors: {
        [uid]: {
          lastEdit: date.getTime(),
          shareDate: date.getTime(),
          starred: false
        }
      }
    });

    res.send(uuid);
  }
}
