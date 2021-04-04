import {
  ProjectActionAdmin,
  projectActionAdmin,
  Server,
  UsernameInfo,
  ProjectRole,
} from "../../../../.shared/src";
import { editProject } from "../../helpers/editProject";
import { sendEmail } from "../../helpers/emailSetup";
import { db } from "../../helpers/firebaseSetup";
import { pushNotification } from "../../helpers/notification";
import { Result } from "../../helpers/types";

const validateData = (
  type: projectActionAdmin,
  data: string
): boolean | null => {
  switch (ProjectActionAdmin[type]) {
    case ProjectActionAdmin.CHANGE_NAME:
      return data.match(/^[ A-Za-z0-9]+$/g) && data.length <= 32;
    case ProjectActionAdmin.DELETE:
      return true; // delete doesn't need data
    case ProjectActionAdmin.RESTORE:
      return true; // see above
    case ProjectActionAdmin.SHARE:
      return !!data;
    case ProjectActionAdmin.UNSHARE:
      return !!data;
    case ProjectActionAdmin.PROMOTE:
      return !!data;
    case ProjectActionAdmin.DEMOTE:
      return !!data;
    default:
      return !!data;
  }
};

const validateDataError = (type: projectActionAdmin, data: string): string => {
  switch (ProjectActionAdmin[type]) {
    case ProjectActionAdmin.CHANGE_NAME:
      return "bad-project-name";
    // case ProjectActionProtected.DELETE:
    //   return "";
    // case ProjectActionProtected.RESTORE:
    //   return "";
    // case ProjectActionProtected.SHARE:
    //   return "";
    // case ProjectActionProtected.PROMOTE:
    //   return "";
    // case ProjectActionProtected.DEMOTE:
    //   return "";
    default:
      return "bad-input";
  }
};

const onSuccess = (
  type: projectActionAdmin,
  uuid: string,
  data: string
): string => {
  switch (ProjectActionAdmin[type]) {
    case ProjectActionAdmin.CHANGE_NAME:
      return `proj-${uuid}-name-changed-to-${data}`;
    case ProjectActionAdmin.DELETE:
      return `proj-${uuid}-deleted`;
    case ProjectActionAdmin.RESTORE:
      return `proj-${uuid}-restored`;
    case ProjectActionAdmin.SHARE:
      return `proj-${uuid}-shared-with-${data}`;
    case ProjectActionAdmin.UNSHARE:
      return `proj-${uuid}-unshared-with-${data}`;
    case ProjectActionAdmin.PROMOTE:
      return `proj-${uuid}-promoted-${data}`;
    case ProjectActionAdmin.DEMOTE:
      return `proj-${uuid}-demoted-${data}`;
    default:
      return "bad-input";
  }
};

const tryAction = async (
  uuid: string,
  projectPublic: Server.ProjectPublic,
  data: string,
  type: projectActionAdmin,
  uid: string
): Promise<Result<string>> => {
  const now = Date.now();

  let userinfo: UsernameInfo | null = null;
  let sourceUsername: string = "";

  switch (ProjectActionAdmin[type]) {
    case ProjectActionAdmin.CHANGE_NAME:
      await db.ref(`projectPublic/${uuid}/name`).set(data);
      break;
    case ProjectActionAdmin.DELETE:
      await db.ref(`projectPublic/${uuid}/trashed`).set(true);

      sourceUsername = await db
        .ref(`userInformation/${uid}/username`)
        .once("value")
        .then((snapshot) => snapshot.val());

      await Promise.all(
        Object.keys(projectPublic.editors).map((editor) =>
          pushNotification(editor, {
            content: `${sourceUsername} has deleted <a href="/project/view/${uuid}">${projectPublic.name}</a>! This project will now only be view-only until the owner chooses to restore it.`,
            timestamp: now,
            link: `/project/view/${uuid}`,
            read: false,
            title: `Project Deleted!`,
          })
        )
      );
      break;
    case ProjectActionAdmin.RESTORE:
      await db.ref(`projectPublic/${uuid}/trashed`).set(false);
      break;
    case ProjectActionAdmin.SHARE:
      userinfo = await db
        .ref(`users/${data}`)
        .once("value")
        .then((snapshot) => snapshot.val());

      if (!userinfo) {
        return { status: 404, value: "username-does-not-exist" };
      }
      // the enum is (should) be arranged in order of decreasing power
      if (
        !!projectPublic.editors[userinfo.uid] &&
        ProjectRole[projectPublic.editors[userinfo.uid].role] <=
          ProjectRole.EDITOR
      ) {
        return { status: 403, value: "user-is-already-editor" };
      }

      await db.ref(`projectPublic/${uuid}/editors/${userinfo.uid}`).set({
        lastEdit: now,
        shareDate: now,
        role: "EDITOR",
        starred: false,
      });

      sourceUsername = await db
        .ref(`userInformation/${uid}/username`)
        .once("value")
        .then((snapshot) => snapshot.val());

      await sendEmail({
        targetEmail: userinfo.email,
        subject: `${projectPublic.name} was shared with you by ${sourceUsername}, ${data}`,
        content: `Hello ${data},<br /><br />You were invited to <a href="/project/view/${uuid}">${projectPublic.name}</a> by the owner, ${sourceUsername}. We hope you enjoy proposing problems and our system!<br /><br />Sincerely,<br />The OPAL Team`,
      });

      await pushNotification(userinfo.uid, {
        content: `${sourceUsername} has shared <a href="/project/view/${uuid}">${projectPublic.name}</a> with you!`,
        timestamp: now,
        link: `/project/view/${uuid}`,
        read: false,
        title: `New Project Shared!`,
      });

      break;
    case ProjectActionAdmin.UNSHARE:
      userinfo = await db
        .ref(`users/${data}`)
        .once("value")
        .then((snapshot) => snapshot.val());

      if (!userinfo) {
        return { status: 404, value: "username-does-not-exist" };
      }
      if (
        !projectPublic.editors[userinfo.uid] ||
        ProjectRole[projectPublic.editors[userinfo.uid].role] ===
          ProjectRole.REMOVED
      ) {
        return { status: 403, value: "user-is-not-shared" };
      }

      await db
        .ref(`projectPublic/${uuid}/editors/${userinfo.uid}/role`)
        .set("REMOVED");

      // sourceUsername = await db
      //   .ref(`userInformation/${uid}/username`)
      //   .once("value")
      //   .then((snapshot) => snapshot.val());
      //
      // await pushNotification(userinfo.uid, {
      //   content: `${sourceUsername} removed you from the project ${projectPublic.name}.`,
      //   timestamp: now,
      //   link: `/project/view/${uuid}`,
      //   read: false,
      //   title: `Removed from Project!`,
      // });

      break;
    case ProjectActionAdmin.PROMOTE:
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
          ProjectRole.EDITOR
      ) {
        return { status: 403, value: "user-is-not-editor" };
      }

      sourceUsername = await db
        .ref(`userInformation/${uid}/username`)
        .once("value")
        .then((snapshot) => snapshot.val());

      await db
        .ref(`projectPublic/${uuid}/editors/${userinfo.uid}/role`)
        .set("ADMIN");

      await pushNotification(userinfo.uid, {
        content: `Your role in the project <a href="/project/view/${uuid}">${projectPublic.name}</a> has been changed to admin by ${sourceUsername}.`,
        timestamp: now,
        link: `/project/view/${uuid}`,
        read: false,
        title: `Role Changed!`,
      });

      break;
    case ProjectActionAdmin.DEMOTE:
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
        .set("EDITOR");

      await pushNotification(userinfo.uid, {
        content: `Your role in the project <a href="/project/view/${uuid}">${projectPublic.name}</a> has been changed to editor by ${sourceUsername}.`,
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
  const type: projectActionAdmin = req.body.type;

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
    (ProjectRole[projectPublic.editors[authuid].role] !== ProjectRole.ADMIN &&
      ProjectRole[projectPublic.editors[authuid].role] !== ProjectRole.OWNER)
  ) {
    // you're not owner or admin
    res.status(403).send("forbidden");
    return;
  }

  if (
    ProjectActionAdmin[type] !== ProjectActionAdmin.RESTORE &&
    projectPublic.trashed
  ) {
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
