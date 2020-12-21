import { Server, UsernameInfo } from "../../../.shared/src/types";
import { editProject } from "../helpers/editProject";
import { sendEmail } from "../helpers/emailSetup";
import { db } from "../helpers/firebaseSetup";
import { pushNotification } from "../helpers/notification";
import { Result } from "../helpers/types";

const validateData = (type: string, data: string): boolean | null => {
  switch (type) {
    case "changeName":
      return data.match(/^[ A-Za-z0-9]+$/g) && data.length <= 32;
    // case "delete":
    //   return !!data;
    // case "restore":
    //   return !!data;
    // case "share":
    //   return !!data;
    default:
      return !!data;
  }
};

const validateDataError = (type: string, data: string): string => {
  switch (type) {
    case "changeName":
      return "bad-project-name";
    // case "delete":
    //   return "";
    // case "restore":
    //   return "";
    // case "share":
    //   return "";
    default:
      return "bad-input";
  }
};

const onSuccess = (type: string, uuid: string, data: string): string => {
  switch (type) {
    case "changeName":
      return `Project ${uuid}'s name successfully changed to ${data}.`;
    case "delete":
      return `Project ${uuid} successfully deleted.`;
    case "restore":
      return `Project ${uuid} successfully restored.`;
    case "share":
      return `Project ${uuid} successfully shared with ${data}.`;
    default:
      return "bad-input";
  }
};

const tryAction = async (
  uuid: string,
  projectPublic: Server.ProjectPublic,
  data: string,
  type: string,
  uid: string
): Promise<Result<string>> => {
  const now = Date.now();

  switch (type) {
    case "changeName":
      await db.ref(`projectPublic/${uuid}/name`).set(data);
      break;
    case "delete":
      await db.ref(`projectPublic/${uuid}/trashed`).set(true);

      await Promise.all(
        Object.keys(projectPublic.editors).map((editor) =>
          pushNotification(editor, {
            content: `${uid} has deleted <a href="/project/view/${uuid}">${projectPublic.name}</a>! The OPAL project will now only be view-only until the owner chooses to restore it.`,
            timestamp: now,
            link: `/project/view/${uuid}`,
            read: false,
            title: `Project Deleted!`,
          })
        )
      );
      break;
    case "restore":
      await db.ref(`projectPublic/${uuid}/trashed`).set(false);
      break;
    case "share":
      const userinfo: UsernameInfo | null = await db
        .ref(`users/${data}`)
        .once("value")
        .then((snapshot) => snapshot.val());

      if (!userinfo) {
        return { status: 404, value: "username-does-not-exist" };
      }
      if (projectPublic.editors[userinfo.uid]) {
        return { status: 403, value: "user-is-already-editor" };
      }

      await db.ref(`projectPublic/${uuid}/editors/${userinfo.uid}`).set({
        lastEdit: now,
        shareDate: now,
        starred: false,
      });

      const ownerUsername = await db
        .ref(`userInformation/${uid}/username`)
        .once("value")
        .then((snapshot) => snapshot.val());

      await sendEmail({
        targetEmail: userinfo.email,
        subject: `${projectPublic.name} was shared with you by ${ownerUsername}, ${data}`,
        content: `Hello ${data},<br /><br />You were invited to <a href="/project/view/${uuid}">${projectPublic.name}</a> by the owner, ${ownerUsername}. We hope you enjoy proposing problems and our system!<br /><br />Sincerely,<br />The OPAL Team`,
      });

      await pushNotification(userinfo.uid, {
        content: `${ownerUsername} has shared <a href="/project/view/${uuid}">${projectPublic.name}</a> with you!`,
        timestamp: now,
        link: `/project/view/${uuid}`,
        read: false,
        title: `New Project Shared!`,
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
  const type: string = req.body.type;

  const projectPublic: Server.ProjectPublic = await db
    .ref(`projectPublic/${uuid}`)
    .once("value")
    .then((snapshot) => snapshot.val());

  if (!projectPublic) {
    // it doesn't exist
    res.status(404).send("project-not-found");
    return;
  }

  if (projectPublic.owner !== authuid) {
    // you're not the owner
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