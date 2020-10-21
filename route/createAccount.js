const { auth, db } = require("../helpers/firebaseSetup");
const { convertToURL } = require('../helpers/cryptoSetup');
const sendEmail = require('../helpers/emailSetup');

module.exports = {
  path: "/create-account",
  execute: async (req, res) => {
    const username = req.query.username;
    if (!username) {
      res.status(400).send('auth/no-empty-username');
      console.log("Here1");
      return;
    }

    if (!username.match(/^[A-Za-z0-9\_]+$/)) {
      res.status(400).send('auth/incorrect-username-syntax');
      console.log("Here2");
      return;
    }

    const usernameExists = await db.ref(`/users/${username}`).once('value').then(snapshot => snapshot.val());
    if (usernameExists) {
      res.status(400).send("auth/username-already-exists");
      console.log("Here3");
      return;
    }

    auth.createUser({
      email: req.query.email,
      password: req.query.password,
      displayName: username
    }).then(async userRecord => {
      await db.ref(`users/${username}`).set({
        email: req.query.email,
        uid: userRecord.uid
      });
      await db.ref(`userInformation/${userRecord.uid}`).set({
        roles: {
          testTaker: 'testTaker'
        },
        username,
        email: req.query.email,
        emailVerified: false
      });
      const link = req.protocol + '://' + req.get('host') + '/verify/' + convertToURL(userRecord.uid);
      await sendEmail({
        email: req.query.email,
        subject: `Verify Your Account, ${username}`,
        content: `Hello ${username},<br /><br />You recently signed up for the Math Olympiad website. We're glad to have you here. But before you can start, you'll need to verify your account by clicking <a href="${link}">here</a>. If that doesn't work, copy the following into the browser: <a href="${link}">${link}</a>.<br /><br />Sincerely,<br />The Math Olympiad Team`
      });
      res.status(200).send("Account created");
    }).catch(error => {
      res.status(400).send(error.code);
      console.log(error);
    });
  }
}
