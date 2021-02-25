import { projectAccess } from "../../helpers/projectAccess";
import { db } from "../../helpers/firebaseSetup";

export const execute = async (req, res) => {
  const uuid: string = req.body.uuid;
  const authuid: string = req.body.authuid;

  const tryAccess = await projectAccess(uuid, authuid);
  if (tryAccess.status !== 200) {
    res.status(tryAccess.status).send(tryAccess.value);
    return;
  }

  const name: string = await db
    .ref(`projectPublic/${uuid}/name`)
    .once("value")
    .then((snapshot) => snapshot.val());
  res.status(200).send(name);
};
