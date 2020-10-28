import React from 'react';
import styles from './index.module.css';

import * as ROUTES from '../Constants/routes';

import {
  Route,
  Switch,
  withRouter
} from "react-router-dom";

import Project from './Project';
import Selection from './Selection';
import { AuthUserContext, withAuthorization } from '../Session';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';

function App() {
  let width = 15;
  return (
    <Switch>
      <Route exact path={ROUTES.PROJECT_VIEW} component={Project} authUser={this.props.authUser} />
      <Route component={Selection} authUser={this.props.authUser} />
    </Switch>
  );
}

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withFirebase,
  withRouter,
)(Selection);