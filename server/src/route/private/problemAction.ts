import { clientdb } from "../../helpers/clientdb";
import * as firebase from "firebase-admin";
import {
  Problem,
  data,
  problemAction,
  vote,
  ReplyType,
} from "../../../../.shared/src/types";
import { Result } from "../../helpers/types";

const tryAction = async (
  cdb: firebase.database.Database,
  problem: Problem,
  problemInd: number,
  data: data,
  type: problemAction,
  authuid: string
): Promise<Result<string>> => {
  const now = Date.now();
  let tags: string[] = problem.tags || [];
  let newTags: string[] = [];
  let index = 0;
  switch (type) {
    case "vote":
      if (data !== 1 && data !== -1) {
        return { status: 400, value: "invalid-input" };
      }

      const newVote: vote =
        !!problem.votes && problem.votes[authuid] === data ? 0 : data;
      await cdb.ref(`problems/${problemInd}/votes/${authuid}`).set(newVote);

      break;
    case "comment":
      if (typeof data !== "string") {
        return { status: 400, value: "invalid-input" };
      }

      index = 0;
      if (!!problem.replies) {
        index = problem.replies.length;
      }

      await cdb.ref(`problems/${problemInd}/replies/${index}`).set({
        author: authuid,
        text: data,
        time: now,
        type: ReplyType.COMMENT,
        lastEdit: now,
      });

      break;
    case "solution":
      if (typeof data !== "string") {
        return { status: 400, value: "invalid-input" };
      }

      index = 0;
      if (!!problem.replies) {
        index = problem.replies.length;
      }

      await cdb.ref(`problems/${problemInd}/replies/${index}`).set({
        author: authuid,
        text: data,
        time: now,
        type: ReplyType.SOLUTION,
        lastEdit: now,
      });

      break;
    case "removeTag":
      if (typeof data !== "string") {
        return { status: 400, value: "invalid-input" };
      }
      
      newTags = tags.filter((tag) => tag !== data);

      await cdb.ref(`problems/${problemInd}/tags`).set(newTags);

      break;
    case "addTag":
      if (typeof data !== "object") {
        return { status: 400, value: "invalid-input" };
      }

      if (data.length == 0) {
        break;
      }

      newTags = [...tags];

      for (let i=0; i<data.length; i++) {
        if (data[i].length > 0 && !tags.includes(data[i])) {
          newTags.push(data[i]);
        }
      }

      await cdb.ref(`problems/${problemInd}/tags`).set(newTags);

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
  const type: problemAction = req.body.type;
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

  const result = await tryAction(
    trydb.value,
    problem,
    problemInd,
    data,
    type,
    authuid
  );
  res.status(result.status).send(result.value);
};
