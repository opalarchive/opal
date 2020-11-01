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
import { withAuthorization } from '../Session';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';

const ProjectView = (props) => {
  console.log(props.authUser);
  let width = 15;
  return (
    <Switch>
      <Route exact path={ROUTES.PROJECT_VIEW} component={() => <Project authUser={props.authUser} />} />
      <Route component={() => <Selection authUser={props.authUser} />} />
    </Switch>
  );
}

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withFirebase,
  withRouter,
)(ProjectView);