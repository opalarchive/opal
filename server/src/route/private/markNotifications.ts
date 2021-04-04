import { UserInfo } from "../../../../.shared/src";
import { db } from "../../helpers/firebaseSetup";
import { getNotifications } from "../../helpers/notification";

export const execute = async (req, res) => {
  const authuid: string = req.body.authuid;
  const number: number = req.body.number;

  const user: UserInfo | null = await db
    .ref(`/userInformation/${authuid}`)
    .once("value")
    .then((snapshot) => snapshot.val());

  if (!user) {
    res.status(404).send("user-not-found");
    return;
  }

  let notifications = await getNotifications(authuid);
  for (let i = 0; i < Math.min(number, notifications.length); i++) {
    notifications[i].read = true;
  }
  await db.ref(`/userInformation/${authuid}/notifications`).set(notifications);

  res.status(201).send("success");
};
