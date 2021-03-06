import React from "react";

import * as ROUTES from "../../Constants/routes";

import { Route } from "react-router-dom";

import Sidebar from "./Sidebar";
import Loading from "../../Loading";
import Table from "./Table";
import { getVisibleProjects } from "../../Firebase";
import ScrollBase from "../Template/ScrollBase";
import { poll, projectViewTypes } from "../../Constants";
import { Client } from "../../../../.shared";
import {
  ProjectViewSort,
  ProjectDataPoint,
  ProjectViewType,
  ProjectViewFilter,
} from "../../Constants/types";
import SidebaredBase from "../Template/SidebaredBase";
import { NotificationsProps } from "../Template/Notifications";
import SelectionAppbar from "./SelectionAppbar";

interface SelectionBaseProps {
  refreshProjects: () => Promise<void>;
  type: ProjectViewType;
  visibleProjects: Client.Publico;
  authUser: firebase.User;
}

class SelectionBase extends React.Component<SelectionBaseProps> {
  private projects: Client.Publico = {};
  private data: ProjectDataPoint[] = [];
  private fixed: boolean = false; // whether we can't sort (i.e. fixed => no sorting)
  private defaultSort: ProjectViewSort = {
    dataPoint: "name",
    direction: "asc",
  };

  resetProjects() {
    let projectsKeys = Object.keys(this.props.visibleProjects).filter((id) =>
      this.isIncludable(
        this.props.visibleProjects[id],
        projectViewTypes[this.props.type].filter
      )
    );

    if (projectsKeys.length > 0) {
      let projects = Object.fromEntries(
        projectsKeys.map((id) => [id, this.props.visibleProjects[id]])
      );
      this.projects = projects;
    } else {
      this.projects = {};
    }

    this.data = projectViewTypes[this.props.type].data;
    this.fixed = projectViewTypes[this.props.type].fixed;
    this.defaultSort = projectViewTypes[this.props.type].defaultSort;
  }

  isIncludable(project: Client.ProjectPublic, filter: ProjectViewFilter) {
    if (project.trashed) {
      return filter.includeTrash;
    }
    if (project.starred && filter.includeAllStarred) {
      return true;
    }
    if (project.owner === this.props.authUser.displayName) {
      if (filter.includeMine) {
        return true;
      }
    } else if (
      Object.keys(project.editors).includes(this.props.authUser.displayName!) &&
      filter.includeShared
    ) {
      return true;
    }
    return false;
  }

  render() {
    this.resetProjects();
    return (
      <Table
        projects={this.projects}
        data={this.data}
        fixed={this.fixed}
        defaultSort={this.defaultSort}
        authUser={this.props.authUser}
        name={this.props.type}
        refreshProjects={this.props.refreshProjects}
      />
    );
  }
}

interface SelectionProps extends NotificationsProps {
  authUser: firebase.User;
  setNotifications: () => Promise<void>;
  fail: () => void;
}

interface SelectionState {
  visibleProjects: Client.Publico;
  loading: boolean;
}

class Selection extends React.Component<SelectionProps, SelectionState> {
  state = {
    visibleProjects: {} as Client.Publico,
    loading: true,
  };

  private interval: number = -1;

  constructor(props: SelectionProps) {
    super(props);

    this.setProjects = this.setProjects.bind(this);
  }

  async setProjects() {
    try {
      const visibleProjects = await getVisibleProjects(this.props.authUser);
      if (visibleProjects.success) {
        this.setState({
          visibleProjects: visibleProjects.value,
          loading: false,
        });
      }
    } catch (e) {
      return e;
    }
  }

  async componentDidMount() {
    try {
      await poll(this.setProjects, () => !this.state.loading, 1500, 200);

      this.interval = window.setInterval(() => {
        this.setProjects();
      }, 30000);
    } catch (e) {
      this.props.fail();
    }
  }

  componentWillUnmount() {
    if (this.interval !== -1) {
      window.clearInterval(this.interval);
    }
  }

  render() {
    if (this.state.loading) {
      return <Loading background="white" />;
    }
    return (
      <>
        <SelectionAppbar
          notifs={this.props.notifs}
          notifsLoading={this.props.notifsLoading}
          markNotifications={this.props.markNotifications}
          title={"Project Selection"}
        />
        <div style={{ position: "relative", flexGrow: 1, overflow: "hidden" }}>
          <ScrollBase maxWidth={1320} background="rgb(0, 0, 0, 0.025)">
            <SidebaredBase
              sidebarWidth={15}
              Sidebar={Sidebar}
              fixedSidebar
              authUser={this.props.authUser}
            >
              <Route
                exact
                path={ROUTES.PROJECT}
                render={() => (
                  <SelectionBase
                    refreshProjects={this.setProjects}
                    type="priority"
                    visibleProjects={this.state.visibleProjects}
                    authUser={this.props.authUser}
                  />
                )}
              />
              <Route
                exact
                path={ROUTES.SELECTION_PRIORITY}
                render={() => (
                  <SelectionBase
                    refreshProjects={this.setProjects}
                    type="priority"
                    visibleProjects={this.state.visibleProjects}
                    authUser={this.props.authUser}
                  />
                )}
              />
              <Route
                exact
                path={ROUTES.SELECTION_MY_PROJECTS}
                render={() => (
                  <SelectionBase
                    refreshProjects={this.setProjects}
                    type="myProjects"
                    visibleProjects={this.state.visibleProjects}
                    authUser={this.props.authUser}
                  />
                )}
              />
              <Route
                exact
                path={ROUTES.SELECTION_SHARED_WITH_ME}
                render={() => (
                  <SelectionBase
                    refreshProjects={this.setProjects}
                    type="sharedWithMe"
                    visibleProjects={this.state.visibleProjects}
                    authUser={this.props.authUser}
                  />
                )}
              />
              <Route
                exact
                path={ROUTES.SELECTION_RECENT}
                render={() => (
                  <SelectionBase
                    refreshProjects={this.setProjects}
                    type="recent"
                    visibleProjects={this.state.visibleProjects}
                    authUser={this.props.authUser}
                  />
                )}
              />
              <Route
                exact
                path={ROUTES.SELECTION_TRASH}
                render={() => (
                  <SelectionBase
                    refreshProjects={this.setProjects}
                    type="trash"
                    visibleProjects={this.state.visibleProjects}
                    authUser={this.props.authUser}
                  />
                )}
              />
            </SidebaredBase>
          </ScrollBase>
        </div>
      </>
    );
  }
}

export default Selection;
