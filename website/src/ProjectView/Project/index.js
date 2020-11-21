import React from 'react';
import { withRouter } from 'react-router-dom';
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
  }

  async componentDidMount() {
    let project = await getProjectPrivate(this.props.match.params.id, this.props.authUser.uid);

    this.setState({ project, loading: false });
  }

  render() {
    if (this.state.loading) {
      return <Loading background="white" />;
    }
    if (this.state.project === 'unconfigured') {
      return <Unconfigured />;
    }
    return <View project={JSON.stringify(this.state.project)} />;
  }
}

export default withRouter(Project);
