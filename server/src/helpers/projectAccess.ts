import { Server } from "../../../.shared/src/types";
import { db } from "./firebaseSetup";
import { Result } from "./types";

export const projectAccess = async (
  uuid: string,
  authuid: string
): Promise<Result<string>> => {
  const projectPublic: Server.ProjectPublic | null = await db
    .ref(`projectPublic/${uuid}`)
    .once("value")
    .then((snapshot) => snapshot.val());

  if (!projectPublic) {
    // it doesn't exist
    return { status: 404, value: "does-not-exist" };
  }

  if (!projectPublic.editors[authuid]) {
    // you can't access it
    return { status: 403, value: "forbidden" };
  }

  if (projectPublic.trashed) {
    // trashed
    return { status: 403, value: "trashed" };
  }

  return { status: 200, value: "permitted" };
};
