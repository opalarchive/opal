// currently just signup with some code deleted
// TODO: change this to follow dry principle

import React, { useState } from "react";
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
import { auth, understandSignupError } from "../Firebase";
import { ImEye, ImEyeBlocked } from "react-icons/im";

import * as ROUTES from "../Constants/routes";

import styles from "./index.css";
import { FiLoader, FiLock } from "react-icons/fi";
import useAuthUser from "../Session/useAuthUser";

interface InputDatum {
  value: string;
  error: number;
}

interface InputData {
  [name: string]: InputDatum;
}

const useStyles = makeStyles(styles);
const defaultInputData = { value: "", error: -1 };

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

const isValid: {
  [input: string]: ((value: string, inputData: InputData) => boolean)[];
} = {
  email: [
    (value, inputData) => value.length > 0,
    (value, inputData) =>
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value
      ),
    (value, inputData) => value.length <= 60,
  ],
  confirmEmail: [(value, inputData) => value === inputData.email.value],
  username: [
    (value, inputData) => value.length > 0,
    (value, inputData) => /^[A-za-z_0-9]*$/.test(value),
    (value, inputData) => value.length <= 40,
  ],
  password: [
    (value, inputData) => value.length >= 8,
    (value, inputData) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*{}"'`/,._[\]~\-+])[a-zA-Z\d\w\W]{8,}$/.test(
        value
      ),
    (value, inputData) => {
      for (let i = 0; i < value.length; i++)
        if (value.charCodeAt(i) < 0 || value.charCodeAt(i) > 255) return false;
      return true;
    },
  ],
  confirmPassword: [(value, inputData) => value === inputData.password.value],
};

const copyInputData = (inputData: InputData) =>
  Object.fromEntries(Object.entries(inputData).map((o) => [...o]));

// check if a value for a certain input name is valid and return the error index for it (-1 for valid)
const getErrorIndex = (name: string, value: string, inputData: InputData) => {
  // we use a normal for loop here because if just one check fails, we should short circuit and return false
  for (let i = 0; i < isValid[name].length; i++) {
    if (!isValid[name][i](value, inputData)) return i;
  }
  return -1;
};

// checks the input for errors
// and returns the new version of the input with the errors added on
const updateInputData = (inputData: InputData) => {
  const inputs = Object.keys(isValid);

  const inputDataCopy = copyInputData(inputData);

  inputs.forEach((name) => {
    inputDataCopy[name].error = getErrorIndex(
      name,
      inputDataCopy[name].value,
      inputData
    );
  });

  return inputDataCopy;
};

// when a new character is typed
// here we only check if typing more characters causes the error to disappear
const onChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  setInputData: React.Dispatch<
    React.SetStateAction<{
      [name: string]: InputDatum;
    }>
  >
) => {
  const { value, name } = event.target;

  setInputData((inputData) => ({
    ...inputData,
    [name]: {
      value,
      error:
        inputData[name].error === -1 ||
        isValid[name][inputData[name].error](value, inputData)
          ? -1
          : inputData[name].error,
    },
  }));
};

// when the user clicks off the input
// here we can check if an error should appear
const onBlur = (
  event: React.FocusEvent<HTMLInputElement>,
  setInputData: React.Dispatch<
    React.SetStateAction<{
      [name: string]: InputDatum;
    }>
  >
) => {
  const { value, name } = event.target;

  setInputData((inputData) => ({
    ...inputData,
    [name]: { value, error: getErrorIndex(name, value, inputData) },
  }));
};

// when the user submits
const onSubmit = async (
  event: React.FormEvent,
  inputData: {
    [name: string]: InputDatum;
  },
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSignUpError: React.Dispatch<React.SetStateAction<string>>
) => {
  event.preventDefault();

  // start load for signing in time
  setLoading(true);

  const newInputData = updateInputData(inputData);

  if (!Object.values(newInputData).some((data) => data.error !== -1)) {
    auth
      .signInWithEmailAndPassword(
        inputData.email.value,
        inputData.password.value
      )
      .catch((error) => {
        setSignUpError(understandSignupError(error.code));
      });
  }

  setLoading(false);
};

const SignUp: React.FC<{}> = () => {
  // user object
  const authUser = useAuthUser();

  // history for redirecting to account page
  const history = useHistory();

  // style classes
  const classes = useStyles();

  const [inputData, setInputData] = useState<InputData>(
    Object.fromEntries(
      [
        "email",
        "confirmEmail",
        "username",
        "password",
        "confirmPassword",
      ].map((name) => [name, defaultInputData])
    )
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [signUpError, setSignUpError] = useState("");
  const [loading, setLoading] = useState(false);

  // still loading session
  if (authUser === undefined) {
    return <></>;
  } else if (!!authUser) {
    history.push(ROUTES.PROJECT);
    return <></>;
  }

  const {
    email,
    confirmEmail,
    username,
    password,
    confirmPassword,
  } = inputData;

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
        <form
          className={classes.form}
          onSubmit={(event: React.FormEvent) =>
            onSubmit(event, inputData, setLoading, setSignUpError)
          }
          noValidate
        >
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
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  onChange(event, setInputData)
                }
                onBlur={(event: React.FocusEvent<HTMLInputElement>) =>
                  onBlur(event, setInputData)
                }
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
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  onChange(event, setInputData)
                }
                onBlur={(event: React.FocusEvent<HTMLInputElement>) =>
                  onBlur(event, setInputData)
                }
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
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  onChange(event, setInputData)
                }
                onBlur={(event: React.FocusEvent<HTMLInputElement>) =>
                  onBlur(event, setInputData)
                }
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
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  onChange(event, setInputData)
                }
                onBlur={(event: React.FocusEvent<HTMLInputElement>) =>
                  onBlur(event, setInputData)
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((show) => !show)}
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
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  onChange(event, setInputData)
                }
                onBlur={(event: React.FocusEvent<HTMLInputElement>) =>
                  onBlur(event, setInputData)
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword((show) => !show)}
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
