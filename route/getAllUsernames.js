const { db } = require("../helpers/firebaseSetup");

module.exports = {
  path: "/get-all-usernames",
  execute: async (req, res) => {
    const usernames = await db.ref(`/users`).once('value').then(snapshot => snapshot.val());

    if (!usernames) {
      res.send('No users yet!');
      return;
    }
    res.send(JSON.stringify(usernames));
  }
}
