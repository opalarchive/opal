import React from 'react';
import styles from './index.module.css';

import * as ROUTES from '../Constants/routes';

import {
  Route,
  Link
} from "react-router-dom";

import Project from './Project';
import Sidebar from './Selection/Sidebar';
import Priority from './Selection/Priority';

function App() {
  let width = 15;
  return (
    <div>
      <Route exact path={ROUTES.PROJECT_VIEW} component={Project} />
      <div>
        <Sidebar width={width} />
        <div style={{ marginLeft: `${width}rem`, height: "100vh", padding: "1rem", backgroundColor: "rgb(245, 246, 250)" }}>
          <Route exact path={ROUTES.PROJECT} component={Priority} />
          <Route exact path={ROUTES.PROJECT_PRIORITY} component={Priority} />
        </div>
      </div>
    </div>
  );
}

export default App;
