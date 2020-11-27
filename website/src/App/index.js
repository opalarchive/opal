import React from 'react';

import * as ROUTES from '../Constants/routes';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Home from '../Home';
import SignUp from '../SignUp';
import ProjectView from '../ProjectView';

import AuthProvider from '../Providers/AuthProvider.js';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { withAuthentication } from '../Session';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#4dabf5',
      main: '#2196f3',
      dark: '#1769aa',
      contrastText: '#fff',
    },
    secondary: {
      light: '#33eb91',
      main: '#00e676',
      dark: '#00a152',
      contrastText: '#000',
    },
  },
});


class App extends React.Component {
  render() {
    return (
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Router>
            <Switch>
              <Route exact path={ROUTES.CUSTOM_HOME} component={Home} />
              <Route exact path={ROUTES.HOME} component={Home} />
              <Route exact path={ROUTES.SIGNUP} component={SignUp} />
              <Route path={ROUTES.PROJECT} component={ProjectView} />
            </Switch>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    );
  }
}

export default withAuthentication(App);
