import { Client, Server, UserInfo } from "../../../.shared/src/types";
import { db } from "../helpers/firebaseSetup";
import { getIdToUsername } from "../helpers/idToUsername";

export const execute = async (req, res) => {
  const authuid: string = req.query.authuid;
  let serverPublico: Server.Publico = await db
    .ref(`/projectPublic`)
    .once("value")
    .then((snapshot) => snapshot.val());

  if (!serverPublico) {
    res.status(200).send(null);
    return;
  }

  const idToUsername = await getIdToUsername();

  // filter for projects the authuid can access
  serverPublico = Object.fromEntries(
    Object.entries(serverPublico).filter(([uuid, proj]) =>
      Object.keys(proj.editors).includes(authuid)
    )
  );

  // Map Server.Publico to Client.Publico
  const clientPublico: Client.Publico = Object.fromEntries(
    Object.entries(serverPublico).map(([uuid, proj]) => {
      // hide share date information except for your own
      // and change private uids to usernames
      const editors: Client.Editors = Object.fromEntries(
        Object.entries(proj.editors).map(
          ([uid, editStatus]: [string, Server.EditStatus]) => {
            return [
              idToUsername(uid),
              { lastEdit: editStatus.lastEdit } as Client.EditStatus,
            ];
          }
        )
      );

      let projectPublic: Client.ProjectPublic = {
        editors,
        name: proj.name,
        owner: idToUsername(proj.owner),
        trashed: proj.trashed,
        starred: proj.editors[authuid].starred,
        shareDate: proj.editors[authuid].shareDate,
      };

      return [uuid, projectPublic];
    })
  );

  res.status(200).send(serverPublico);
};
