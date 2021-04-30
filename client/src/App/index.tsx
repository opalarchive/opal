import React from "react";

import * as ROUTES from "../Constants/routes";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "../Home";
import Login from "../Login";
import SignUp from "../SignUp";
import ProjectView from "../ProjectView";

import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./index.css";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path={ROUTES.CUSTOM_HOME} render={() => <Home />} />
          <Route exact path={ROUTES.HOME} render={() => <Home />} />
          <Route exact path={ROUTES.LOGIN} render={() => <Login />} />
          <Route exact path={ROUTES.SIGNUP} render={() => <SignUp />} />
          <Route path={ROUTES.PROJECT} render={() => <ProjectView />} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;
