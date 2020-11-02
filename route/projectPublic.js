const { db } = require("../helpers/firebaseSetup");

module.exports = {
  path: "/project-public",
  execute: async (req, res) => {
    const getUsernameInfo = async () => {
      const usernameInfo = await db.ref(`/userInformation`).once('value').then(snapshot => snapshot.val());
      return Object.fromEntries(Object.entries(usernameInfo).map(user => [user[0], user[1].username]));
    }

    const uuid = req.query.uuid;
    let publico = await db.ref(`/projectPublic/${uuid}`).once('value').then(snapshot => snapshot.val());

    const usernameInfo = await getUsernameInfo();

    const idToUsername = id => {
      if (usernameInfo[id]) return usernameInfo[id];
      return '!usernameNotFound';
    }

    // change all the private uids to usernames
    publico.editors = Object.fromEntries(Object.entries(publico.editors).map(editor => [idToUsername(editor[0]), editor[1]]));
    publico.owner = idToUsername(publico.owner);

    res.send(publico);
  }
}
