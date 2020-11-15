const { db } = require('../helpers/firebaseSetup');

module.exports = {
  path: '/get-notifications',
  execute: async (req, res) => {
    const authuid = req.query.authuid;
    let notifications = await db.ref(`/userInformation/${authuid}/notifications`).once('value').then(snapshot => snapshot.val()) || {};
    notifications = Object.keys(notifications).map(index => notifications[index]) || [];

    res.status(201).send(JSON.stringify(notifications));
  }
}
