import React from 'react';
import { withRouter } from 'react-router-dom';
import { poll } from '../../Constants/poll';
import Fail from '../../Fail';
import { tryVote } from '../../Firebase';
import { getProjectPrivate } from '../../Firebase';

import Loading from '../../Loading';
import { Unconfigured } from './unconfigured';
import View from './View';

class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      project: {},
      loading: true
    }

    this.vote = this.vote.bind(this);
  }

  async setProject(id, uid) {
    try {
      let project = await getProjectPrivate(id, uid);
      this.props.setTitle(project.name);

      this.setState({ project, loading: false });
    } catch (e) {
      return e;
    }
  }

  async componentDidMount() {
    try {
      await poll({
        func: () => this.setProject(this.props.match.params.id, this.props.authUser.uid),
        validate: (() => !this.state.loading),
        interval: 1500,
        maxAttempts: 200
      });
      this.interval = setInterval(_ => {
        this.setProject(this.props.match.params.id, this.props.authUser.uid);
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

  async vote(id, direction) {
    const oldProject = this.state.project, project = this.state.project;
    if (!project.problems[id].votes) {
      project.problems[id].votes = {};
    }

    if (project.problems[id].votes[this.props.authUser.displayName] === direction)
      project.problems[id].votes[this.props.authUser.displayName] = 0;
    else
      project.problems[id].votes[this.props.authUser.displayName] = direction;

    this.setState({ project });

    const result = await tryVote(this.props.match.params.id, id, this.props.authUser.uid, direction);

    if (!result.success) {
      console.log(result);
      this.setState({ project: oldProject });
    }
  }

  render() {
    if (this.state.fail) {
      return <Fail />;
    }
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
        vote={this.vote}
        authUser={this.props.authUser}
      />
    );
  }
}

export default withRouter(Project);
