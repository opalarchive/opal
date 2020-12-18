import { db } from "../helpers/firebaseSetup";

export const execute = async (req, res) => {
  const authuid = req.query.authuid;
  const number = req.query.number;

  const user = await db
    .ref(`/userInformation/${authuid}`)
    .once("value")
    .then((snapshot) => snapshot.val());
  if (!user) {
    res.status(404).send("The user with the said id does not exist.");
    return;
  }

  let notifications =
    (await db
      .ref(`/userInformation/${authuid}/notifications`)
      .once("value")
      .then((snapshot) => snapshot.val())) || {};
  notifications =
    Object.keys(notifications).map((index) => notifications[index]) || [];
  for (let i = 0; i < Math.min(number, notifications.length); i++) {
    notifications[i].read = true;
  }
  await db.ref(`/userInformation/${authuid}/notifications`).set(notifications);

  res.status(201).send("Success");
};
