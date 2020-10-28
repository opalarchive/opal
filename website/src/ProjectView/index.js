import React from 'react';
import styles from './index.module.css';

import * as ROUTES from '../Constants/routes';

import {
  Route,
  Switch
} from "react-router-dom";

import Project from './Project';
import Selection from './Selection';
import { AuthUserContext } from '../Session';

function App() {
  let width = 15;
  return (
    <AuthUserContext.Consumer>
      {authuser =>
        <Switch>
          <Route exact path={ROUTES.PROJECT_VIEW} component={Project} authuser={authuser} />
          <Route component={Selection} authuser={authuser} />
        </Switch>
      }
    </AuthUserContext.Consumer>
  );
}

export default App;
