import { dbaccess } from "../helpers/dbaccess";
import { db } from "../helpers/firebaseSetup";

export const execute = async (req, res) => {
  const uuid = req.query.uuid;
  const authuid = req.query.authuid;

  const tryAccess = await dbaccess(uuid, authuid);
  if (tryAccess[0] !== 200) {
    res.status(tryAccess[0]).send(tryAccess[1]);
  }

  const name = await db
    .ref(`projectPublic/${uuid}/name`)
    .once("value")
    .then((snapshot) => snapshot.val());
  res.status(200).send(name);
};
