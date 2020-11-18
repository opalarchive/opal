const { db } = require('../helpers/firebaseSetup');

module.exports = {
  path: '/visible-projects',
  execute: async (req, res) => {
    const getUsernameInfo = async () => {
      const usernameInfo = await db.ref(`/userInformation`).once('value').then(snapshot => snapshot.val());
      return Object.fromEntries(Object.entries(usernameInfo).map(user => [user[0], user[1].username]));
    }

    const authuid = req.query.authuid;
    let publico = await db.ref(`/projectPublic`).once('value').then(snapshot => snapshot.val());

    if (!publico) {
      res.status(200).send(null);
      return;
    }

    const usernameInfo = await getUsernameInfo();

    const idToUsername = id => {
      if (usernameInfo[id]) return usernameInfo[id];
      return '!usernameNotFound';
    }

    // filter for projects the authuid can access
    publico = Object.fromEntries(Object.entries(publico).filter(proj => Object.keys(proj[1].editors).includes(authuid)));

    Object.keys(publico).forEach(key => {
      publico[key].starred = publico[key].editors[authuid].starred;

      // hide share date information except for your own
      // and change private uids to usernames
      publico[key].editors = Object.fromEntries(
        Object.entries(publico[key].editors).map(([uid, info]) => {
          // if this is you
          if (uid === authuid) {
            return [idToUsername(uid), { shareDate: info.shareDate, lastEdit: info.lastEdit }];
          }
          return [idToUsername(uid), { lastEdit: info.lastEdit }];
        })
      );

      // change owner uid to username
      publico[key].owner = idToUsername(publico[key].owner);
    });

    res.status(200).send(publico);
  }
}
