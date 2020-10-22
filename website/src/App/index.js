import React from 'react';
import styles from './index.module.css';

import * as ROUTES from '../Constants/routes';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from '../Home';
import SignUp from '../SignUp';
import Project from '../ProjectView';

import AuthProvider from '../Providers/AuthProvider.js';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AuthProvider>
        <link type="text/css" rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
        <Router>
          <Switch>
            <Route exact path={ROUTES.CUSTOM_HOME} component={Home} />
            <Route exact path={ROUTES.HOME} component={Home} />
            <Route exact path={ROUTES.SIGNUP} component={SignUp} />
            <Route path={ROUTES.PROJECT} component={Project} />
          </Switch>
        </Router>
      </AuthProvider>
    );
  }
}

export default App;
