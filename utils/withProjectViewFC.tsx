import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import Configure from "../components/project/view/pages/Configure";
import { isUUID } from "./constants";
import { ProjectViewProps, ProjectViewPropsRaw } from "./getProjectViewProps";
import ProjectLogin from "../components/project/view/pages/ProjectLogin";
import { isProject, Project } from "./types";
import Page404 from "../pages/404";
import ProjectCorrupted from "../components/project/view/pages/ProjectCorrupted";
import EmailUnverified from "../components/project/view/pages/EmailUnverified";
import NoProjectAccess from "../components/project/view/pages/NoProjectAccess";
import ProjectLoading from "../components/project/view/pages/ProjectLoading";
import NotLoggedIn from "../components/project/view/pages/NotLoggedIn";

const withProjectViewFC: (fc: FC<ProjectViewProps>) => FC<ProjectViewPropsRaw> =

    (Component) =>
    ({ user, emailVerified, exists, name, owner, projectConfig }) => {
      const router = useRouter();
      const { uuid } = router.query;

      const [time, setTime] = useState(Date.now());

      const printTime = (text: string) => {
        setTime((time) => {
          const now = Date.now();
          console.log(`${text}: ${now - time}ms`);
          return now;
        });
      };

      if (!user) {
        return <NotLoggedIn />;
      }
      if (!emailVerified) {
        return <EmailUnverified />;
      }

      if (!exists || !isUUID(uuid)) {
        return <Page404 />;
      }

      // if it exists, but there is no data sent, then you don't have access to it
      if (!name || !owner) {
        return <NoProjectAccess />;
      }

      if (!projectConfig) {
        return <Configure uuid={uuid} user={user} owner={owner} />;
      }

      const [initialLoadDone, setInitialLoadDone] = useState(false);
      const [setupDone, setSetupDone] = useState(false);
      const [fbUser, setfbUser] = useState<firebase.User | null>(null);
      const [dbStatus, setdbStatus] = useState<object>({});
      const [validProject, setValidProject] = useState(false);
      const [db, setdb] = useState<firebase.database.Database | null>(null);

      useEffect(() => {
        const appNames = firebase.apps.map((app) => app.name);

        // TODO: What if the config is invalid here?
        if (!appNames.includes("opal")) {
          firebase.initializeApp(projectConfig, "opal");
        }

        printTime("Initialize app");
        firebase
          .app("opal")
          .auth()
          .onAuthStateChanged((user) => {
            setfbUser(user);
            setInitialLoadDone(true);
            printTime("Load user session");
          });
      }, [projectConfig]);

      useEffect(() => {
        if (!!fbUser) {
          const db = firebase.app("opal").database();
          printTime("Connect to database");
          setdb(db);
          db.ref(`${fbUser.uid}`)
            .once("value")
            .then((snapshot) => snapshot.val())
            .then((val) => {
              setdbStatus(val);
              setValidProject(isProject(val));
              printTime("Load and validate database data");
            })
            .then(() => setSetupDone(true));
        } else {
          setdb(null);
          setdbStatus({});
          setSetupDone(false);
        }
      }, [fbUser]);

      if (!initialLoadDone || (!!fbUser && (!setupDone || !db))) {
        return <ProjectLoading />;
      }

      if (!!fbUser && setupDone && !!db) {
        if (!validProject) {
          return <ProjectCorrupted />;
        }

        /* TODO: Test this */
        const dbEdit = (path: string, value: object | string | number) => {
          setdbStatus((status) => {
            path = path.replace("\\", "/");
            const k = path.split("/");

            let newdbStatus: any = { ...dbStatus };
            let currentNew = newdbStatus;
            let currentOld = dbStatus as any;
            for (let i = 0; i < k.length - 1; i++) {
              currentNew[k[i]] = { ...currentOld[k[i]] };
              currentNew = currentNew[k[i]];
              currentOld = currentOld[k[i]];
            }
            currentNew[k[k.length - 1]] = value;

            db.ref(path).set(value);

            return status;
          });
        };

        return (
          <div>
            This is project {name} with id {uuid}.
            <br />
            <br />
            <Component
              user={user}
              emailVerified={emailVerified}
              name={name}
              owner={owner}
              projectConfig={projectConfig}
              fbUser={fbUser}
              project={dbStatus as Project}
              projectEdit={dbEdit}
            />
          </div>
        );
      }
      return <ProjectLogin />;
    };

export default withProjectViewFC;
