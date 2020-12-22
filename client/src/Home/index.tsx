import React from 'react';
import logo from '../logo.svg';
import styles from './index.module.css';

class Home extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div className={styles.home}>
        <header className={styles.homeHeader}>
          <img src={logo} className={styles.homeLogo} alt="logo" />
          Math Olympiad Yada Yada Yada
        </header>
      </div>
    );
  }
}

export default Home;
