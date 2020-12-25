// must be run on a single thread to prevent race conditions

import { v4 as uuidv4 } from "uuid";
import { db } from "../../helpers/firebaseSetup";

export const execute = async (req, res) => {
  const authuid: string = req.body.authuid;
  let uuid = "";

  const projectIds: string[] =
    (await db
      .ref(`/projectIds`)
      .once("value")
      .then((snapshot) => snapshot.val())) || [];

  const totalProjects = !!projectIds ? projectIds.length : 0;

  // just create random uuids until it doesn't exist already
  do {
    uuid = uuidv4();
  } while (!!projectIds && projectIds.includes(uuid));

  // create default info in the db
  await db.ref(`projectIds/${totalProjects}`).set(uuid);

  const now = Date.now();
  await db.ref(`projectPublic/${uuid}`).set({
    name: "Untitled Project",
    owner: authuid,
    trashed: false,
    editors: {
      [authuid]: {
        lastEdit: now,
        shareDate: now,
        starred: false,
      },
    },
  });

  res.status(201).send(uuid);
};
