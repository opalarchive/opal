import React from "react";
import { withRouter, Link as RouterLink } from "react-router-dom";
import { createUser } from "../Firebase";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { FiLoader } from "react-icons/fi";
import {
  withStyles,
  Container,
  Typography,
  Grid,
  Link,
  TextField,
  CssBaseline,
  Button,
  Avatar,
  InputAdornment,
  IconButton,
  Checkbox,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { compose } from "recompose";

import { withSnackbar } from "notistack";

import * as ROUTES from "../Constants/routes";

import styles from "./index.css.ts";
import NameInput from "../Input/name";

class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: {
        value: "",
        valid: true,
        helper: -1,
      },
      firstName: {
        value: "",
        valid: true,
        helper: -1,
      },
      lastName: {
        value: "",
        valid: true,
        helper: -1,
      },
      password: {
        value: "",
        valid: true,
        helper: -1,
      },
      confirmPassword: {
        value: "",
        valid: true,
        helper: -1,
      },
      email: {
        value: "",
        valid: true,
        helper: -1,
      },
      error: "",
      showPassword: false,
      showConfirmPassword: false,
    };

    this.checkEvent = this.checkEvent.bind(this);
    this.checkAll = this.checkAll.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.concernValid = this.concernValid.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.setValue = this.setValue.bind(this);
    this.submissionErrorInfo = this.submissionErrorInfo.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.handleMouseDownPassword = this.handleMouseDownPassword.bind(this);
    this.handleClickShowConfirmPassword = this.handleClickShowConfirmPassword.bind(
      this
    );
    this.handleMouseDownConfirmPassword = this.handleMouseDownConfirmPassword.bind(
      this
    );

    this.errors = {
      email: [
        "Your email cannot be empty.",
        "This does not match the standard format. Make sure that you enter a valid email.",
        "Emails should be at most 60 characters.",
      ],
      username: [
        "Your username cannot be empty.",
        "Please only use the latin alphabet (capital and lowercase characters), numerals, and underscores.",
        "Userames should be at most 40 characters.",
      ],
      firstName: [
        "Your first name cannot be empty.",
        "Please only use the latin alphabet (capital and lowercase characters), spaces, and hyphens.",
      ],
      lastName: [
        "Your last name cannot be empty.",
        "Please only use the latin alphabet (capital and lowercase characters), spaces, and hyphens.",
      ],
      password: [
        "Your password must contain at least 8 characters.",
        "Your password must contain at least one capital letter, one lowercase letter, number, and special character.",
        "Your password should only contain ASCII characters from 0 to 255.",
      ],
      confirmPassword: ["Your password must match the above password."],
    };
    this.checks = {
      email: [
        (value) => value.length === 0,
        (value) =>
          !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
          ),
        (value) => value.length > 60,
      ],
      username: [
        (value) => value.length === 0,
        (value) => !/^[A-za-z_0-9]*$/.test(value),
        (value) => value.length > 40,
      ],
      firstName: [
        (value) => !value || value.length === 0,
        (value) => value.match(/[^a-zA-Z -]+/g),
      ],
      lastName: [
        (value) => !value || value.length === 0,
        (value) => value.match(/[^a-zA-Z -]+/g),
      ],
      password: [
        (value) => value.length < 8,
        (value) =>
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*{}"'`/,._[\]~\-+])[a-zA-Z\d\w\W]{8,}$/.test(
            value
          ),
        (value) => {
          for (let i = 0; i < value.length; i++)
            if (value.charCodeAt(i) < 0 || value.charCodeAt(i) > 255)
              return true;
          return false;
        },
      ],
      confirmPassword: [(value) => value !== this.state.password.value],
    };
  }

  handleClickShowPassword() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  handleMouseDownPassword() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  handleClickShowConfirmPassword() {
    this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
  }

  handleMouseDownConfirmPassword() {
    this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
  }

  setValue(event) {
    let value = event.target.value;
    let valid = this.state[event.target.name].valid;
    if (
      !this.state[event.target.name].valid &&
      !this.concernValid(
        event.target.name,
        this.state[event.target.name].helper,
        value
      )
    )
      valid = true;

    this.setState({
      [event.target.name]: {
        ...this.state[event.target.name],
        value,
        valid,
      },
    });
    if (event.target.name === "password" && !this.state.confirmPassword.valid) {
      if (value === this.state.confirmPassword.value)
        this.setState({
          confirmPassword: { ...this.state.confirmPassword, valid: true },
        });
    }
  }

  validateInput(value, type) {
    const errors = this.errors[type];
    const checks = this.checks[type];

    for (let i = 0; i < errors.length; i++) {
      if (checks[i](value)) return i;
    }

    return -1;
  }

  checkEvent(event) {
    let validation = "";

    if (!Object.keys(this.errors).some((el) => event.target.name === el))
      return;
    validation = this.validateInput(
      this.state[event.target.name].value,
      event.target.name
    );
    if (validation > -1)
      this.setState({
        [event.target.name]: {
          ...this.state[event.target.name],
          valid: false,
          helper: validation,
        },
      });

    return false;
  }

  concernValid(category, concern, value) {
    return this.checks[category][concern](value);
  }

  checkAll() {
    const components = Object.keys(this.errors);
    for (let i = 0; i < components.length; i++) {
      for (let j = 0; j < this.checks[components[i]].length; j++) {
        if (this.checks[components[i]][j](this.state[components[i]].value)) {
          return true;
        }
      }
    }

    return false;
  }

  async onSignUp(e) {
    e.preventDefault();
    this.setState({ signingIn: true });

    if (this.checkAll()) {
      this.setState({ signingIn: false });
      this.props.enqueueSnackbar("Please check all errors and sign up again.", {
        variant: "error",
      });
      return;
    }

    const trySignUp = await createUser(
      this.state.username.value,
      this.state.firstName.value,
      this.state.lastName.value,
      this.state.password.value,
      this.state.email.value
    );

    if (!trySignUp.success) {
      this.props.enqueueSnackbar(`There was an error: ${trySignUp}`, {
        variant: "error",
      });
      this.setState({ error: trySignUp, signingIn: false });
    } else {
      this.props.enqueueSnackbar("You've successfully signed up!", {
        variant: "success",
      });
      this.props.history.push(ROUTES.PROJECT);
    }
  }

  submissionErrorInfo() {
    if (this.checkAll()) {
      const components = Object.keys(this.errors);
      for (let i = 0; i < components.length; i++) {
        let validation = this.validateInput(
          this.state[components[i]].value,
          components[i]
        );
        if (validation > -1)
          this.setState({
            [components[i]]: {
              ...this.state[components[i]],
              valid: false,
              helper: validation,
            },
          });
      }
    }
    return false;
  }

  async componentDidMount() {
    if (this.props.authUser) this.props.history.push(ROUTES.PROJECT);
    this.props.updateHash();
  }

  render() {
    const { classes } = this.props;
    const {
      username,
      password,
      email,
      firstName,
      lastName,
      confirmPassword,
      signingIn,
    } = this.state;

    let usernameError = !username.valid,
      passwordError = !password.valid,
      emailError = !email.valid,
      confirmPasswordError = !confirmPassword.valid;
    let usernameHelper =
        !username.valid && this.errors.username[username.helper],
      passwordHelper = !password.valid && this.errors.password[password.helper],
      emailHelper = !email.valid && this.errors.email[email.helper],
      confirmPasswordHelper =
        !confirmPassword.valid &&
        this.errors.confirmPassword[confirmPassword.helper];

    let disabled = this.checkAll();

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} onSubmit={this.onSignUp} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="username"
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  error={usernameError}
                  helperText={usernameError && usernameHelper}
                  value={this.state.username.value}
                  onChange={this.setValue}
                  onBlur={this.checkEvent}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  error={emailError}
                  helperText={emailError && emailHelper}
                  value={this.state.email.value}
                  onChange={this.setValue}
                  onBlur={this.checkEvent}
                />
              </Grid>
              <Grid item xs={12}>
                <NameInput
                  variant="outlined"
                  first={{
                    firstName: firstName.value,
                    firstNameError: !firstName.valid,
                    firstNameHelper:
                      !firstName.valid &&
                      this.errors.firstName[firstName.helper],
                  }}
                  last={{
                    lastName: lastName.value,
                    lastNameError: !lastName.valid,
                    lastNameHelper:
                      !lastName.valid && this.errors.lastName[lastName.helper],
                  }}
                  onChange={this.setValue}
                  onBlur={this.checkEvent}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={this.state.showPassword ? "text" : "password"}
                  id="password"
                  error={passwordError}
                  helperText={passwordError && passwordHelper}
                  value={this.state.password.value}
                  onChange={this.setValue}
                  onBlur={this.checkEvent}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={this.handleClickShowPassword}
                          onMouseDown={this.handleMouseDownPassword}
                          tabIndex="-1"
                        >
                          {this.state.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={this.state.showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  error={confirmPasswordError}
                  helperText={confirmPasswordError && confirmPasswordHelper}
                  value={this.state.confirmPassword.value}
                  onChange={this.setValue}
                  onBlur={this.checkEvent}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={this.handleClickShowConfirmPassword}
                          onMouseDown={this.handleMouseDownConfirmPassword}
                          tabIndex="-1"
                        >
                          {this.state.showConfirmPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            {signingIn ? (
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                className={`${classes.submit} ${classes.noHover}`}
                endIcon={<FiLoader />}
              >
                Loading
              </Button>
            ) : (
              <div onClick={this.submissionErrorInfo}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={this.onSignUp}
                  disabled={disabled}
                >
                  Sign Up
                </Button>
              </div>
            )}
            <Grid container justify="flex-end">
              <Grid item>
                <Link component={RouterLink} to={ROUTES.HOME} variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>

            <Typography color="error">{this.state.error}</Typography>
          </form>
        </div>
      </Container>
    );
  }
}

export default compose(withSnackbar, withRouter, withStyles(styles))(SignUp);
