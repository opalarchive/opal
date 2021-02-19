import { clientdb } from "../../helpers/clientdb";
import * as firebase from "firebase-admin";
import { Problem } from "../../../../.shared/src/types";
import { Result } from "../../helpers/types";

const tryAction = async (
  cdb: firebase.database.Database,
  problem: Omit<Problem, "ind">,
  authuid: string
): Promise<Result<string>> => {
  let problems = await cdb
    .ref(`problems`)
    .once("value")
    .then((snapshot) => snapshot.val());
  problems.push(problem);
  await cdb.ref(`problems`).set(problems);

  return { status: 200, value: "success" };
};

export const execute = async (req, res) => {
  const uuid: string = req.body.uuid;
  const problem: Omit<Problem, "ind"> = req.body.problem;
  const authuid: string = req.body.authuid;

  if (!problem) {
    res.status(404).send("action-not-found");
    return;
  }

  const trydb = await clientdb(uuid, authuid);

  if (trydb.status !== 200 || typeof trydb.value === "string") {
    res.status(trydb.status).send(trydb.value);
    return;
  }

  const result = await tryAction(trydb.value, problem, authuid);
  res.status(result.status).send(result.value);
};
