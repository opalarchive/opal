import React from "react";
import Loading from "../Loading";
import logo from "../logo.svg";
import styles from "./index.module.css";

class Home extends React.Component {
  render() {
    return <Loading background="white" hideText={false} />;
  }
}

export default Home;