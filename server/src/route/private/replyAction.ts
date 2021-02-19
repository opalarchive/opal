import { clientdb } from "../../helpers/clientdb";
import * as firebase from "firebase-admin";
import {
  Problem,
  data,
  problemAction,
  replyAction,
  vote,
  ReplyType,
  reply,
} from "../../../../.shared/src/types";
import { Result } from "../../helpers/types";

const tryAction = async (
  cdb: firebase.database.Database,
  problem: Problem,
  problemInd: number,
  replyInd: number,
  data: data,
  type: replyAction,
  authuid: string
): Promise<Result<string>> => {
  const now = Date.now();
  
  switch (type) {
    case "editText":
      if (typeof data !== "string") {
        return { status: 400, value: "invalid-input" };
      }

      if (authuid !== problem.replies[replyInd].author) {
        return { status: 400, value: "forbidden" }
      }

      await cdb.ref(`problems/${problemInd}/replies/${replyInd}/text`).set(data);
      await cdb.ref(`problems/${problemInd}/replies/${replyInd}/lastEdit`).set(now);

      break;
    case "editType":
      if (typeof data !== "string") {
        return { status: 400, value: "invalid-input" };
      }

      if (authuid !== problem.replies[replyInd].author) {
        return { status: 400, value: "forbidden" }
      }

      if (data == problem.replies[replyInd].type) {
        break;
      }

      if (!(data in ReplyType)) {
        break;
      }

      await cdb.ref(`problems/${problemInd}/replies/${replyInd}/type`).set(data);
      await cdb.ref(`problems/${problemInd}/replies/${replyInd}/lastEdit`).set(now);

      break;
    default:
      break;
  }
  return { status: 200, value: "success" };
};

export const execute = async (req, res) => {
  const uuid: string = req.body.uuid;
  const problemInd: number = req.body.problemInd;
  const replyInd: number = req.body.replyInd;
  let data: data = req.body.data;
  const type: replyAction = req.body.type;
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

  const reply: reply | null = await trydb.value
    .ref(`problems/${problemInd}/replies/${replyInd}`)
    .once("value")
    .then((snapshot) => snapshot.val());

  if (!reply) {
    res.status(404).send("reply-not-found");
    return;
  }

  const result = await tryAction(
    trydb.value,
    problem,
    problemInd,
    replyInd,
    data,
    type,
    authuid
  );
  res.status(result.status).send(result.value);
};
