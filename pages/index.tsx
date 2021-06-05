import styles from "../styles/Home.module.css";
import { Response } from "../utils/types";

const login = () => {
  fetch(`/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "naman12",
      password: "amolrama",
    }),
  });
  console.log("[login]");
};

const logout = () => {
  fetch(`/api/logout`, {
    method: "POST",
  });
  console.log("[logout]");
};

const ping = () => {
  fetch(`/api/ping`).then(async (res) =>
    console.log("->", (JSON.parse(await res.text()) as Response<string>).value)
  );
};

const Home: React.FC<{}> = ({}) => {
  return (
    <div className={styles.container}>
      Home Page
      <button onClick={login}>login</button>
      <button onClick={logout}>logout</button>
      <button onClick={ping}>ping</button>
    </div>
  );
};

export default Home;
