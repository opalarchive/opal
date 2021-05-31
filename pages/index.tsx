import { useEffect } from "react";
import { siteURL } from "../helpers/constants";
import styles from "../styles/Home.module.css";

const Home: React.FC<{}> = ({}) => {
  useEffect(() => {
    console.log("hello");
    fetch(`/api/public/createUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "amol.rama@icloud.com",
        password: "amolrama",
        username: "naman12",
      }),
    }).then(async (res) => console.log("p", await res.text()));
  }, []);

  return <div className={styles.container}>Home Page</div>;
};

export default Home;
