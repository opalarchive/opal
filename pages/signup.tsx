import { GetServerSideProps } from "next";
import { NextRouter, useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import styles from "../styles/login.module.css";
import { useAuth } from "../utils/jwt";
import { post } from "../utils/restClient";

interface Signup {}

const signup = async (
  email: string,
  username: string,
  password: string,
  router: NextRouter,
  setError: Dispatch<SetStateAction<string>>
) => {
  const response = await post<string>("createUser", {
    email,
    username,
    password,
  });

  if (!response.success) {
    setError(response.value);
  } else {
    router.push("/project");
  }
};

const Signup: React.FC<Signup> = ({}) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className={styles.container}>
      Signup!
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signup(email, username, password, router, setError);
        }}
      >
        <div>
          Email:{" "}
          <input
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
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
          <button type="submit">Signup</button>
        </div>
      </form>
      {!!error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default Signup;

export const getServerSideProps: GetServerSideProps<Signup> = async ({
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
