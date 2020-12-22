import { Server } from "../../../.shared/src/types";
import { db } from "../helpers/firebaseSetup";

export const execute = async (req, res) => {
  const uuid: string = req.body.uuid;
  const authuid: string = req.body.authuid;

  const projectPublic: Server.ProjectPublic | null = await db
    .ref(`projectPublic/${uuid}`)
    .once("value")
    .then((snapshot) => snapshot.val());
  if (!projectPublic) {
    // it doesn't exist
    res.status(404).send("does-not-exist");
    return;
  }

  const isStarred = projectPublic.editors[authuid].starred;
  await db
    .ref(`projectPublic/${uuid}/editors/${authuid}/starred`)
    .set(!isStarred);

  res.status(201).send("success");
};
