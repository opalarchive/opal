import { clientdb } from "../../helpers/clientdb";
import * as firebase from "firebase-admin";
import {
  Problem,
  actionData,
  replyAction,
  ReplyType,
  reply,
  Server,
  ProjectRole,
} from "../../../../.shared/src/types";
import { Result } from "../../helpers/types";
import { db } from "../../helpers/firebaseSetup";

const permission = (
  editors: Server.Editors,
  problem: Problem,
  reply: reply,
  authuid: string,
  type: replyAction
): boolean => {
  switch (type) {
    case "editText":
      return authuid === reply.author;
      break;
    case "editType":
      return authuid === reply.author;
      break;
    case "delete":
      return (
        ProjectRole[editors[authuid].role] == 0 ||
        ProjectRole[editors[authuid].role] == 1 ||
        authuid === reply.author
      );
      break;
    default:
      break;
  }
  return false;
};

const tryAction = async (
  cdb: firebase.database.Database,
  editors: Server.Editors,
  problem: Problem,
  problemInd: number,
  reply: reply,
  replyInd: number,
  data: actionData,
  type: replyAction,
  authuid: string
): Promise<Result<string>> => {
  if (!permission(editors, problem, reply, authuid, type)) return { status: 400, value: "forbidden" };
  const now = Date.now();
  const replies = problem.replies;

  switch (type) {
    case "editText":
      if (typeof data !== "string") {
        return { status: 400, value: "invalid-input" };
      }

      if (data == reply.text) {
        return { status: 200, value: "no-change" };
      }

      await cdb
        .ref(`problems/${problemInd}/replies/${replyInd}/text`)
        .set(data);
      await cdb
        .ref(`problems/${problemInd}/replies/${replyInd}/lastEdit`)
        .set(now);

      break;
    case "editType":
      if (typeof data !== "string") {
        return { status: 400, value: "invalid-input" };
      }

      if (data == reply.type) {
        return { status: 200, value: "no-change" };
      }

      if (!(data in ReplyType)) {
        return { status: 400, value: "invalid-input" };
      }

      await cdb
        .ref(`problems/${problemInd}/replies/${replyInd}/type`)
        .set(data);
      await cdb
        .ref(`problems/${problemInd}/replies/${replyInd}/lastEdit`)
        .set(now);

      break;
    case "delete":
      let newReplies = replies;
      newReplies.splice(replyInd, 1);
      await cdb.ref(`problems/${problemInd}/replies`).set(newReplies);

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
  let data: actionData = req.body.data;
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

  const editors: Server.Editors = await db.ref(`projectPublic/${uuid}/editors`).once("value").then((snapshot) => snapshot.val());

  const result = await tryAction(
    trydb.value,
    editors,
    problem,
    problemInd,
    reply,
    replyInd,
    data,
    type,
    authuid
  );
  res.status(result.status).send(result.value);
};
