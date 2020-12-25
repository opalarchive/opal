/*
 ***********************************************************************************
 *                    The code in here should remain untouched!                    *
 *               Under NO CIRCUMSTANCES should this code be changed!               *
 ***********************************************************************************
 */

import React from "react";

import AuthUserContext from "./context";

export interface WithAuthorization {
  authUser: firebase.User;
}

const withAuthorization = (
  condition: (authUser: firebase.User | null) => boolean = (
    authUser: firebase.User | null
  ) => !!authUser
) => (Component: React.ElementType) => {
  class WithAuthorization extends React.Component<object> {
    render() {
      return (
        <AuthUserContext.Consumer>
          {(authUser) =>
            condition(authUser) && !!authUser ? (
              <Component {...this.props} authUser={authUser} />
            ) : (
              "not logged in :("
            )
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return WithAuthorization;
};

export default withAuthorization;
