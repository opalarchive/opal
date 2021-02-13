import { clientdb } from "../../helpers/clientdb";
import * as firebase from "firebase-admin";
import {
  Problem,
  data,
  problemAction,
  vote,
  ReplyType,
  problemActionPrivileged,
} from "../../../../.shared/src/types";
import { Result } from "../../helpers/types";

const tryActionPrivileged = async (
  cdb: firebase.database.Database,
  problem: Problem,
  problemInd: number,
  data: data,
  type: problemActionPrivileged,
  authuid: string
): Promise<Result<string>> => {
  const now = Date.now();
  let tags: string[] = problem.tags || [];
  let newTags: string[] = [];
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
      if (typeof data !== "string") {
        return { status: 400, value: "invalid-input" };
      }

      if (!["algebra", "geometry", "numberTheory", "combinatorics"].includes(data)) {
        data = "miscellaneous";
      }

      await cdb.ref(`problems/${problemInd}/category`).set(data);

      break;
    case "difficulty":
      if (typeof data !== "number") {
        break;
      }

      //these two checks usually wont pass through since there's a slider, but its just in case

      if (data < 0) {
        data = 0;
      }

      if (data > 100) {
        data = 100;
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
  let data: data = req.body.data;
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

  const result = await tryActionPrivileged(
    trydb.value,
    problem,
    problemInd,
    data,
    type,
    authuid
  );
  res.status(result.status).send(result.value);
};
