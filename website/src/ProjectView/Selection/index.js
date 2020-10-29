import React from 'react';
import styles from './index.module.css';

import * as ROUTES from '../../Constants/routes';

import { Route, withRouter } from 'react-router-dom';

import Sidebar from './Sidebar';
import Loading from '../../Loading';
import Table from './table';

class SelectionBase extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      projects: {},
      data: [],
      sortable: []
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
        sortable: ['name', 'owner', 'lastModified']
      },
      myProjects: {
        includeMine: true,
        includeShared: false,
        includeAllStarred: false,
        includeTrash: false,
        data: ['name', 'owner', 'lastModified'],
        sortable: ['name', 'owner', 'lastModified']
      },
      sharedWithMe: {
        includeMine: false,
        includeShared: true,
        includeAllStarred: false,
        includeTrash: false,
        data: ['name', 'owner', 'shareDate'],    // owner = shared by in this case (unless we allow collaborator sharing?)
        sortable: ['name', 'owner', 'shareDate'] // owner is still better I think
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
        includeTrash: true,                // trash is only trash by me (i.e. only owner can trash)
        data: ['name', 'lastModified'],    // last modified = trash date for obvious reasons
        sortable: ['name', 'lastModified'] // (disable editing when trashed)
      }
    };
  }

  componentDidMount() {

    let projectsKeys = Object.keys(this.props.visibleProjects).filter(id => this.isIncludable(this.props.visibleProjects[id],
      this.categories[this.props.type].includeMine,
      this.categories[this.props.type].includeShared,
      this.categories[this.props.type].includeAllStarred,
      this.categories[this.props.type].includeTrash));
    
    if (projectsKeys && projectsKeys[0]) {
      let projects = Object.fromEntries(projectsKeys.map(id => [id, this.props.visibleProjects[id]]));
      let data = this.categories[this.props.type].data;
      let sortable = this.categories[this.props.type].sortable;  

      this.setState({ projects, data, sortable });
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

  render() {
    return (
      <div>
        <Table projects={this.state.projects} ownerUsernames={this.props.ownerUsernames} data={this.state.data} sortable={this.state.sortable} authUser={this.props.authUser}/>
      </div>
    );
  }
}

class Selection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleProjects: {},
      ownerUsernames: {},
      loading: true
    };
  }

  componentDidMount() {
    // change this filler obviously
    let visibleProjects = {
      amolrama: {
        name: 'test project 1 orz rama',
        owner: '9Nq2ay3wYTe5jYqf3FzZNSkO7uO2',
        trashed: false,
        editors: {
          '9Nq2ay3wYTe5jYqf3FzZNSkO7uO2': {
            shareDate: 6942017385,
            lastEdit: 119840212301,
            starred: false
          },
          'f6rgt74aDCYTOAwNbFXKOlQYZrM2': {
            shareDate: 16942017385,
            lastEdit: 1109840212301,
            starred: false
          }
        }
      },
      aramo12123123la: {
        name: 'haha this is mine',
        owner: 'f6rgt74aDCYTOAwNbFXKOlQYZrM2',
        trashed: false,
        editors: {
          'f6rgt74aDCYTOAwNbFXKOlQYZrM2': {
            shareDate: 7942017385,
            lastEdit: 119840212301,
            starred: false
          },
          '9Nq2ay3wYTe5jYqf3FzZNSkO7uO2': {
            shareDate: 26942017385,
            lastEdit: 1109840212301,
            starred: false
          }
        }
      }
    };
    let ownerUsernames = {
      amolrama: 'naman12',
      aramo12123123la: 'vitriol'
    }
    this.setState({ visibleProjects, ownerUsernames, loading: false });
  }

  render() {
    let width = 15;
    if (this.state.loading) {
      return <Loading background="white" />
    }
    return (
      <div>
        <Sidebar width={width} />
        <div style={{ marginLeft: `${width}rem`, height: "100vh", padding: "1rem", backgroundColor: "rgb(245, 246, 250)" }}>
          <Route exact path={ROUTES.PROJECT} component={() => <SelectionBase type="priority" visibleProjects={this.state.visibleProjects} ownerUsernames={this.state.ownerUsernames} authUser={this.props.authUser} />} />
          <Route exact path={ROUTES.PROJECT_PRIORITY} component={() => <SelectionBase type="priority" visibleProjects={this.state.visibleProjects} ownerUsernames={this.state.ownerUsernames} authUser={this.props.authUser} />} />
          <Route exact path={ROUTES.PROJECT_MY_PROJECTS} component={() => <SelectionBase type="myProjects" visibleProjects={this.state.visibleProjects} ownerUsernames={this.state.ownerUsernames} authUser={this.props.authUser} />} />
          <Route exact path={ROUTES.PROJECT_SHARED_WITH_ME} component={() => <SelectionBase type="sharedWithMe" visibleProjects={this.state.visibleProjects} ownerUsernames={this.state.ownerUsernames} authUser={this.props.authUser} />} />
          <Route exact path={ROUTES.PROJECT_RECENT} component={() => <SelectionBase type="recent" visibleProjects={this.state.visibleProjects} ownerUsernames={this.state.ownerUsernames} authUser={this.props.authUser} />} />
          <Route exact path={ROUTES.PROJECT_TRASH} component={() => <SelectionBase type="trash" visibleProjects={this.state.visibleProjects} ownerUsernames={this.state.ownerUsernames} authUser={this.props.authUser} />} />
        </div>
      </div>
    );
  }
}

export default Selection;
