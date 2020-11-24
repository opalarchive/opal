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
import { getNotifications, markAllNotifications, withFirebase } from '../Firebase';
import TopBar from './TopBar';

class ProjectView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifsLoading: true,
      notifications: [],
      title: null
    };

    this.setNotifications = this.setNotifications.bind(this);
    this.markNotifications = this.markNotifications.bind(this);
    this.setTitle = this.setTitle.bind(this);
  }

  async setNotifications() {
    let notifications = await getNotifications(this.props.authUser.uid);
    this.setState({ notifications, notifsLoading: false });
  }

  async markNotifications(number) {
    this.setState({ notifsLoading: true });
    await markAllNotifications(this.props.authUser.uid, number);
    this.setNotifications();
  }

  setTitle(title) {
    this.setState({ title });
  }

  render() {
    return (
      <div>
        <div style={{ position: "relative", height: "100vh", display: "flex", flexDirection: "column" }}>
          <TopBar notifs={this.state.notifications} loading={this.state.notifsLoading} markNotifications={this.markNotifications} title={this.state.title} />
          <div style={{ position: "relative", flexGrow: 1, overflow: "hidden" }}>
            <Switch>
              <Route
                exact
                path={ROUTES.PROJECT_VIEW}
                render={() =>
                  <Project
                    authUser={this.props.authUser}
                    setNotifications={this.setNotifications}
                    setTitle={this.setTitle}
                  />
                }
              />
              <Route
                render={() =>
                  <Selection
                    authUser={this.props.authUser}
                    setNotifications={this.setNotifications}
                    setTitle={this.setTitle}
                  />
                }
              />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withFirebase,
  withRouter,
)(ProjectView);