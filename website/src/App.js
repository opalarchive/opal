import React from 'react';
import logo from './logo.svg';
import styles from './App.module.css';

import * as ROUTES from './Constants/routes';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './Home';
import SignUp from './SignUp';
import ProjectView from './ProjectView';
import Project from './ProjectView/Project';

import AuthProvider from './Providers/AuthProvider.js';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path={ROUTES.CUSTOM_HOME} component={Home} />
          <Route exact path={ROUTES.HOME} component={Home} />
          <Route exact path={ROUTES.SIGNUP} component={SignUp} />
          <Route path={ROUTES.PROJECT_VIEW}>
            <Route exact path={ROUTES.PROJECT_VIEW} component={ProjectView} />
            <Route exact path={ROUTES.PROJECT} component={Project} />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
