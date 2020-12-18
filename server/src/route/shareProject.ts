import { sendEmail } from "../helpers/emailSetup";
import { db } from "../helpers/firebaseSetup";

export const execute = async (req, res) => {
  const username = req.query.username;
  const uuid = req.query.uuid;
  const authuid = req.query.authuid;

  const projectPublic = await db
    .ref(`projectPublic/${uuid}`)
    .once("value")
    .then((snapshot) => snapshot.val());
  if (!projectPublic) {
    // it doesn't exist
    res.status(404).send("does-not-exist");
    return;
  }

  if (projectPublic.owner !== authuid) {
    // you're not the owner
    res.status(403).send("forbidden");
    return;
  }

  const userinfo = await db
    .ref(`users/${username}`)
    .once("value")
    .then((snapshot) => snapshot.val());
  if (!userinfo) {
    res.status(404).send("username-does-not-exist");
    return;
  }

  if (projectPublic.editors[userinfo.uid]) {
    res.status(403).send("user-is-already-editor");
    return;
  }

  if (projectPublic.trashed) {
    res.status(403).send("project-trashed");
    return;
  }

  const date = new Date();
  const now = date.getTime();
  await db.ref(`projectPublic/${uuid}/editors/${userinfo.uid}`).set({
    lastEdit: now,
    shareDate: now,
    starred: false,
  });
  await db.ref(`projectPublic/${uuid}/editors/${authuid}/lastEdit`).set(now);

  const ownerUsername = await db
    .ref(`userInformation/${authuid}/username`)
    .once("value")
    .then((snapshot) => snapshot.val());
  await sendEmail({
    email: userinfo.email,
    subject: `${projectPublic.name} was shared with you by ${ownerUsername}, ${username}`,
    content: `Hello ${username},<br /><br />You were invited to <a href="/project/view/${uuid}">${projectPublic.name}</a> by the owner, ${ownerUsername}. We hope you enjoy proposing problems and our system!<br /><br />Sincerely,<br />The Math Olympaid Team`,
  });

  let currentNotifications =
    (await db
      .ref(`userInformation/${userinfo.uid}/notifications`)
      .once("value")
      .then((snapshot) => snapshot.val())) || {};
  currentNotifications =
    Object.keys(currentNotifications).map(
      (index) => currentNotifications[index]
    ) || [];
  currentNotifications.push({
    content: `${ownerUsername} has shared <a href="/project/view/${uuid}">${projectPublic.name}</a> with you!`,
    timestamp: now,
    link: `/project/view/${uuid}`,
    read: false,
    title: `New Project Shared!`,
  });
  await db
    .ref(`userInformation/${userinfo.uid}/notifications`)
    .set(currentNotifications);

  res.status(201).send(`Success. Project is now shared with ${username}.`);
};
