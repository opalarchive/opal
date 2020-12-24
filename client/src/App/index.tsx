import React from "react";

import * as ROUTES from "../Constants/routes";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "../Home";
import SignUp from "../SignUp";
import ProjectView from "../ProjectView";

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { withAuthentication } from "../Session";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#4dabf5",
      main: "#2196f3",
      dark: "#1769aa",
      contrastText: "#fff",
    },
    secondary: {
      light: "#33eb91",
      main: "#00e676",
      dark: "#00a152",
      contrastText: "#000",
    },
  },
});

class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path={ROUTES.CUSTOM_HOME} render={() => <Home />} />
            <Route exact path={ROUTES.HOME} render={() => <Home />} />
            <Route exact path={ROUTES.SIGNUP} render={() => <SignUp />} />
            <Route
              path={ROUTES.PROJECT}
              render={() => {
                const Project = withAuthentication(ProjectView);
                return <Project />;
              }}
            />
          </Switch>
        </Router>
      </ThemeProvider>
    );
  }
}

export default App;
