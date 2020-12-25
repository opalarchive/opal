import React from "react";

import * as ROUTES from "../Constants/routes";

import { RouteComponentProps, withRouter } from "react-router-dom";
import { auth, getUsernames, createUser } from "../Firebase";

interface SignUpProps extends RouteComponentProps {}

interface SignUpState {
  email: string;
  password: string;
  username: string;
  error: string;
  confirmEmail: string;
  confirmPassword: string;
  usernames: string[];
  loading: boolean;
  login: boolean;
}

class SignUp extends React.Component<SignUpProps, SignUpState> {
  state = {
    email: "",
    password: "",
    username: "",
    error: "",
    confirmEmail: "",
    confirmPassword: "",
    usernames: [] as string[],
    loading: true,
    login: false,
  };

  constructor(props: SignUpProps) {
    super(props);

    this.inputChanged = this.inputChanged.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  async componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) this.props.history.push(ROUTES.PROJECT);
    });
    getUsernames().then((usernames) => {
      if (usernames.success) {
        this.setState({ usernames: usernames.value, loading: false });
      }
    });
  }

  inputChanged(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    } as Pick<SignUpState, "email" | "password" | "username" | "confirmEmail" | "confirmPassword">);
  }

  async onLogin(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    console.log(this.state.email + " " + this.state.password);
    auth
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch((error) => {
        console.log(error.code);
        this.setState({
          error: error.code,
        });
      });
  }

  async onSignUp(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    const attempt = await createUser(
      this.state.username,
      this.state.password,
      this.state.email
    );
    if (!attempt.success) {
      this.setState({
        error: attempt.value,
      });
    } else {
      this.setState({
        error: "",
      });
    }
  }

  render() {
    //console.log(this.state.isMobile)
    const {
      username,
      email,
      password,
      usernames,
      confirmEmail,
      confirmPassword,
      login,
    } = this.state;
    //Check if we are valid to submit
    const usernameValid =
      login || //You're logging in
      (!!username && (!usernames || !usernames.includes(username)));
    const emailValid =
      email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$/) && //Matches the email format
      (login || email === confirmEmail); //Either we login (no confirm) or the email + confirm are same
    const passwordValid =
      (login && password) ||
      (password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*{}"'`/,._[\]~\-+])[a-zA-Z\d\w\W]{8,}$/
      ) && //Matches 8 characters, one capital, one lowercase, numeric, and special character
        password === confirmPassword); //Either we log in (no confirm) or the password + confirm are same
    const isValid = usernameValid && emailValid && passwordValid;

    return (
      <div>
        <header>
          <div>
            <div>
              <div>
                <div>
                  <p>Have an account?</p>
                  <div>Log in</div>
                </div>
                <div>
                  <p>Don't have an account?</p>
                  <div>Sign up</div>
                </div>
              </div>
              <div>
                {" "}
                <input
                  name="email"
                  placeholder="Email"
                  type="text"
                  onChange={this.inputChanged}
                  value={email}
                />
                <input
                  name="password"
                  placeholder="Password"
                  type="Password"
                  onChange={this.inputChanged}
                  value={password}
                />
                <div
                  onClick={(event: React.MouseEvent<HTMLDivElement>) =>
                    isValid && this.onLogin(event)
                  }
                >
                  Log in
                </div>
              </div>
              <div>
                <input
                  name="email"
                  placeholder="Email"
                  type="text"
                  onChange={this.inputChanged}
                  value={email}
                />
                <input
                  name="confirmEmail"
                  placeholder="Confirm Email"
                  type="text"
                  onChange={this.inputChanged}
                  value={confirmEmail}
                />
                <input
                  name="username"
                  placeholder="Username"
                  type="text"
                  onChange={this.inputChanged}
                  value={username}
                />
                <input
                  name="password"
                  placeholder="Password"
                  type="Password"
                  onChange={this.inputChanged}
                  value={password}
                />
                <input
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  type="Password"
                  onChange={this.inputChanged}
                  value={confirmPassword}
                />
                <div
                  onClick={(event: React.MouseEvent<HTMLDivElement>) =>
                    isValid && this.onSignUp(event)
                  }
                >
                  Sign up
                </div>
              </div>
            </div>
            <div>{this.state.error}</div>
          </div>
        </header>
      </div>
    );
  }
}

export default withRouter(SignUp);
