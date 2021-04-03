// currently just signup with some code deleted
// TODO: change this to follow dry principle

import React, { useEffect, useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { auth, understandLoginError } from "../Firebase";
import firebase from "firebase";
import { ImEye, ImEyeBlocked } from "react-icons/im";

import * as ROUTES from "../Constants/routes";

import styles from "./index.css";
import { FiLoader, FiLock } from "react-icons/fi";

interface LoginProps {
  authUser: firebase.User | null;
}

interface InputData {
  value: string;
  error: number;
}

const defaultInputData = { value: "", error: -1 };

const Login: React.FC<LoginProps> = ({ authUser }) => {
  // history for redirecting to account page
  const history = useHistory();

  useEffect(() => {
    if (!!authUser) history.push(ROUTES.PROJECT);
  }, [authUser, history]);

  // style classes
  const classes = makeStyles(styles)();

  const [email, setEmail] = useState<InputData>(defaultInputData);
  const [password, setPassword] = useState<InputData>(defaultInputData);

  const getInput = (name: string) => {
    switch (name) {
      case "email":
        return email;
      case "password":
        return password;
      default:
        return defaultInputData;
    }
  };

  const getSetInput = (name: string) => {
    switch (name) {
      case "email":
        return setEmail;
      case "password":
        return setPassword;
      default:
        return () => {};
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const [loginError, setLoginError] = useState("");

  const [loading, setLoading] = useState(false);

  const errors: { [input: string]: string[] } = {
    email: [
      "Your email cannot be empty.",
      "This does not match the standard format. Make sure that you enter a valid email.",
      "Emails should be at most 60 characters.",
    ],
    password: [],
  };

  const isValid: { [input: string]: ((value: string) => boolean)[] } = {
    email: [
      (value) => value.length > 0,
      (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        ),
      (value) => value.length <= 60,
    ],
    password: [],
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  // check if a value for a certain input name is valid and return the error index for it (-1 for valid)
  const getErrorIndex = (name: string, value: string) => {
    // we use a normal for loop here because if just one check fails, we should short circuit and return false
    for (let i = 0; i < isValid[name].length; i++) {
      if (!isValid[name][i](value)) return i;
    }
    return -1;
  };

  // check ALL inputs to see if they are valid and set the errors
  // returns true if all is valid
  const checkAll = () => {
    let valid = true;
    const inputs = Object.keys(isValid);
    for (let i = 0; i < inputs.length; i++) {
      const value = getInput(inputs[i]).value;
      const errorIndex = getErrorIndex(inputs[i], value);

      getSetInput(inputs[i])({ value, error: errorIndex });
      if (errorIndex !== -1) {
        valid = false;
      }
    }

    return valid;
  };

  // when a new character is typed
  // here we only check if typing more characters causes the error to disappear
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    const oldInput = getInput(name);

    // if there shouldn't be an error anymore
    const valid = oldInput.error === -1 || isValid[name][oldInput.error](value);

    getSetInput(name)({ value, error: valid ? -1 : oldInput.error });
  };

  // when the user clicks off the input
  // here we can check if an error should appear
  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    getSetInput(name)({ value, error: getErrorIndex(name, value) });
  };

  // when the user submits
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // start load for signing in t(ime
    setLoading(true);

    if (checkAll()) {
      auth
        .signInWithEmailAndPassword(email.value, password.value)
        .catch((error) => {
          setLoginError(understandLoginError(error.code));
        });
    }
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <FiLock />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log In
        </Typography>
        <form className={classes.form} onSubmit={onSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="email"
                id="email"
                label="Email Address"
                error={email.error !== -1}
                helperText={email.error !== -1 && errors.email[email.error]}
                value={email.value}
                onChange={onChange}
                onBlur={onBlur}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                error={password.error !== -1}
                helperText={
                  password.error !== -1 && errors.password[password.error]
                }
                value={password.value}
                onChange={onChange}
                onBlur={onBlur}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        tabIndex="-1"
                      >
                        {showPassword ? <ImEye /> : <ImEyeBlocked />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          {loading ? (
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
              endIcon={<FiLoader />}
            >
              Loading
            </Button>
          ) : (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Log In
            </Button>
          )}
          <Grid container justify="flex-end">
            <Grid item>
              Don't have an account?{" "}
              <Link component={RouterLink} to={ROUTES.SIGNUP} variant="body2">
                Sign Up
              </Link>
            </Grid>
          </Grid>

          <Typography color="error">{loginError}</Typography>
        </form>
      </div>
    </Container>
  );
};

export default Login;
