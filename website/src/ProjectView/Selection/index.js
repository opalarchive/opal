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
      fixed: false, // whether we can't sort (i.e. fixed => no sorting)
      defaultSort: {}
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
        fixed: false,
        defaultSort: {
          dataPoint: 'name',
          direction: 'asc'
        }
      },
      myProjects: {
        includeMine: true,
        includeShared: false,
        includeAllStarred: false,
        includeTrash: false,
        data: ['name', 'owner', 'lastModified'],
        fixed: false,
        defaultSort: {
          dataPoint: 'name',
          direction: 'asc'
        }
      },
      sharedWithMe: {
        includeMine: false,
        includeShared: true,
        includeAllStarred: false,
        includeTrash: false,
        data: ['name', 'owner', 'shareDate'],    // owner = shared by in this case (unless we allow collaborator sharing?)
        fixed: false,                            // owner is still better I think
        defaultSort: {
          dataPoint: 'shareDate',
          direction: 'desc'
        }
      },
      recent: {
        includeMine: true,
        includeShared: true,
        includeAllStarred: false,
        includeTrash: false,
        data: ['name', 'owner', 'lastModifiedByMe'],
        fixed: true,
        defaultSort: {
          dataPoint: 'lastModifiedByMe',
          direction: 'desc'
        }
      },
      trash: {
        includeMine: false,
        includeShared: false,
        includeAllStarred: false,
        includeTrash: true,                 // trash is only trash by me (i.e. only owner can trash)
        data: ['name', 'owner', 'lastModified'],     // last modified = trash date for obvious reasons 
        fixed: false,                       // (disable editing when trashed)
        defaultSort: {
          dataPoint: 'lastModifiedByMe',
          direction: 'desc'
        }
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
      let fixed = this.categories[this.props.type].fixed;  
      let defaultSort = this.categories[this.props.type].defaultSort;  

      this.setState({ projects, data, fixed, defaultSort });
    }
  }

  isIncludable(project, includeMine, includeShared, includeAllStarred, includeTrash) {
    if (project.trashed) {
      return includeTrash;
    }
    if (project.editors[this.props.authUser.displayName].starred && includeAllStarred) {
      return true;
    }
    if (project.owner === this.props.authUser.displayName) {
      if (includeMine) {
        return true;
      }
    }
    else if (Object.keys(project.editors).includes(this.props.authUser.displayName) && includeShared) {
      return true;
    }

    return false;
  }

  render() {
    return (
      <div>
        <Table projects={this.state.projects} data={this.state.data} fixed={this.state.fixed} defaultSort={this.state.defaultSort} authUser={this.props.authUser}/>
      </div>
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
  }

  componentDidMount() {
    // change this filler obviously
    let visibleProjects = {
      amolrama: {
        name: 'test project 1 orz rama',
        owner: 'naman12',
        trashed: false,
        editors: {
          'naman12': {
            shareDate: 6942017385,
            lastEdit: 119840212301,
            starred: false
          },
          'testuser': {
            shareDate: 16942017385,
            lastEdit: 1109840212301,
            starred: false
          }
        }
      },
      aramo12123123la: {
        name: 'haha this is mine',
        owner: 'testuser',
        trashed: false,
        editors: {
          'testuser': {
            shareDate: 7942017385,
            lastEdit: 119840212301,
            starred: false
          },
          'naman12': {
            shareDate: 26942017385,
            lastEdit: 1109840212301,
            starred: false
          }
        }
      },
      wen: {
        name: 'wen',
        owner: 'wen',
        trashed: true,
        editors: {
          'wen': {
            shareDate: 6942017385,
            lastEdit: 119840212301,
            starred: false
          },
          'testuser': {
            shareDate: 16942017385,
            lastEdit: 1109840212301,
            starred: false
          }
        }
      },
    };
    this.setState({ visibleProjects, loading: false });
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
