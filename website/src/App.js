import React from 'react';
import logo from './logo.svg';
import styles from './App.module.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './Home';
import SignUp from './SignUp';

import AuthProvider from './Providers/AuthProvider.js';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
