const { db } = require('../helpers/firebaseSetup');
const { clientdb } = require('../helpers/clientdb');

const projectPrivateStringfied = async (uuid, authuid) => {
  const projectPublic = await db.ref(`projectPublic/${uuid}`).once('value').then(snapshot => snapshot.val());

  const trydb = await clientdb(uuid, authuid);

  if (trydb[0] !== 200 || trydb[1] === 'unconfigured') {
    return trydb;
  }

  const dbstatus = await trydb[1].ref('/').once('value').then(snapshot => snapshot.val());
  dbstatus.name = projectPublic.name;

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
  if (!!dbstatus.problems) {
    dbstatus.problems.forEach(prob => {
      prob.author = idToUsername(prob.author);
      prob.votes = Object.fromEntries(Object.entries(prob.votes).map(([id, vote]) => [idToUsername(id), vote]));
    });
  }
  return [200, dbstatus];
}

module.exports = {
  path: '/project-private',
  execute: async (req, res) => {
    const result = await projectPrivateStringfied(req.query.uuid, req.query.authuid);

    res.status(result[0]).send(result[1]);
  },
  projectPrivateStringfied
}
