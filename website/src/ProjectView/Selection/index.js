import React from "react";

import * as ROUTES from "../../Constants/routes";

import { Route } from "react-router-dom";

import Sidebar from "./Sidebar";
import Loading from "../../Loading";
import Table from "./Table";
import { getVisibleProjects } from "../../Firebase";
import MenuBase from "../MenuBase";
import { poll } from "../../Constants/poll";

class SelectionBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: {},
      data: [],
      fixed: false, // whether we can't sort (i.e. fixed => no sorting)
      defaultSort: {},
      loading: true
    };

    /*
     * + denotes union
     * starred is a subset of my projects + shared
     *
     * priority = my projects + starred, sort by name
     * my projects = my projects, sort by name
     * shared = shared, sort by share date
     * recent = my projects + shared, sort by last modified date (perhaps only by me)
     * trash = my projects trash, sort by trash date (same as last modified date)
     */

    this.categories = {
      priority: {
        includeMine: true,
        includeShared: false,
        includeAllStarred: true,
        includeTrash: false,
        data: ["name", "owner", "lastModified"],
        fixed: false,
        defaultSort: {
          dataPoint: "name",
          direction: "asc"
        }
      },
      myProjects: {
        includeMine: true,
        includeShared: false,
        includeAllStarred: false,
        includeTrash: false,
        data: ["name", "owner", "lastModified"],
        fixed: false,
        defaultSort: {
          dataPoint: "name",
          direction: "asc"
        }
      },
      sharedWithMe: {
        includeMine: false,
        includeShared: true,
        includeAllStarred: false,
        includeTrash: false,
        data: ["name", "owner", "shareDate"], // owner = shared by in this case (unless we allow collaborator sharing?)
        fixed: false, // owner is still better I think
        defaultSort: {
          dataPoint: "shareDate",
          direction: "desc"
        }
      },
      recent: {
        includeMine: true,
        includeShared: true,
        includeAllStarred: false,
        includeTrash: false,
        data: ["name", "owner", "lastModifiedByMe"],
        fixed: true,
        defaultSort: {
          dataPoint: "lastModifiedByMe",
          direction: "desc"
        }
      },
      trash: {
        includeMine: false,
        includeShared: false,
        includeAllStarred: false,
        includeTrash: true, // trash is only trash by me (i.e. only owner can trash)
        data: ["name", "owner", "lastModified"], // last modified = trash date for obvious reasons
        fixed: false, // (disable editing when trashed)
        defaultSort: {
          dataPoint: "lastModified",
          direction: "desc"
        }
      }
    };
  }

  componentDidMount() {
    let projectsKeys = Object.keys(this.props.visibleProjects).filter((id) =>
      this.isIncludable(
        this.props.visibleProjects[id],
        this.categories[this.props.type].includeMine,
        this.categories[this.props.type].includeShared,
        this.categories[this.props.type].includeAllStarred,
        this.categories[this.props.type].includeTrash
      )
    );

    if (projectsKeys && projectsKeys[0]) {
      let projects = Object.fromEntries(
        projectsKeys.map((id) => [id, this.props.visibleProjects[id]])
      );
      let data = this.categories[this.props.type].data;
      let fixed = this.categories[this.props.type].fixed;
      let defaultSort = this.categories[this.props.type].defaultSort;

      this.setState({ projects, data, fixed, defaultSort, loading: false });
    }
    this.setState({ loading: false });
  }

  isIncludable(
    project,
    includeMine,
    includeShared,
    includeAllStarred,
    includeTrash
  ) {
    if (project.trashed) {
      return includeTrash;
    }
    if (
      project.starred &&
      includeAllStarred
    ) {
      return true;
    }
    if (project.owner === this.props.authUser.displayName) {
      if (includeMine) {
        return true;
      }
    } else if (
      Object.keys(project.editors).includes(this.props.authUser.displayName) &&
      includeShared
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

class Selection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleProjects: {},
      loading: true
    };

    this.setProjects = this.setProjects.bind(this);
  }

  async setProjects() {
    try {
      let visibleProjects = await getVisibleProjects(this.props.authUser.uid);
      this.setState({ visibleProjects, loading: false });
    } catch (e) {
      return e;
    }
  }

  async componentDidMount() {
    this.props.setTitle('Project Selection');

    try {
      await poll({
        func: this.setProjects,
        validate: (() => !this.state.loading),
        interval: 1500,
        maxAttempts: 200
      });

      this.interval = setInterval(_ => {
        this.setProjects();
      }, 30000);  
    } catch (e) {
      this.props.fail();
    }
  }

  componentWillUnmount() {
    if (!!this.interval) {
      clearInterval(this.interval);
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
          component={() => (
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
          component={() => (
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
          component={() => (
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
          component={() => (
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
          component={() => (
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
          component={() => (
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
