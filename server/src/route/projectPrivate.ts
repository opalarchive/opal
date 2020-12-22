import { ProjectPrivate } from "../../../.shared/src/types";
import { clientdb } from "../helpers/clientdb";
import { getIdToUsername } from "../helpers/idToUsername";

export const execute = async (req, res) => {
  const uuid: string = req.body.uuid;
  const authuid: string = req.body.authuid;

  const trydb = await clientdb(uuid, authuid);

  if (trydb.status !== 200 || typeof trydb.value === "string") {
    res.status(trydb.status).send(trydb.value);
    return;
  }

  let projectPrivate: ProjectPrivate = await trydb.value
    .ref("/")
    .once("value")
    .then((snapshot) => snapshot.val());

  const idToUsername = await getIdToUsername();

  // change private uids to usernames
  if (!!projectPrivate.problems) {
    projectPrivate.problems.forEach((prob) => {
      prob.author = idToUsername(prob.author);
      // the uid is a key, so we have to turn the object into an array and back
      if (!!prob.votes) {
        prob.votes = Object.fromEntries(
          Object.entries(prob.votes).map(([uid, vote]) => [
            idToUsername(uid),
            vote,
          ])
        );
      }
      // uid is a value, so it can do directly changed
      if (!!prob.replies) {
        prob.replies.forEach((reply) => {
          reply.author = idToUsername(reply.author);
        });
      }
    });
  }
  res.status(200).send(projectPrivate);
};
