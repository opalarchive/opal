import { UserInfo } from "../../../.shared/src";
import { db } from "./firebaseSetup";

export const getIdToUsername = async (): Promise<(id: string) => string> => {
  const usernameInfo: { [uid: string]: UserInfo } = await db
    .ref(`/userInformation`)
    .once("value")
    .then((snapshot) => snapshot.val());

  return (id) => {
    if (!!usernameInfo[id].username) return usernameInfo[id].username;
    return "!usernameNotFound";
  };
};
