import { UsernameInfo } from "../../../.shared/src";
import { db } from "./firebaseSetup";

export const getUsernameToId = async (): Promise<
  (username: string) => string
> => {
  const users: { [username: string]: UsernameInfo } = await db
    .ref(`users`)
    .once("value")
    .then((snapshot) => snapshot.val());

  return (username) => {
    if (!!users[username].uid) return users[username].uid;
    return "!usernameNotFound";
  };
};
