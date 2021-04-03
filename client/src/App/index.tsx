import React from "react";

import * as ROUTES from "../Constants/routes";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "../Home";
import Login from "../Login";
import SignUp from "../SignUp";
import ProjectView from "../ProjectView";

import { ThemeProvider } from "@material-ui/core/styles";
import { AuthUserContext, withAuthentication } from "../Session";
import theme from "./index.css";

const Project = withAuthentication(ProjectView);

// sloppy hoc for now
// TODO: change to hook
const LoginAuth = withAuthentication(() => (
  <AuthUserContext.Consumer>
    {(authUser) => <Login authUser={authUser} />}
  </AuthUserContext.Consumer>
));

const SignUpAuth = withAuthentication(() => (
  <AuthUserContext.Consumer>
    {(authUser) => <SignUp authUser={authUser} />}
  </AuthUserContext.Consumer>
));

class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path={ROUTES.CUSTOM_HOME} render={() => <Home />} />
            <Route exact path={ROUTES.HOME} render={() => <Home />} />
            <Route exact path={ROUTES.LOGIN} render={() => <LoginAuth />} />
            <Route exact path={ROUTES.SIGNUP} render={() => <SignUpAuth />} />
            <Route path={ROUTES.PROJECT} render={() => <Project />} />
          </Switch>
        </Router>
      </ThemeProvider>
    );
  }
}

export default App;
