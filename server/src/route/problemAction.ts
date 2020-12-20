import { clientdb } from "../helpers/clientdb";
import * as firebase from "firebase-admin";
import { Problem } from "../../../.shared/src/types";
import { Result } from "../helpers/types";

type data = string | number;

const tryAction = async (
  cdb: firebase.database.Database,
  problem: Problem,
  problemId: string,
  data: data,
  type: string,
  authuid: string
): Promise<Result<string>> => {
  const now = Date.now();

  switch (type) {
    case "vote":
      if (typeof data !== "number") {
        return { status: 400, value: "invalid-input" };
      }

      const newVote: number =
        !!problem.votes && problem.votes[authuid] === data ? 0 : data;
      await cdb.ref(`problems/${problemId}/votes/${authuid}`).set(newVote);

      break;
    case "comment":
      let index = 0;
      if (!!problem.replies) {
        index = problem.replies.length;
      }

      await cdb.ref(`problems/${problemId}/replies/${index}`).set({
        author: authuid,
        text: data,
        time: now,
        type: "comment",
      });

      break;
    default:
      break;
  }
  return { status: 200, value: "success" };
};

export const execute = async (req, res) => {
  const uuid: string = req.query.uuid;
  const problemId: string = req.query.problemId;
  let data: data = req.query.data;
  const type: string = req.query.type;
  const authuid: string = req.query.authuid;

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
    .ref(`problems/${problemId}`)
    .once("value")
    .then((snapshot) => snapshot.val());

  if (!problem) {
    res.status(404).send("problem-not-found");
    return;
  }

  const result = await tryAction(
    trydb.value,
    problem,
    problemId,
    data,
    type,
    authuid
  );
  res.status(result.status).send(result.value);
};
