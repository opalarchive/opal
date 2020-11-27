import React from 'react';
import { withRouter } from 'react-router-dom';
import { poll } from '../../Constants';
import { tryVote } from '../../Firebase';
import { getProjectProblems, getProjectName } from '../../Firebase';

import Loading from '../../Loading';
import { Unconfigured } from './unconfigured';
import View from './View';

class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      problems: [],
      loading: true
    }

    this.vote = this.vote.bind(this);
  }

  async setProject(uuid, authuid) {
    try {
      const problems = await getProjectProblems(uuid, authuid);
      const name = await getProjectName(uuid, authuid);
      this.props.setTitle(name.text);

      this.setState({ problems, loading: false });
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

  async vote(ind, direction) {
    const oldProblems = this.state.problems, problems = this.state.problems;
    if (!problems[ind].votes) {
      problems[ind].votes = {};
    }

    if (problems[ind].votes[this.props.authUser.displayName] === direction)
      problems[ind].votes[this.props.authUser.displayName] = 0;
    else
      problems[ind].votes[this.props.authUser.displayName] = direction;

    this.setState({ problems });

    const result = await tryVote(this.props.match.params.uuid, ind, this.props.authUser.uid, direction);

    if (!result.success) {
      console.log(result);
      this.setState({ problems: oldProblems });
    }
  }

  render() {
    if (this.state.loading) {
      return <Loading background="white" />;
    }
    if (this.state.problems === 'does-not-exist') {
      return "does not exist";
    }
    if (this.state.problems === 'forbidden') {
      return "forbidden";
    }
    if (this.state.problems === 'trashed') {
      return "trashed";
    }
    if (this.state.problems === 'unconfigured') {
      return <Unconfigured />;
    }
    return (
      <View
        problems={this.state.problems}
        uuid={this.props.match.params.uuid}
        vote={this.vote}
        fail={this.fail}
        authUser={this.props.authUser}
      />
    );
  }
}

export default withRouter(Project);
