import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ConfigData } from "../../../models/ProjectConfig";
import { UUID } from "../../../utils/constants";

interface ProjectLoginProps {}

const ProjectLogin: React.FC<ProjectLoginProps> = ({}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          firebase
            .app("opal")
            .auth()
            .signInWithEmailAndPassword(
              "onlineproblemarchivallocation@gmail.com",
              password
            )
            .catch((err) => {
              if (err.code === "auth/wrong-password") {
                setError("Wrong password.");
              }
            });
        }}
      >
        Project not logged in. <br />
        Enter your project password:{" "}
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <br />
        {!!error && <span style={{ color: "red" }}>{error}</span>}
      </form>
    </div>
  );
};

interface ProjectPortalProps {
  fbUser: firebase.User;
}

const increment = (uid: string, setCount: Dispatch<SetStateAction<number>>) => {
  setCount((count) => {
    const db = firebase.app("opal").database();

    db.ref(`${uid}/count`).set(count + 1);
    return count + 1;
  });
};

const ProjectPortal: React.FC<ProjectPortalProps> = ({ fbUser }) => {
  const [loading, setLoading] = useState(true);

  // dummy variable that is in the database
  const [count, setCount] = useState(0);

  useEffect(() => {
    firebase
      .app("opal")
      .database()
      .ref(`${fbUser.uid}/count`)
      .once("value")
      .then((snapshot) => snapshot.val())
      .then((count) => {
        if (!!count && typeof count === "number") {
          setCount(count);
        }
      })
      .then(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Project loading...</div>;
  }

  return (
    <div>
      Successfully connected to firebase
      <br />
      Count: {count}{" "}
      <button onClick={() => increment(fbUser.uid as string, setCount)}>
        ++
      </button>
    </div>
  );
};

interface ProjectGatewayProps {
  projectConfig: ConfigData;
}

const ProjectGateway: React.FC<ProjectGatewayProps> = ({ projectConfig }) => {
  const [loading, setLoading] = useState(true);
  const [fbUser, setfbUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const appNames = firebase.apps.map((app) => app.name);

    if (!appNames.includes("opal")) {
      firebase.initializeApp(projectConfig, "opal");
    }

    firebase
      .app("opal")
      .auth()
      .onAuthStateChanged((user) => {
        setfbUser(user);
        setLoading(false);
      });
  }, [projectConfig]);

  if (loading) {
    return <div>Project loading...</div>;
  }

  if (!!fbUser) {
    return <ProjectPortal fbUser={fbUser} />;
  }
  return <ProjectLogin />;
};

export default ProjectGateway;
