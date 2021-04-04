import { clientdb } from "../../helpers/clientdb";
import * as firebase from "firebase-admin";
import { Problem } from "../../../../.shared/src";
import { Result } from "../../helpers/types";

const tryChangeList = async (
  cdb: firebase.database.Database,
  newTag: string,
  problemInd: number,
  authuid: string
): Promise<Result<string>> => {
  let tags = await cdb
    .ref(`problems/${problemInd}/tags`)
    .once("value")
    .then((snapshot) => snapshot.val());

  tags.push(newTag);

  await cdb.ref(`problems/${problemInd}/tags`).set(tags);

  return { status: 200, value: "success" };
};

export const execute = async (req, res) => {
  const uuid: string = req.body.uuid;
  const newTag: string = req.body.newTag;
  const problemInd: number = req.body.problemInd;
  const authuid: string = req.body.authuid;

  const trydb = await clientdb(uuid, authuid);

  if (trydb.status !== 200 || typeof trydb.value === "string") {
    res.status(trydb.status).send(trydb.value);
    return;
  }

  const problem: Problem | null = await trydb.value
    .ref(`problems/${problemInd}`)
    .once("value")
    .then((snapshot) => snapshot.val());

  if (!problem) {
    res.status(404).send("problem-not-found");
    return;
  }

  const result = await tryChangeList(trydb.value, newTag, problemInd, authuid);
  res.status(result.status).send(result.value);
};
