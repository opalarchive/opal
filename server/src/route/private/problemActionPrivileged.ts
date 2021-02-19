import { clientdb } from "../../helpers/clientdb";
import * as firebase from "firebase-admin";
import {
  Problem,
  actionData,
  problemActionPrivileged,
  ProjectSettings,
} from "../../../../.shared/src/types";
import { Result } from "../../helpers/types";

const tryActionPrivileged = async (
  cdb: firebase.database.Database,
  problem: Problem,
  problemInd: number,
  data: actionData,
  type: problemActionPrivileged,
  projectSettings: ProjectSettings,
  authuid: string
): Promise<Result<string>> => {
  switch (type) {
    case "title":
      if (typeof data !== "string") {
        return { status: 400, value: "invalid-input" };
      }

      await cdb.ref(`problems/${problemInd}/title`).set(data);

      break;
    case "text":
      if (typeof data !== "string") {
        return { status: 400, value: "invalid-input" };
      }

      await cdb.ref(`problems/${problemInd}/text`).set(data);

      break;
    case "category":
      if (
        typeof data !== "string" ||
        !Object.keys(projectSettings.categoryColors).includes(data)
      ) {
        return { status: 400, value: "invalid-input" };
      }

      await cdb.ref(`problems/${problemInd}/category`).set(data);

      break;
    case "difficulty":
      if (
        typeof data !== "number" ||
        data < projectSettings.difficultyRange.start ||
        data > projectSettings.difficultyRange.end
      ) {
        return { status: 400, value: "invalid-input" };
      }

      await cdb.ref(`problems/${problemInd}/difficulty`).set(data);

      break;
    default:
      break;
  }
  return { status: 200, value: "success" };
};

export const execute = async (req, res) => {
  const uuid: string = req.body.uuid;
  const problemInd: number = req.body.problemInd;
  let data: actionData = req.body.data;
  const type: problemActionPrivileged = req.body.type;
  const authuid: string = req.body.authuid;

  if (!data) {
    res.status(404).send("action-not-found");
    return;
  }

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

  const projectSettings: ProjectSettings = await trydb.value
    .ref(`settings`)
    .once("value")
    .then((snapshot) => snapshot.val());

  const result = await tryActionPrivileged(
    trydb.value,
    problem,
    problemInd,
    data,
    type,
    projectSettings,
    authuid
  );
  res.status(result.status).send(result.value);
};
