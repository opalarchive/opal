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
import { createUser, understandSignupError } from "../Firebase";
import { ImEye, ImEyeBlocked } from "react-icons/im";

import * as ROUTES from "../Constants/routes";

import styles from "./index.css";
import { FiLoader, FiLock } from "react-icons/fi";
import useAuthUser from "../Session/useAuthUser";

// data that is inputed
// error is the index of the error that is being produced
// -1 means no error
// see the errors object for the list of errors
// and the checks object for the checks for those errors
interface InputData {
  value: string;
  error: number;
}

const defaultInputData = { value: "", error: -1 };

const SignUp: React.FC<{}> = () => {
  // get user object
  const authUser = useAuthUser();

  // history for redirecting to account page
  const history = useHistory();

  useEffect(() => {
    if (!!authUser) history.push(ROUTES.PROJECT);
  }, [authUser, history]);

  // style classes
  const classes = makeStyles(styles)();

  const [email, setEmail] = useState<InputData>(defaultInputData);
  const [confirmEmail, setConfirmEmail] = useState<InputData>(defaultInputData);
  const [username, setUsername] = useState<InputData>(defaultInputData);
  const [password, setPassword] = useState<InputData>(defaultInputData);
  const [confirmPassword, setConfirmPassword] = useState<InputData>(
    defaultInputData
  );

  const getInput = (name: string) => {
    switch (name) {
      case "email":
        return email;
      case "confirmEmail":
        return confirmEmail;
      case "username":
        return username;
      case "password":
        return password;
      case "confirmPassword":
        return confirmPassword;
      default:
        return defaultInputData;
    }
  };

  const getSetInput = (name: string) => {
    switch (name) {
      case "email":
        return setEmail;
      case "confirmEmail":
        return setConfirmEmail;
      case "username":
        return setUsername;
      case "password":
        return setPassword;
      case "confirmPassword":
        return setConfirmPassword;
      default:
        return () => {};
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [signUpError, setSignUpError] = useState("");

  const [loading, setLoading] = useState(false);

  const errors: { [input: string]: string[] } = {
    email: [
      "Your email cannot be empty.",
      "This does not match the standard format. Make sure that you enter a valid email.",
      "Emails should be at most 60 characters.",
    ],
    confirmEmail: ["Your email must match the above email."],
    username: [
      "Your username cannot be empty.",
      "Please only use the latin alphabet (capital and lowercase characters), numerals, and underscores.",
      "Userames should be at most 40 characters.",
    ],
    password: [
      "Your password must contain at least 8 characters.",
      "Your password must contain at least one capital letter, one lowercase letter, number, and special character.",
      "Your password should only contain ASCII characters from 0 to 255.",
    ],
    confirmPassword: ["Your password must match the above password."],
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
    confirmEmail: [(value) => value === email.value],
    username: [
      (value) => value.length > 0,
      (value) => /^[A-za-z_0-9]*$/.test(value),
      (value) => value.length <= 40,
    ],
    password: [
      (value) => value.length >= 8,
      (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*{}"'`/,._[\]~\-+])[a-zA-Z\d\w\W]{8,}$/.test(
          value
        ),
      (value) => {
        for (let i = 0; i < value.length; i++)
          if (value.charCodeAt(i) < 0 || value.charCodeAt(i) > 255)
            return false;
        return true;
      },
    ],
    confirmPassword: [(value) => value === password.value],
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

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

    // if it is email or password, typing could cause the confirm counterpart to match up
    // which would make the error disappear
    if (name === "email") {
      const confirmEmailInput = getInput("confirmEmail");
      if (confirmEmailInput.error !== -1 && confirmEmailInput.value === value) {
        getSetInput("confirmEmail")({ value, error: -1 });
      }
    } else if (name === "password") {
      const confirmPasswordInput = getInput("confirmPassword");
      if (
        confirmPasswordInput.error !== -1 &&
        confirmPasswordInput.value === value
      ) {
        getSetInput("confirmPassword")({ value, error: -1 });
      }
    }
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

    // start load for signing in time
    setLoading(true);

    if (checkAll()) {
      const trySignUp = await createUser(
        username.value,
        password.value,
        email.value
      );

      if (!trySignUp.success) {
        setSignUpError(understandSignupError(trySignUp.value));
      }
    }
    setLoading(false);
  };

  // still loading session
  if (authUser === undefined) {
    return <></>;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <FiLock />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
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
                name="confirmEmail"
                id="confirmEmail"
                label="Confirm Email Address"
                error={confirmEmail.error !== -1}
                helperText={
                  confirmEmail.error !== -1 &&
                  errors.confirmEmail[confirmEmail.error]
                }
                value={confirmEmail.value}
                onChange={onChange}
                onBlur={onBlur}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="username"
                id="username"
                label="Username"
                autoFocus
                error={username.error !== -1}
                helperText={
                  username.error !== -1 && errors.username[username.error]
                }
                value={username.value}
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
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                id="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                error={confirmPassword.error !== -1}
                helperText={
                  confirmPassword.error !== -1 &&
                  errors.confirmPassword[confirmPassword.error]
                }
                value={confirmPassword.value}
                onChange={onChange}
                onBlur={onBlur}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={toggleShowConfirmPassword}
                        tabIndex="-1"
                      >
                        {showConfirmPassword ? <ImEye /> : <ImEyeBlocked />}
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
              Sign Up
            </Button>
          )}
          <Grid container justify="flex-end">
            <Grid item>
              Already have an account?{" "}
              <Link component={RouterLink} to={ROUTES.LOGIN} variant="body2">
                Log In
              </Link>
            </Grid>
          </Grid>

          <Typography color="error">{signUpError}</Typography>
        </form>
      </div>
    </Container>
  );
};

export default SignUp;
