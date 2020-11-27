import React from 'react';
import { withRouter } from 'react-router-dom';
import { poll } from '../../Constants/poll';
import Fail from '../../Fail';
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

    this.replyLoading = true;
    this.replyLoadingStarted = false;

    this.vote = this.vote.bind(this);
    this.setReplyLoading = this.setReplyLoading.bind(this);
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

  setReplyLoading(replyLoading, update) {
    if (replyLoading === this.replyLoading) return;
    if (replyLoading && this.replyLoadingStarted) return;

    console.log(replyLoading);
    this.replyLoading = replyLoading;

    if (replyLoading) this.replyLoadingStarted = true;
    
    if (update) this.setState({});
  }

  render() {
    console.log('-' + this.replyLoading);
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
      <>
        {this.state.replyLoading ? <Loading background="white" /> : null}
        {/* we want it to exist (and load), but not be visible*/}
        <div style={this.state.replyLoading ? { position: "relative", top: "-200vh", height: "100%" } : { height: "100%" }}>
          <View
            problems={this.state.problems}
            uuid={this.props.match.params.uuid}
            vote={this.vote}
            fail={this.fail}
            replyLoading={this.replyLoading}
            setReplyLoading={this.setReplyLoading}
            authUser={this.props.authUser}
          />
        </div>
      </>
    );
  }
}

export default withRouter(Project);
