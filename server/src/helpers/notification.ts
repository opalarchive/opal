import { Notification } from "../../../.shared/src";
import { db } from "./firebaseSetup";

export const getNotifications = async (
  uid: string
): Promise<Notification[]> => {
  return (
    (await db
      .ref(`userInformation/${uid}/notifications`)
      .once("value")
      .then((snapshot) => snapshot.val())) || []
  );
};

export const pushNotification = async (
  uid: string,
  notification: Notification
) => {
  let currentNotifications = await getNotifications(uid);

  currentNotifications.push(notification);

  await db
    .ref(`userInformation/${uid}/notifications`)
    .set(currentNotifications);
};
