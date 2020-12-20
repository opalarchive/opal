import { dbaccess } from "../helpers/dbaccess";
import { db } from "../helpers/firebaseSetup";

export const execute = async (req, res) => {
  const uuid: string = req.query.uuid;
  const authuid: string = req.query.authuid;

  const tryAccess = await dbaccess(uuid, authuid);
  if (tryAccess.status !== 200) {
    res.status(tryAccess.status).send(tryAccess.value);
  }

  const name: string = await db
    .ref(`projectPublic/${uuid}/name`)
    .once("value")
    .then((snapshot) => snapshot.val());
  res.status(200).send(name);
};
