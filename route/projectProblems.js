const { db } = require('../helpers/firebaseSetup');
const clientdb = require('../helpers/clientdb');

module.exports = {
  path: '/project-problems',
  execute: async (req, res) => {
    const uuid = req.query.uuid;
    const authuid = req.query.authuid;

    const trydb = await clientdb(uuid, authuid);

    if (trydb[0] !== 200 || trydb[1] === 'unconfigured') {
      res.status(trydb[0]).send(trydb[1]);
      return;
    }

    const problems = await trydb[1].ref('/problems').once('value').then(snapshot => snapshot.val());

    const getUsernameInfo = async () => {
      const usernameInfo = await db.ref(`/userInformation`).once('value').then(snapshot => snapshot.val());
      return Object.fromEntries(Object.entries(usernameInfo).map(user => [user[0], user[1].username]));
    }

    const usernameInfo = await getUsernameInfo();
    const idToUsername = id => {
      if (usernameInfo[id]) return usernameInfo[id];
      return '!usernameNotFound';
    }

    // change private uids to usernames
    if (!!problems) {
      problems.forEach(prob => {
        prob.author = idToUsername(prob.author);
        if (!!prob.votes) {
          prob.votes = Object.fromEntries(Object.entries(prob.votes).map(([id, vote]) => [idToUsername(id), vote]));
        }
      });
    }
    res.status(200).send(problems);
  },
}
