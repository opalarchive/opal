import { clientdb } from "../../helpers/clientdb";
import * as firebase from "firebase-admin";
import { List, listNameMaxLength } from "../../../../.shared/src";
import { Result } from "../../helpers/types";
import { editProject } from "../../helpers/editProject";

const tryAction = async (
  cdb: firebase.database.Database,
  list: List,
  uuid: string,
  authuid: string
): Promise<Result<string>> => {
  let lists: List[] | undefined = await cdb
    .ref(`lists`)
    .once("value")
    .then((snapshot) => snapshot.val());

  lists = lists || [];
  lists.push(list);

  await cdb.ref(`lists`).set(lists);
  editProject(uuid, authuid);

  return { status: 200, value: "success" };
};

export const execute = async (req, res) => {
  const uuid: string = req.body.uuid;
  const list: List = req.body.list;
  const authuid: string = req.body.authuid;

  if (!list) {
    res.status(404).send("invalid-list");
    return;
  }

  const trydb = await clientdb(uuid, authuid);

  if (trydb.status !== 200 || typeof trydb.value === "string") {
    res.status(trydb.status).send(trydb.value);
    return;
  }

  if (
    typeof list.name !== "string" ||
    list.name.length === 0 ||
    list.name.length > listNameMaxLength
  ) {
    res.status(400).send("invalid-list-details");
    return;
  }
  list.problems = list.problems || [];

  const result = await tryAction(trydb.value, list, uuid, authuid);
  res.status(result.status).send(result.value);
};
