import { db } from "./firebaseSetup";

export const editProject = async (uuid: string, uid: string, now?: number) => {
  await db
    .ref(`projectPublic/${uuid}/editors/${uid}/lastEdit`)
    .set(!!now ? now : Date.now());
};
