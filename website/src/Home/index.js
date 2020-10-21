import React from 'react';
import logo from '../logo.svg';
import styles from './index.module.css';

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <img src={logo}  className={styles.appLogo} alt="logo" />
        Math Olympiad Yada Yada Yada
      </header>
    </div>
  );
}

export default App;
