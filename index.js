const express = require('express');
const app = express();
const port = 2718;
const bodyParser = require('body-parser');
const urlEncoded = bodyParser.urlencoded({ extended: false });
const cors = require('cors');

const sendEmail = require('./helpers/emailSetup');
const { auth, db } = require('./helpers/firebaseSetup');
const { encrypt, decrypt, convertToURL, convertFromURL } = require('./helpers/cryptoSetup');

const fs = require('fs');

app.use(cors());

const routes = fs.readdirSync("./route").filter(file => file.endsWith(".js"));

for (const file of routes) {
  const route = require(`./route/${file}`);

  app.all(route.path, urlEncoded, (req, res) => route.execute(req, res));
}
/*
app.all("/create-account", urlEncoded, async (req, res) => {
  const username = req.query.username;
  console.log(username)
  if (!username) {
    res.status(400).send('auth/no-empty-username');
    return;
  }

  if (!username.match(/^[A-Za-z0-9\_]+$/)) {
    res.status(400).send('auth/incorrect-username-syntax');
    return;
  }

  const usernameExists = await db.ref(`/users/${username}`).once('value').then(snapshot => snapshot.val());
  if (usernameExists) {
    res.status(400).send("auth/username-already-exists");
    return;
  }

  auth.createUser({
    email: req.query.email,
    password: req.query.password,
    displayName: username
  }).then(async userRecord => {
    await db.ref(`users/${username}`).set(req.query.email);
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
  });
});

app.get("/verify/:id", (req, res) => {
  let encryptedUID = req.url.replace('/verify/', '');
  let uid;
  try {
    uid = convertFromURL(encryptedUID);
  }
  catch (e) {
    res.status(400).send("Invalid ID");
    return;
  }
  auth.updateUser(uid, { emailVerified: true }).then(async userRecord => {
    await db.ref(`userInformation/${userRecord.uid}/emailVerified`).set(true);
    res.status(200).send("Verified!");
  }).catch(error => {
    res.status(400).send("There is no such user");
    return;
  });
})

app.all("/get-all-usernames", urlEncoded, async (req, res) => {
  const usernames = await db.ref(`/users`).once('value').then(snapshot => snapshot.val());

  if (!usernames) {
    res.send('No users yet!');
    return;
  }
  res.send(JSON.stringify(usernames));
});
*/
app.listen(port, _ => {
  console.log(`Listening at http://localhost:${port}`);
})
