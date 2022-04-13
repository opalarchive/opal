import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import Configure from "../components/project/view/pages/Configure";
import { isUUID, UUID } from "./constants";
import { ProjectViewProps, ProjectViewPropsRaw } from "./getProjectViewProps";
import ProjectLogin from "../components/project/view/pages/ProjectLogin";
import { isProject, Project, ProjectViewPage } from "./types";
import Page404 from "../pages/404";
import ProjectCorrupted from "../components/project/view/pages/ProjectCorrupted";
import EmailUnverified from "../components/project/view/pages/EmailUnverified";
import NoProjectAccess from "../components/project/view/pages/NoProjectAccess";
import ProjectLoading from "../components/project/view/pages/ProjectLoading";
import NotLoggedIn from "../components/project/view/pages/NotLoggedIn";
import { Box, Flex } from "@chakra-ui/react";
import Navbar from "../components/project/view/bars/Navbar";

const ProjectViewWrapper: FC<
  {
    projectViewPage: ProjectViewPage;
    Component: FC<ProjectViewProps>;
  } & ProjectViewPropsRaw
> = ({
  projectViewPage,
  Component,
  uuid,
  user,
  emailVerified,
  exists,
  name,
  owner,
  projectConfig,
}) => {
  const [time, setTime] = useState(Date.now());
  const [height, setHeight] = useState(0);

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
    console.log("projectConfig changed", projectConfig);
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
  }, [JSON.stringify(projectConfig)]); // we want to check if the actual data changed, not the reference to the object

  useEffect(() => {
    if (!!fbUser) {
      const db = firebase.app("opal").database();
      printTime("Connect to database");
      setdb(db);
      db.ref(`${fbUser.uid}`)
        .once("value")
        .then((snapshot) => snapshot.val())
        .then((val) => {
          setValidProject(isProject(val));
          setdbStatus(val);
          printTime("Load and validate database data");
        })
        .then(() => setSetupDone(true));
    } else {
      setdb(null);
      setdbStatus({});
      setSetupDone(false);
    }
  }, [fbUser]);

  useEffect(() => {
    const resetHeight = () => {
      setHeight(window.innerHeight);
    };
    resetHeight();
    window.addEventListener("resize", resetHeight);

    return () => {
      window.removeEventListener("resize", resetHeight);
    };
  }, []);

  const dbEdit = useMemo(() => {
    return (path: string, value: object | string | number) => {
      if (!!fbUser && setupDone && !!db && validProject) {
        setdbStatus((status) => {
          path = path.replace("\\", "/");
          const k = path.split("/");

          // TODO: This is certainly not optimal, but for the things firebase can store (string or number),
          // we SHOULD be fine. If not, we can switch to just-clone
          //
          // todo is just a friendly reminder :)

          // Deep copy (why this???)
          // let newdbStatus = JSON.parse(JSON.stringify(status));

          // Shallow copy
          let newStatus = { ...status };

          // We gradually narrow the scope each rank of the object tree at a time,
          // and shallow copy all ancestors of the changed node
          // This allows React to properly propagate update for components that need
          // some subtree containing the change, but not update any other components
          //
          // e.g. if we change a problem category, any component using project.problems
          // will rerender, while a component using only project.settings will not
          let scopeNew = newStatus as any;
          let scopeOld = status as any;

          for (let i = 0; i < k.length - 1; i++) {
            if (typeof scopeNew[k[i]] !== "object") {
              throw "Invalid database path edit. The developers must be really bad.";
            }
            if (Array.isArray(scopeOld[k[i]])) {
              scopeNew[k[i]] = [...scopeOld[k[i]]];
            } else {
              scopeNew[k[i]] = { ...scopeOld[k[i]] };
            }
            scopeNew = scopeNew[k[i]];
            scopeOld = scopeOld[k[i]];
          }
          scopeNew[k[k.length - 1]] = value;

          db.ref(fbUser.uid + "/" + path).set(value);
          // console.log(fbUser.uid + "/" + path, value);

          // console.log(newStatus);
          return newStatus;
        });
      }
    };
  }, [fbUser, setupDone, db, validProject]);

  if (!initialLoadDone || (!!fbUser && (!setupDone || !db))) {
    return <ProjectLoading />;
  }

  if (!!fbUser && setupDone && !!db) {
    if (!validProject) {
      return <ProjectCorrupted />;
    }

    return (
      <Flex direction="column" height={height}>
        <Navbar
          projectViewPage={projectViewPage}
          projectName={name}
          uuid={uuid}
        />
        <Box position="relative" flexGrow={1} overflowY="scroll">
          <Component
            user={user}
            emailVerified={emailVerified}
            uuid={uuid}
            name={name}
            owner={owner}
            projectConfig={projectConfig}
            fbUser={fbUser}
            project={dbStatus as Project}
            projectEdit={dbEdit}
          />
        </Box>
      </Flex>
    );
  }
  return <ProjectLogin />;
};

export default ProjectViewWrapper;
