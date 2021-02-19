import { clientdb } from "../../helpers/clientdb";
import { db } from "../../helpers/firebaseSetup";
export const execute = async (req, res) => {
  const uuid: string = req.body.uuid;
  const authuid: string = req.body.authuid;
  const listInd: number = req.body.listInd;
  // drag and drop from source index to destination index
  const sourceInd: number = req.body.sourceInd;
  const destInd: number = req.body.destInd;

  const trydb = await clientdb(uuid, authuid);

  if (trydb.status !== 200 || typeof trydb.value === "string") {
    res.status(trydb.status).send(trydb.value);
    return;
  }

  let listProblems: number[] | undefined = await trydb.value
    .ref(`lists/${listInd}/problems`)
    .once("value")
    .then((snapshot) => snapshot.val());

  if (!listProblems) {
    res.status(404).send("list-not-found");
    return;
  }

  // indices should be in bounds, i.e. return actual problems
  if (
    listProblems[sourceInd] === undefined ||
    listProblems[destInd] === undefined
  ) {
    res.status(400).send("index-out-of-bonds");
    return;
  }

  const movedProblemInd = listProblems[sourceInd];
  listProblems.splice(sourceInd, 1);
  listProblems.splice(destInd, 0, movedProblemInd);

  trydb.value.ref(`lists/${listInd}/problems`).set(listProblems);

  res.status(202).send("success");
};
