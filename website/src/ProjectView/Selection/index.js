import React from 'react';
import styles from './index.module.css';

import * as ROUTES from '../../Constants/routes';

import { Route, withRouter } from 'react-router-dom';

import Sidebar from './Sidebar';

class SelectionBase extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      projects: null,
      data: null,
      sortable: null
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
        data: ['name', 'owner', 'lastModified'],
        sortable: 'name'
      },
      myProjects: {
        includeMine: true,
        includeShared: false,
        includeAllStarred: false,
        includeTrash: false,
        data: ['name', 'owner', 'lastModified'],
        sortable: 'name'
      },
      sharedWithMe: {
        includeMine: false,
        includeShared: true,
        includeAllStarred: false,
        includeTrash: false,
        data: ['name', 'owner', 'shareDate'], // owner = shared by in this case (unless we allow collaborator sharing?)
        sortable: 'shareDate'                 // owner is still better I think
      },
      recent: {
        includeMine: true,
        includeShared: true,
        includeAllStarred: false,
        includeTrash: false,
        data: ['name', 'owner', 'lastModifiedByMe'],
        sortable: 'lastModifiedByMe'
      },
      trash: {
        includeMine: false,
        includeShared: false,
        includeAllStarred: false,
        includeTrash: true,             // trash is only trash by me (i.e. only owner can trash)
        data: ['name', 'lastModified'], // last modified = trash date for obvious reasons
        sortable: 'lastModified'        // (disable editing when trashed)
      }
    };
  }

  componentDidMount() {
    const data = this.categories[this.props.type].data;
    const sortable = this.categories[this.props.type].sortable;

    if (this.props.visibleProjects) {
      console.log(Object.keys(this.props.visibleProjects).filter(id => this.isIncludable(this.props.visibleProjects[id], 
        this.categories[this.props.type].includeMine,
        this.categories[this.props.type].includeShared,
        this.categories[this.props.type].includeAllStarred,
        this.categories[this.props.type].includeTrash
      )));
    }
  }

  isIncludable(project, includeMine, includeShared, includeAllStarred, includeTrash) {
    if (project.trashed) {
      return includeTrash;
    }
    if (project.editors[this.props.authUser.uid].starred && includeAllStarred) {
      return true;
    }
    if (project.owner === this.props.authUser.uid) {
      if (includeMine) {
        return true;
      }
    }
    else if (Object.keys(project.editors).includes(this.props.authUser.uid) && includeShared) {
      return true;
    }

    return false;
  }

  getProjectList(category) {
    
  }

  render() {
    return (
      <div>
        asdfkjalsdkjflaskdf
      </div>
    );
  }
}

class Selection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleProjects: {}
    };
  }

  componentDidMount() {
    // change this filler obviously
    let visibleProjects = {
      amolrama: {
        owner: "9Nq2ay3wYTe5jYqf3FzZNSkO7uO2",
        trashed: false,
        editors: {
          "9Nq2ay3wYTe5jYqf3FzZNSkO7uO2": {
            shareDate: 6942017385,
            lastEdit: 2309840212301,
            starred: false
          },
          "f6rgt74aDCYTOAwNbFXKOlQYZrM2": {
            shareDate: 16942017385,
            lastEdit: 23209840212301,
            starred: false
          }
        }
      },
      aramo12123123la: {
        owner: "f6rgt74aDCYTOAwNbFXKOlQYZrM2",
        trashed: false,
        editors: {
          "f6rgt74aDCYTOAwNbFXKOlQYZrM2": {
            shareDate: 7942017385,
            lastEdit: 2309840212301,
            starred: false
          },
          "9Nq2ay3wYTe5jYqf3FzZNSkO7uO2": {
            shareDate: 26942017385,
            lastEdit: 23209840212301,
            starred: false
          }
        }
      }
    };
    this.setState({ visibleProjects });
  }

  render() {
    let width = 15;
    return (
      <div>
        <Sidebar width={width} />
        <div style={{ marginLeft: `${width}rem`, height: "100vh", padding: "1rem", backgroundColor: "rgb(245, 246, 250)" }}>
          <Route exact path={ROUTES.PROJECT} component={() => <SelectionBase type="priority" visibleProjects={this.state.visibleProjects} authUser={this.props.authUser} />} />
          <Route exact path={ROUTES.PROJECT_PRIORITY} component={() => <SelectionBase type="priority" visibleProjects={this.state.visibleProjects} authUser={this.props.authUser} />} />
          <Route exact path={ROUTES.PROJECT_MY_PROJECTS} component={() => <SelectionBase type="myProjects" visibleProjects={this.state.visibleProjects} authUser={this.props.authUser} />} />
          <Route exact path={ROUTES.PROJECT_SHARED_WITH_ME} component={() => <SelectionBase type="sharedWithMe" visibleProjects={this.state.visibleProjects} authUser={this.props.authUser} />} />
          <Route exact path={ROUTES.PROJECT_RECENT} component={() => <SelectionBase type="recent" visibleProjects={this.state.visibleProjects} authUser={this.props.authUser} />} />
          <Route exact path={ROUTES.PROJECT_TRASH} component={() => <SelectionBase type="trash" visibleProjects={this.state.visibleProjects} authUser={this.props.authUser} />} />
        </div>
      </div>
    );
  }
}

export default Selection;
