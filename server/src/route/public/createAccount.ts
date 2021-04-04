// must be run on a single thread to prevent race conditions

import { UsernameInfo } from "../../../../.shared/src";
import { convertToURL } from "../../helpers/cryptoSetup";
import { sendEmail } from "../../helpers/emailSetup";
import { auth, db } from "../../helpers/firebaseSetup";

export const execute = async (req, res) => {
  const email: string = req.body.email;
  const username: string = req.body.username;
  const password: string = req.body.password;

  if (!username.match(/^[A-Za-z0-9\_]+$/)) {
    res.status(400).send("auth/incorrect-username-syntax");
    return;
  }

  const usernameExists: UsernameInfo = await db
    .ref(`/users/${username}`)
    .once("value")
    .then((snapshot) => snapshot.val());
  if (usernameExists) {
    res.status(400).send("auth/username-already-exists");
    return;
  }

  auth
    .createUser({
      email,
      password,
      displayName: username,
    })
    .then(async (userRecord) => {
      await db.ref(`users/${username}`).set({
        email,
        uid: userRecord.uid,
      });
      await db.ref(`userInformation/${userRecord.uid}`).set({
        username,
        email,
        emailVerified: false,
      });
      const link = `${req.protocol}://${req.get("host")}/verify/${convertToURL(
        userRecord.uid
      )}`;
      await sendEmail({
        targetEmail: email,
        subject: `Verify Your Account, ${username}`,
        content: `Hello ${username},<br /><br />You recently signed up for the Math Olympiad website. We're glad to have you here. But before you can start, you'll need to verify your account by clicking <a href='${link}'>here</a>. If that doesn't work, copy the following into the browser: <a href='${link}'>${link}</a>.<br /><br />Sincerely,<br />The Math Olympiad Team`,
      });
      res.status(201).send("Account created");
    })
    .catch((error) => {
      res.status(400).send(error.code);
      console.log(error);
    });
};
