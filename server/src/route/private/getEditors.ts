import { Server } from "../../../../.shared/src/types";
import { db } from "../../helpers/firebaseSetup";
import { getIdToUsername } from "../../helpers/idToUsername";
import { projectAccess } from "../../helpers/projectAccess";

export const execute = async (req, res) => {
  const uuid: string = req.body.uuid;
  const authuid: string = req.body.authuid;

  const tryAccess = await projectAccess(uuid, authuid);
  if (tryAccess.status !== 200) {
    res.status(tryAccess.status).send(tryAccess.value);
    return;
  }

  const idToUsername = await getIdToUsername();

  const editors: Server.Editors | undefined = await db
    .ref(`projectPublic/${uuid}/editors`)
    .once("value")
    .then((snapshot) => snapshot.val());

  res.status(200).send(
    Object.fromEntries(
      Object.entries(editors || []).map(([uid, editStatus]) => {
        const { starred, ...editStatusWithoutStarred } = editStatus;
        return [idToUsername(uid), editStatusWithoutStarred];
      })
    )
  );
};
