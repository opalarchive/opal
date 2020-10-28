/*
  ***********************************************************************************
  *                    The code in here should remain untouched!                    *
  *               Under NO CIRCUMSTANCES should this code be changed!               *
  ***********************************************************************************
*/

import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const withAuthorization = (condition) => Component => {
  class WithAuthorization extends React.Component {

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            condition(authUser) ? <Component {...this.props} authUser={authUser} /> : "not logged in :("
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return compose(
    withRouter,
    withFirebase,
  )(WithAuthorization);
};

export default withAuthorization;
