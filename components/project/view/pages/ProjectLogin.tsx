import { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";

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

export default ProjectLogin;
