import { clientdb } from "../../helpers/clientdb";
import * as firebase from "firebase-admin";
import { Problem, List } from "../../../../.shared/src";
import { Result } from "../../helpers/types";

const tryChangeList = async (
  cdb: firebase.database.Database,
  listSelection: boolean[],
  problemInd: number,
  authuid: string
): Promise<Result<string>> => {
  let lists: List[] =
    (await cdb
      .ref(`lists`)
      .once("value")
      .then((snapshot) => snapshot.val())) || [];

  if (lists.length !== listSelection.length) {
    return { status: 400, value: "invalid-input" };
  }

  for (let i = 0; i < listSelection.length; i++) {
    if (!lists[i].problems) lists[i].problems = [];
    if (listSelection[i]) {
      if (!lists[i].problems.includes(problemInd)) {
        lists[i].problems.push(problemInd);
      }
    } else {
      if (lists[i].problems.includes(problemInd)) {
        var index = lists[i].problems.indexOf(problemInd);
        lists[i].problems.splice(index, 1);
      }
    }
  }

  await cdb.ref(`lists`).set(lists);

  return { status: 200, value: "success" };
};

export const execute = async (req, res) => {
  const uuid: string = req.body.uuid;
  const listSelection: boolean[] = req.body.listSelection;
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

  const result = await tryChangeList(
    trydb.value,
    listSelection,
    problemInd,
    authuid
  );
  res.status(result.status).send(result.value);
};
