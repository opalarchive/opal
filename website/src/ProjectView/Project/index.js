import React from 'react';
import { withRouter } from 'react-router-dom';
import { getProjectPrivate } from '../../Firebase';

import Loading from '../../Loading';

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
      return <Loading background="white" />
    }
    return (
      <div>
        {JSON.stringify(this.state.project)}
      </div>
    );
  }
}

export default withRouter(Project);
