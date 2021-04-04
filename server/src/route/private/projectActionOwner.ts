import {
  Server,
  UsernameInfo,
  ProjectRole,
  projectActionOwner,
  ProjectActionOwner,
} from "../../../../.shared/src";
import { editProject } from "../../helpers/editProject";
import { db } from "../../helpers/firebaseSetup";
import { pushNotification } from "../../helpers/notification";
import { Result } from "../../helpers/types";

const validateData = (
  type: projectActionOwner,
  data: string
): boolean | null => {
  switch (ProjectActionOwner[type]) {
    case ProjectActionOwner.MAKE_OWNER:
      return !!data;
    default:
      return !!data;
  }
};

const validateDataError = (type: projectActionOwner, data: string): string => {
  switch (ProjectActionOwner[type]) {
    // case ProjectActionOwner.MAKE_OWNER:
    //   return "";
    default:
      return "bad-input";
  }
};

const onSuccess = (
  type: projectActionOwner,
  uuid: string,
  data: string
): string => {
  switch (ProjectActionOwner[type]) {
    case ProjectActionOwner.MAKE_OWNER:
      return `proj-${uuid}-ownership-transfered-to-${data}`;
    default:
      return "bad-input";
  }
};

const tryAction = async (
  uuid: string,
  projectPublic: Server.ProjectPublic,
  data: string,
  type: projectActionOwner,
  uid: string
): Promise<Result<string>> => {
  const now = Date.now();

  let userinfo: UsernameInfo | null = null;
  let sourceUsername: string = "";

  switch (ProjectActionOwner[type]) {
    case ProjectActionOwner.MAKE_OWNER:
      userinfo = await db
        .ref(`users/${data}`)
        .once("value")
        .then((snapshot) => snapshot.val());

      if (!userinfo) {
        return { status: 404, value: "username-does-not-exist" };
      }

      if (
        !projectPublic.editors[userinfo.uid] ||
        ProjectRole[projectPublic.editors[userinfo.uid].role] !==
          ProjectRole.ADMIN
      ) {
        return { status: 403, value: "user-is-not-admin" };
      }

      sourceUsername = await db
        .ref(`userInformation/${uid}/username`)
        .once("value")
        .then((snapshot) => snapshot.val());

      await db
        .ref(`projectPublic/${uuid}/editors/${userinfo.uid}/role`)
        .set("OWNER");
      await db.ref(`projectPublic/${uuid}/owner`).set(userinfo.uid);

      await pushNotification(userinfo.uid, {
        content: `Your role in the project <a href="/project/view/${uuid}">${projectPublic.name}</a> has been changed to owner by ${sourceUsername}.`,
        timestamp: now,
        link: `/project/view/${uuid}`,
        read: false,
        title: `Role Changed!`,
      });

      break;
    default:
      break;
  }

  editProject(uuid, uid, now);
  return { status: 202, value: onSuccess(type, uuid, data) };
};

export const execute = async (req, res) => {
  const data: string = req.body.data;
  const uuid: string = req.body.uuid;
  const authuid: string = req.body.authuid;
  const type: projectActionOwner = req.body.type;

  const projectPublic: Server.ProjectPublic = await db
    .ref(`projectPublic/${uuid}`)
    .once("value")
    .then((snapshot) => snapshot.val());

  if (!projectPublic) {
    // it doesn't exist
    res.status(404).send("project-not-found");
    return;
  }

  if (
    !projectPublic.editors[authuid] ||
    authuid !== projectPublic.owner ||
    ProjectRole[projectPublic.editors[authuid].role] !== ProjectRole.OWNER
  ) {
    // you're not owner
    res.status(403).send("forbidden");
    return;
  }

  if (projectPublic.trashed) {
    res.status(403).send("project-trashed");
    return;
  }

  if (!validateData(type, data)) {
    res.status(400).send(validateDataError(type, data));
    return;
  }

  const result: Result<string> = await tryAction(
    uuid,
    projectPublic,
    data,
    type,
    authuid
  );
  res.status(result.status).send(result.value);
};
