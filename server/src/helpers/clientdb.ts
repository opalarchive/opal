import { db } from "./firebaseSetup";
import * as firebase from "firebase-admin";
import { projectAccess } from "./projectAccess";
import { Result } from "./types";
import { Config } from "../../../.shared/src/types";

export const clientdb = async (
  uuid: string,
  authuid: string
): Promise<Result<string | firebase.database.Database>> => {
  const tryAccess = await projectAccess(uuid, authuid);
  if (tryAccess.status !== 200) {
    return tryAccess;
  }

  const existingApps = firebase.apps.map((app) => (!!app ? app.name : null));
  let privatedb;

  // we don't want to create a new app each time
  if (existingApps.includes(uuid)) {
    privatedb = firebase.app(uuid).database();
  } else {
    let config: Config | null = await db
      .ref(`/projectConfigs/${uuid}`)
      .once("value")
      .then((snapshot) => snapshot.val());

    if (!config) {
      return { status: 200, value: "unconfigured" };
    }
    config.private_key = config.private_key.replace(/\\n/g, "\n");

    const { databaseURL, ...normalConfig } = config;

    privatedb = firebase
      .initializeApp(
        {
          credential: firebase.credential.cert(
            normalConfig as firebase.ServiceAccount
          ),
          databaseURL,
        },
        uuid
      )
      .database();
  }

  return { status: 200, value: privatedb };
};
