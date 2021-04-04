import { ProjectRole, projectRole, Server } from "../../../../.shared/src";
import { Result } from "../../helpers/types";
import { getUsernameToId } from "../../helpers/usernameToId";
import { db } from "../../helpers/firebaseSetup";

const tryAction = async (
  uuid: string,
  editors: Server.Editors,
  username: string,
  subjectNewRole: projectRole,
  authuid: string
): Promise<Result<string>> => {
  const myRole: projectRole = editors[authuid].role;
  if (ProjectRole[myRole] > 1) {
    return { status: 400, value: "forbidden" };
  }

  const usernameToId = await getUsernameToId();

  const subjectUid = usernameToId(username);

  const subjectCurrentRole: projectRole = editors[subjectUid].role;

  if (
    ProjectRole[myRole] > 0 &&
    (ProjectRole[myRole] >= ProjectRole[subjectCurrentRole] ||
      ProjectRole[myRole] >= ProjectRole[subjectNewRole])
  ) {
    return { status: 400, value: "forbidden" };
  }

  await db
    .ref(`projectPublic/${uuid}/editors/${subjectUid}/role`)
    .set(subjectNewRole);

  return { status: 200, value: "success" };
};

export const execute = async (req, res) => {
  const uuid: string = req.body.uuid;
  const username: string = req.body.username;
  const subjectNewRole: projectRole = req.body.subjectNewRole;
  const authuid: string = req.body.authuid;

  const editors: Server.Editors = await db
    .ref(`projectPublic/${uuid}/editors`)
    .once("value")
    .then((snapshot) => snapshot.val());

  const result = await tryAction(
    uuid,
    editors,
    username,
    subjectNewRole,
    authuid
  );
  res.status(result.status).send(result.value);
};
