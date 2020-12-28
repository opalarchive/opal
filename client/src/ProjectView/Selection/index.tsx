import React from "react";

import * as ROUTES from "../../Constants/routes";

import { Route } from "react-router-dom";

import Sidebar from "./Sidebar";
import Loading from "../../Loading";
import Table from "./Table";
import { getVisibleProjects } from "../../Firebase";
import MenuBase from "../MenuBase";
import { poll, projectViewTypes } from "../../Constants";
import { Client } from "../../../../.shared";
import {
  ProjectViewSort,
  ProjectDataPoint,
  ProjectViewType,
  Result,
  ProjectViewFilter,
} from "../../Constants/types";

interface SelectionBaseProps {
  refreshProjects: () => Promise<void>;
  type: ProjectViewType;
  visibleProjects: Client.Publico;
  authUser: firebase.User;
}

interface SelectionBaseState {
  projects: Client.Publico;
  data: ProjectDataPoint[];
  fixed: boolean;
  defaultSort: ProjectViewSort;
  loading: boolean;
}

class SelectionBase extends React.Component<
  SelectionBaseProps,
  SelectionBaseState
> {
  state = {
    projects: {} as Client.Publico,
    data: [] as ProjectDataPoint[],
    fixed: false, // whether we can't sort (i.e. fixed => no sorting)
    defaultSort: {} as ProjectViewSort,
    loading: true,
  };

  componentDidMount() {
    let projectsKeys = Object.keys(this.props.visibleProjects).filter((id) =>
      this.isIncludable(
        this.props.visibleProjects[id],
        projectViewTypes[this.props.type].filter
      )
    );

    if (projectsKeys && projectsKeys[0]) {
      let projects = Object.fromEntries(
        projectsKeys.map((id) => [id, this.props.visibleProjects[id]])
      );
      let data = projectViewTypes[this.props.type].data;
      let fixed = projectViewTypes[this.props.type].fixed;
      let defaultSort = projectViewTypes[this.props.type].defaultSort;

      this.setState({ projects, data, fixed, defaultSort, loading: false });
    }
    this.setState({ loading: false });
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
    if (this.state.loading) return <div></div>;

    return (
      <Table
        projects={this.state.projects}
        data={this.state.data}
        fixed={this.state.fixed}
        defaultSort={this.state.defaultSort}
        authUser={this.props.authUser}
        name={this.props.type}
        refreshProjects={this.props.refreshProjects}
      />
    );
  }
}

interface SelectionProps {
  authUser: firebase.User;
  setNotifications: () => Promise<void>;
  setTitle: (title: string) => void;
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
    this.props.setTitle("Project Selection");

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
      <MenuBase
        width={15}
        background="rgb(0, 0, 0, 0.025)"
        Sidebar={Sidebar}
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
          path={ROUTES.PROJECT_PRIORITY}
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
          path={ROUTES.PROJECT_MY_PROJECTS}
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
          path={ROUTES.PROJECT_SHARED_WITH_ME}
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
          path={ROUTES.PROJECT_RECENT}
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
          path={ROUTES.PROJECT_TRASH}
          render={() => (
            <SelectionBase
              refreshProjects={this.setProjects}
              type="trash"
              visibleProjects={this.state.visibleProjects}
              authUser={this.props.authUser}
            />
          )}
        />
      </MenuBase>
    );
  }
}

export default Selection;
