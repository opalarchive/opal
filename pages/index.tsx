import Link from "next/link";
import styles from "../styles/index.module.css";

const Home: React.FC<{}> = ({}) => {
  return (
    <div className={styles.container}>
      Home Page
      <div className={styles.linkContainer}>
        <div>
          <Link href="/signup">Signup</Link> (redirects to /project if you're
          logged in already)
        </div>
        <div>
          <Link href="/login">Login</Link> (redirects to /project if you're
          logged in already)
        </div>
        <div>
          <Link href="/project">Project</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
