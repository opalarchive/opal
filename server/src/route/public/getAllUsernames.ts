import { UsernameInfo } from "../../../../.shared/src";
import { db } from "../../helpers/firebaseSetup";

export const execute = async (req, res) => {
  const usernames: { [username: string]: UsernameInfo } =
    (await db
      .ref(`/users`)
      .once("value")
      .then((snapshot) => snapshot.val())) || {};

  res.status(200).send(JSON.stringify(Object.keys(usernames)));
};
