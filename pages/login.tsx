import { GetServerSideProps } from "next";
import { NextRouter, useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import styles from "../styles/login.module.css";
import { useAuth } from "../utils/jwt";
import { post } from "../utils/restClient";

interface LoginProps {}

const login = async (
  username: string,
  password: string,
  router: NextRouter,
  setError: Dispatch<SetStateAction<string>>
) => {
  const response = await post<string>("login", { username, password });

  if (!response.success) {
    setError(response.value);
  } else {
    router.push("/project");
  }
};

const Login: React.FC<LoginProps> = ({}) => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className={styles.container}>
      Login!
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login(username, password, router, setError);
        }}
      >
        <div>
          Username:{" "}
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
        <div>
          Password:{" "}
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
      {!!error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps<LoginProps> = async ({
  req,
  res,
}) => {
  const user = await useAuth(req, res);

  if (!!user) {
    return {
      redirect: {
        destination: "/project",
        permanent: false,
      },
    };
  }

  return { props: {} };
};
