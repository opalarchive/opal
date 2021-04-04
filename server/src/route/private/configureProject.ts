import * as firebase from "firebase-admin";
import { isConfig, ProjectRole, Server } from "../../../../.shared/src";
import { db } from "../../helpers/firebaseSetup";

export const execute = async (req, res) => {
  const uuid: string = req.body.uuid;
  const config: object = req.body.config;
  const authuid: string = req.body.authuid;

  if (!isConfig(config)) {
    res.status(400).send("invalid-config");
  } else {
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

    config.private_key = config.private_key.replace(/\\n/g, "\n");

    const { databaseURL, ...normalConfig } = config;

    // check if the config fails
    try {
      const configuredApp = firebase.initializeApp(
        {
          credential: firebase.credential.cert(
            normalConfig as firebase.ServiceAccount
          ),
          databaseURL,
        },
        uuid
      );

      // this try is for if the config works (so an app is created)
      // but the db url is bad, so it crashes on the next line
      // we want to delete the app if this happens
      try {
        const configureddb = configuredApp.database();

        await configureddb.ref(`/`).set({
          settings: {
            categoryColors: {
              Algebra: { r: 241, g: 37, b: 30 },
              Geometry: { r: 35, g: 141, b: 25 },
              Combinatorics: { r: 21, g: 52, b: 224 },
              "Number Theory": { r: 173, g: 19, b: 179 },
              Miscellaneous: { r: 100, g: 100, b: 110 },
            },
            difficultyColors: {
              0: { r: 0, g: 200, b: 100 },
              25: { r: 0, g: 200, b: 255 },
              50: { r: 150, g: 50, b: 255 },
              51: { r: 255, g: 150, b: 0 },
              75: { r: 255, g: 0, b: 0 },
              100: { r: 0, g: 0, b: 0 },
            },
            difficultyRange: { start: 0, end: 100 },
          },
        });
        await db.ref(`/projectConfigs/${uuid}`).set(config);

        res.status(200).send("success");
        return;
      } catch (e) {
        console.log(uuid, "bad db url");
        configuredApp.delete();
        res.status(400).send("invalid-config");
        return;
      }
    } catch (e) {
      console.log(uuid, "bad config");
      res.status(400).send("invalid-config");
      return;
    }
  }
};
