import React from "react";
import styles from "./index.module.css";

import { withRouter } from "react-router-dom";

import { auth, getUsernames, createUser, understandError } from "../Firebase";

class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      username: "",
      error: "",
      confirmEmail: "",
      confirmPassword: "",
      usernames: [],
      loading: true,
      logIn: false,
      isMobile: false
    };

    this.inputChanged = this.inputChanged.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.toggleLogin = this.toggleLogin.bind(this);
    this.onLogIn = this.onLogIn.bind(this);
    this.updateMobile = this.updateMobile.bind(this);
  }

  async componentDidMount() {
    this.updateMobile();
    window.addEventListener('resize', this.updateMobile);
    auth.onAuthStateChanged((user) => {
      if (user) this.props.history.push("/profile");
    });
    getUsernames().then((usernames) =>
      this.setState({ usernames, loading: false })
    );
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateMobile);
  }

  updateMobile() {
    this.setState({isMobile: window.innerWidth < 667});
  }

  inputChanged(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  addActive(event) {
    event.preventDefault();
    Array.from(
      document.getElementsByClassName(styles.container)
    ).forEach((element) => element.classList.toggle(styles.active));
  }

  toggleLogin(event) {
    event.preventDefault();
    Array.from(
      document.getElementsByClassName(styles.container)
    ).forEach((element) => element.classList.toggle(styles.logIn));
    this.setState({ logIn: true });
  }

  async onLogIn(event) {
    event.preventDefault();
    console.log(this.state.email + " " + this.state.password);
    auth
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch((error) => {
        console.log(error.code);
        this.setState({
          error: understandError(error.code)
        });
      });
  }

  async onSignUp(event) {
    event.preventDefault();
    const e = await createUser(
      this.state.username,
      this.state.password,
      this.state.email
    );
    if (e) {
      this.setState({
        error: understandError(e)
      });
      return;
    }
    this.setState({
      success: "You're signed up! Check your email for further instructions",
      error: ""
    });
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
      logIn
    } = this.state;
    //Check if we are valid to submit
    const usernameValid =
      logIn || //You're logging in
      (!!username && (!usernames || !usernames.includes(username)));
    const emailValid =
      email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$/) && //Matches the email format
      (logIn || email === confirmEmail); //Either we login (no confirm) or the email + confirm are same
    const passwordValid =
      (logIn && password) ||
      password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*{}"'`/,._[\]~\-+])[a-zA-Z\d\w\W]{8,}$/
      ) && //Matches 8 characters, one capital, one lowercase, numeric, and special character
      (password === confirmPassword); //Either we log in (no confirm) or the password + confirm are same
    const isValid = usernameValid && emailValid && passwordValid;

    return (
      <div className={styles.app}>
        <header className={styles.appHeader}>
          <div className={`${styles.container} ${styles.logIn}`}>
            <div className={styles.box}></div>
            <div className={styles.containerForms}>
              <div className={styles.containerInfo}>
                <div className={styles.infoItem}>
                  <div className={styles.table}>
                    <div className={`${styles.tableCell} ${this.state.isMobile ? styles.hidden : ""}`}>
                      <p>Have an account?</p>
                      <div className={styles.btn} onClick={this.toggleLogin}>
                        Log in
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.table}>
                    <div className={styles.tableCell}>
                      <p>Don't have an account?</p>
                      <div className={styles.btn} onClick={this.toggleLogin}>
                        Sign up
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.containerForm}>
                <div className={`${styles.formItem} ${styles.logIn}`}>
                  <div className={styles.table}>
                    <div className={styles.tableCell}>
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
                        className={`${styles.btn} ${
                          !isValid ? styles.btnDisabled : ""
                        }`}
                        onClick={(event) => isValid && this.onLogIn(event)}
                        disabled={!isValid}
                      >
                        Log in
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`${styles.formItem} ${styles.signUp}`}>
                  <div className={styles.table}>
                    <div className={styles.tableCell}>
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
                        className={`${styles.btn} ${
                          !isValid ? styles.btnDisabled : ""
                        }`}
                        onClick={(event) => isValid && this.onSignUp(event)}
                        disabled={!isValid}
                      >
                        Sign up
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {this.state.isMobile ? <></> : <><br /><br /><br /><br /></>}
            <div className={styles.error}>{this.state.error}</div>
          </div>
        </header>
      </div>
    );
  }
}

export default withRouter(SignUp);
