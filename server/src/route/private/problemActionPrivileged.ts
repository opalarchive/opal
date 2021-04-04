import { clientdb } from "../../helpers/clientdb";
import * as firebase from "firebase-admin";
import {
  Problem,
  actionData,
  problemActionPrivileged,
  ProjectSettings,
  Server,
  ProjectRole,
} from "../../../../.shared/src";
import { Result } from "../../helpers/types";
import { db } from "../../helpers/firebaseSetup";
import {
  problemTextMaxLength,
  problemTitleMaxLength,
} from "../../../../.shared/src";

const permission = (
  editors: Server.Editors,
  problem: Problem,
  authuid: string,
  type: problemActionPrivileged
): boolean => {
  switch (type) {
    case "editTitle":
      return (
        ProjectRole[editors[authuid].role] === ProjectRole.OWNER ||
        ProjectRole[editors[authuid].role] == ProjectRole.ADMIN ||
        authuid === problem.author
      );
      break;
    case "editText":
      return (
        ProjectRole[editors[authuid].role] === ProjectRole.OWNER ||
        ProjectRole[editors[authuid].role] == ProjectRole.ADMIN ||
        authuid === problem.author
      );
      break;
    case "editCategory":
      return (
        ProjectRole[editors[authuid].role] === ProjectRole.OWNER ||
        ProjectRole[editors[authuid].role] == ProjectRole.ADMIN ||
        authuid === problem.author
      );
      break;
    case "editDifficulty":
      return (
        ProjectRole[editors[authuid].role] === ProjectRole.OWNER ||
        ProjectRole[editors[authuid].role] == ProjectRole.ADMIN ||
        authuid === problem.author
      );
      break;
    default:
      break;
  }
  return false;
};

const tryActionPrivileged = async (
  cdb: firebase.database.Database,
  editors: Server.Editors,
  problem: Problem,
  problemInd: number,
  data: actionData,
  type: problemActionPrivileged,
  projectSettings: ProjectSettings,
  authuid: string
): Promise<Result<string>> => {
  if (!permission(editors, problem, authuid, type))
    return { status: 400, value: "forbidden" };
  switch (type) {
    case "editTitle":
      if (typeof data !== "string" || data.length > problemTitleMaxLength) {
        return { status: 400, value: "invalid-input" };
      }

      if (data == problem.title) {
        return { status: 200, value: "no-change" };
      }

      await cdb.ref(`problems/${problemInd}/title`).set(data);

      break;
    case "editText":
      if (typeof data !== "string" || data.length > problemTextMaxLength) {
        return { status: 400, value: "invalid-input" };
      }

      if (data == problem.text) {
        return { status: 200, value: "no-change" };
      }

      await cdb.ref(`problems/${problemInd}/text`).set(data);

      break;
    case "editCategory":
      if (
        typeof data !== "string" ||
        !Object.keys(projectSettings.categoryColors).includes(data)
      ) {
        return { status: 400, value: "invalid-input" };
      }

      if (data == problem.category) {
        return { status: 200, value: "no-change" };
      }

      await cdb.ref(`problems/${problemInd}/category`).set(data);

      break;
    case "editDifficulty":
      if (
        typeof data !== "number" ||
        data < projectSettings.difficultyRange.start ||
        data > projectSettings.difficultyRange.end
      ) {
        return { status: 400, value: "invalid-input" };
      }

      if (data == problem.difficulty) {
        return { status: 200, value: "no-change" };
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

  const editors: Server.Editors = await db
    .ref(`projectPublic/${uuid}/editors`)
    .once("value")
    .then((snapshot) => snapshot.val());

  const result = await tryActionPrivileged(
    trydb.value,
    editors,
    problem,
    problemInd,
    data,
    type,
    projectSettings,
    authuid
  );
  res.status(result.status).send(result.value);
};
