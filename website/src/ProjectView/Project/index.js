import React from 'react';
import { withRouter } from 'react-router-dom';
import { poll } from '../../Constants';
import { getProjectPrivate, tryProblemAction } from '../../Firebase';
import { getProjectName } from '../../Firebase';

import Loading from '../../Loading';
import { Unconfigured } from './unconfigured';
import View from './View';

class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      project: [],
      loading: true
    }

    this.problemAction = this.problemAction.bind(this);
  }

  async setProject(uuid, authuid) {
    try {
      const project = await getProjectPrivate(uuid, authuid);
      const name = await getProjectName(uuid, authuid);
      this.props.setTitle(name.text);

      this.setState({ project, loading: false });
    } catch (e) {
      return e;
    }
  }

  async componentDidMount() {
    try {
      await poll({
        func: () => this.setProject(this.props.match.params.uuid, this.props.authUser.uid),
        validate: (() => !this.state.loading),
        interval: 1500,
        maxAttempts: 200
      });
      this.interval = setInterval(_ => {
        this.setProject(this.props.match.params.uuid, this.props.authUser.uid);
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

  clientSideAction(ind, data, type) {
    let project = this.state.project;
    const displayName = this.props.authUser.displayName;

    switch (type) {
      case 'vote':
        if (!project.problems[ind].votes) {
          project.problems[ind].votes = {}
        }
        const newVote = (project.problems[ind].votes[displayName] === data) ? 0 : data;
        project.problems[ind].votes[displayName] = newVote;

        return project;
      case 'comment':
        let index = 0;
        if (!!project.problems[ind].replies) {
          index = project.problems[ind].replies.length;
        } else {
          project.problems[ind].replies = [];
        }

        console.log(project.problems[ind].replies);

        const now = new Date();
        project.problems[ind].replies[index] = {
          author: displayName,
          text: data,
          time: now.getTime(),
          type: 'comment'
        };

        return project;
      default:
        return project;
    }
  }

  async problemAction(ind, data, type) {
    const oldProject = this.state.project;
    this.setState({ project: this.clientSideAction(ind, data, type) });

    const result = await tryProblemAction(this.props.match.params.uuid, ind, data, type, this.props.authUser.uid);

    if (!result.success) {
      console.log(result);
      this.setState({ project: oldProject });
    }
  }

  render() {
    if (this.state.loading) {
      return <Loading background="white" />;
    }
    if (this.state.project === 'does-not-exist') {
      return "does not exist";
    }
    if (this.state.project === 'forbidden') {
      return "forbidden";
    }
    if (this.state.project === 'trashed') {
      return "trashed";
    }
    if (this.state.project === 'unconfigured') {
      return <Unconfigured />;
    }
    return (
      <View
        project={this.state.project}
        uuid={this.props.match.params.uuid}
        problemAction={this.problemAction}
        fail={this.fail}
        authUser={this.props.authUser}
      />
    );
  }
}

export default withRouter(Project);
