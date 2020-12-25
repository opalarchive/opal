import React from "react";

import * as ROUTES from "../Constants/routes";

import { Route, Switch } from "react-router-dom";

import Project from "./Project";
import Selection from "./Selection";
import { withAuthorization } from "../Session";
import { getNotifications, markAllNotifications } from "../Firebase";
import TopBar from "./TopBar";
import { poll } from "../Constants";
import Fail from "../Fail";
import { WithAuthorization } from "../Session/withAuthorization";
import { Notification } from "../../../.shared";
import { Result } from "../Constants/types";

interface ProjectViewProps extends WithAuthorization {}
interface ProjectViewState {
  notifsLoading: boolean;
  notifications: Result<Notification[]>;
  title: string;
  fail: boolean;
}

class ProjectView extends React.Component<ProjectViewProps, ProjectViewState> {
  state = {
    notifsLoading: true,
    notifications: {
      success: true,
      value: [],
    } as Result<Notification[]>,
    title: "",
    fail: false,
  };

  private interval: number = -1;

  constructor(props: ProjectViewProps) {
    super(props);

    this.setNotifications = this.setNotifications.bind(this);
    this.markNotifications = this.markNotifications.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.fail = this.fail.bind(this);
  }

  async setNotifications(): Promise<void> {
    try {
      let notifications = await getNotifications(this.props.authUser);
      if (notifications.success) {
        this.setState({
          notifications,
          notifsLoading: false,
        });
      } else {
        this.setState({ notifications });
      }
    } catch (e) {
      return e;
    }
  }

  async markNotifications(number: number) {
    await markAllNotifications(this.props.authUser, number);
    this.setNotifications();
  }

  setTitle(title: string) {
    this.setState({ title });
  }

  fail() {
    this.setState({ fail: true });
  }

  async componentDidMount() {
    try {
      await poll(
        this.setNotifications,
        () => !this.state.notifsLoading,
        1500,
        200
      );
      this.interval = window.setInterval(() => {
        this.setNotifications();
      }, 30000);
    } catch (e) {
      this.fail();
    }
  }

  componentWillUnmount() {
    if (this.interval !== -1) {
      window.clearInterval(this.interval);
    }
  }

  render() {
    if (this.state.fail) {
      return <Fail />;
    }

    return (
      <div>
        <div
          style={{
            position: "relative",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TopBar
            notifs={this.state.notifications}
            loading={this.state.notifsLoading}
            markNotifications={this.markNotifications}
            title={this.state.title}
          />
          <div
            style={{ position: "relative", flexGrow: 1, overflow: "hidden" }}
          >
            <Switch>
              <Route
                path={ROUTES.PROJECT_VIEW}
                render={() => (
                  <Project
                    authUser={this.props.authUser}
                    setNotifications={this.setNotifications}
                    setTitle={this.setTitle}
                    fail={this.fail}
                  />
                )}
              />
              <Route
                render={() => (
                  <Selection
                    authUser={this.props.authUser}
                    setNotifications={this.setNotifications}
                    setTitle={this.setTitle}
                    fail={this.fail}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default withAuthorization()(ProjectView);
