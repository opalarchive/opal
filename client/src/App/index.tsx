import React from "react";

import * as ROUTES from "../Constants/routes";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "../Home";
import SignUp from "../SignUp";
import ProjectView from "../ProjectView";

import { ThemeProvider } from "@material-ui/core/styles";
import { withAuthentication } from "../Session";
import theme from "./index.css";

const Project = withAuthentication(ProjectView);

class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path={ROUTES.CUSTOM_HOME} render={() => <Home />} />
            <Route exact path={ROUTES.HOME} render={() => <Home />} />
            <Route exact path={ROUTES.SIGNUP} render={() => <SignUp />} />
            <Route path={ROUTES.PROJECT} render={() => <Project />} />
          </Switch>
        </Router>
      </ThemeProvider>
    );
  }
}

export default App;
