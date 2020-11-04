import React from 'react';

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
  let width = 15;
  return (
    <Switch>
      <Route exact path={ROUTES.PROJECT_VIEW} render={() => <Project authUser={props.authUser} />} />
      <Route render={() => <Selection authUser={props.authUser} />} />
    </Switch>
  );
}

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withFirebase,
  withRouter,
)(ProjectView);