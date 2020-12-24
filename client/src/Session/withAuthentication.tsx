/*
 ***********************************************************************************
 *                    The code in here should remain untouched!                    *
 *               Under NO CIRCUMSTANCES should this code be changed!               *
 ***********************************************************************************
 */

import React from "react";

import AuthUserContext from "./context";
import { auth } from "../Firebase";

interface WithAuthenticationState {
  authUser: firebase.User | null;
}

const withAuthentication = (Component: React.ElementType) => {
  class WithAuthentication extends React.Component<
    object,
    WithAuthenticationState
  > {
    state = {
      authUser: null,
    };

    private listener!: firebase.Unsubscribe;

    componentDidMount() {
      this.listener = auth.onAuthStateChanged(
        (authUser) => {
          this.setState({ authUser });
        },
        () => {
          this.setState({ authUser: null });
        }
      );
    }

    componentWillUnmount() {
      if (!!this.listener) {
        this.listener();
      }
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return WithAuthentication;
};

export default withAuthentication;
