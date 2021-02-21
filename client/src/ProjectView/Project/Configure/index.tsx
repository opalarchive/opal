import React from "react";
import {
  Button,
  Link,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import ScrollBase from "../../Template/ScrollBase";
import styles from "./index.css";
import { isConfig } from "../../../../../.shared";
import { configureProject } from "../../../Firebase";

interface ConfigureProps extends WithStyles<typeof styles> {
  uuid: string;
  background: string;
  authUser: firebase.User;
  refresh: (uuid: string, authUser: firebase.User) => Promise<void>;
}

interface ConfigureState {
  databaseURL: string;
  urlTouched: boolean;
  config: string;
  configTouched: boolean;
  fail: boolean;
  step: number;
}

const stepLabels = [
  "Create a Firebase project",
  "Create a Firebase Realtime Database",
  "Link the database with your Opal project",
];

class Configure extends React.Component<ConfigureProps, ConfigureState> {
  state = {
    databaseURL: "",
    urlTouched: false,
    config: "",
    configTouched: false,
    fail: false,
    step: 0,
  };

  constructor(props: ConfigureProps) {
    super(props);

    this.onClickNext = this.onClickNext.bind(this);
    this.onClickBack = this.onClickBack.bind(this);
    this.onChangeURL = this.onChangeURL.bind(this);
    this.onBlurURL = this.onBlurURL.bind(this);
    this.onChangeConfig = this.onChangeConfig.bind(this);
    this.onBlurConfig = this.onBlurConfig.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onClickNext() {
    if (this.state.step + 1 === stepLabels.length) {
      const works = await this.onSubmit();
      if (!works) {
        this.setState({ fail: true });
      } else {
        await this.props.refresh(this.props.uuid, this.props.authUser);
      }
      return;
    }

    this.setState({ step: this.state.step + 1 });
  }

  onClickBack() {
    this.setState({ step: this.state.step - 1 });
  }

  onChangeURL(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ databaseURL: event.target.value });
  }
  onBlurURL(event: React.FocusEvent<HTMLInputElement>) {
    this.setState({ urlTouched: true });
  }

  onChangeConfig(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ config: event.target.value });
  }
  onBlurConfig(event: React.FocusEvent<HTMLInputElement>) {
    this.setState({ configTouched: true });
  }

  async onSubmit() {
    const config = {
      ...JSON.parse(this.state.config),
      databaseURL: this.state.databaseURL,
    };
    if (isConfig(config)) {
      const attempt = await configureProject(
        this.props.uuid,
        config,
        this.props.authUser
      );
      return attempt.success;
    }
    return false;
  }

  render() {
    const { background, classes } = this.props;
    const {
      databaseURL,
      urlTouched,
      config,
      configTouched,
      fail,
      step,
    } = this.state;

    let isConfigValid = false;

    try {
      isConfigValid = isConfig({ ...JSON.parse(config), databaseURL });
    } catch (e) {}

    const stepError = [
      false,
      urlTouched && !databaseURL,
      configTouched && !isConfigValid,
    ];
    const stepProgress = [true, !!databaseURL, isConfigValid];

    const stepContent = [
      <>
        Opal uses Firebase to store problems and other data.
        <ol>
          <li>
            Create a{" "}
            <Link href="https://accounts.google.com/signup">
              Google account
            </Link>{" "}
            and head to the{" "}
            <Link href="https://console.firebase.google.com/">
              Firebase console
            </Link>
            . Click <span className={classes.emphasized}>Create a project</span>{" "}
            or <span className={classes.emphasized}>Add project</span> on the
            left hand side of the screen to create a new Firebase project.
          </li>
          <li>
            Enter a project name and accept the Firebase terms. Then, click{" "}
            <span className={classes.emphasized}>continue</span>. Turn off
            default Google Analytics and click{" "}
            <span className={classes.emphasized}>Create project</span>.
          </li>
          <li>
            You should end up on a page that says{" "}
            <span className={classes.emphasized}>
              Your new project is ready
            </span>{" "}
            and a blue continue button. Click{" "}
            <span className={classes.emphasized}>continue</span>, and move on to
            the next step.
          </li>
        </ol>
      </>,
      <>
        This creates a database where Opal can store its information.
        <ol>
          <li>
            You should be on the Firebase project overview page. A project with
            project id <span className={classes.emphasized}>example-id</span>{" "}
            will have overview page url{" "}
            <span className={classes.emphasized}>
              https://console.firebase.google.com/project/example-id/overview
            </span>
            .
          </li>
          <li>
            Click <span className={classes.emphasized}>Build</span> on the left
            hand menu, which should open a smaller menu with sections{" "}
            <span className={classes.emphasized}>Authentication</span>,{" "}
            <span className={classes.emphasized}>Cloud Firestore</span>,{" "}
            <span className={classes.emphasized}>Realtime Database</span>, etc.
            Click on{" "}
            <span className={classes.emphasized}>Realtime Database</span>.
          </li>
          <li>
            Click <span className={classes.emphasized}>Create Database</span>.
            It will open a popup with the option to pick your database location.
            Pick a location that is closest to the people who will be using this
            project decrease latency. The default location is most likely good.
            Click <span className={classes.emphasized}>Next</span>
          </li>
          <li>
            Keep it in locked mode, so that no one else can edit. Click{" "}
            <span className={classes.emphasized}>Enable</span> on the next page.
            Your generate now.
          </li>
          <li>
            Click the link next to the link icon and above the database. Copy
            that link and paste it below. It should be of the form{" "}
            <span className={classes.emphasized}>
              https://example-id.firebaseio.com/
            </span>{" "}
            or{" "}
            <span className={classes.emphasized}>
              https://example-idexample-region.firebasedatabase.app/
            </span>
          </li>
        </ol>{" "}
        <div className={classes.inputWrapper}>
          <TextField
            variant="filled"
            fullWidth
            label="Database URL"
            value={databaseURL}
            error={stepError[1]}
            helperText={stepError[1] && "Enter a url"}
            onChange={this.onChangeURL}
            onBlur={this.onBlurURL}
          />
        </div>
      </>,
      <>
        This gives Opal full access to your newly made project and the database.
        <ol>
          <li>
            Click the gear at the right of the{" "}
            <span className={classes.emphasized}>Project Overview</span> button,
            then click the first option,{" "}
            <span className={classes.emphasized}>Project settings</span>.
          </li>
          <li>
            In the tabs below the{" "}
            <span className={classes.emphasized}>Project settings</span> title,
            click the{" "}
            <span className={classes.emphasized}>Service accounts</span> tab.
          </li>
          <li>
            Scroll to the very bottom and click{" "}
            <span className={classes.emphasized}>Generate new private key</span>
            . This gives Opal access to your Firebase project, and as such, your
            Firebase Realtime Database as well. Click{" "}
            <span className={classes.emphasized}>Generate key</span>. You will
            download a JSON file.
          </li>
          <li>Open said JSON file and copy the contents below.</li>
        </ol>
        <div className={classes.inputWrapper}>
          <TextField
            variant="filled"
            fullWidth
            label="Project Configuration"
            value={config}
            error={stepError[2]}
            helperText={stepError[2] && "This configuration is invalid."}
            onChange={this.onChangeConfig}
            onBlur={this.onBlurConfig}
          />
          {fail && (
            <div className={classes.error}>
              Invalid Database URL or invalid Project Configuration. Please try
              again.
            </div>
          )}
        </div>
      </>,
    ];

    return (
      <ScrollBase maxWidth={1024} background={background}>
        <div className={classes.root}>
          <Paper elevation={3} className={classes.paper}>
            <div className={classes.title}>Configure Your Project</div>
            <Stepper activeStep={step} alternativeLabel>
              {stepLabels.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <div>
              <div>
                <div className={classes.content}>
                  <div className={classes.subtitle}>{stepLabels[step]}</div>
                  {stepContent[step]}
                </div>
                <div>
                  <Button disabled={step === 0} onClick={this.onClickBack}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!stepProgress[step]}
                    onClick={this.onClickNext}
                  >
                    {step === stepLabels.length - 1 ? "Finish" : "Continue"}
                  </Button>
                </div>
              </div>
            </div>
          </Paper>
        </div>
      </ScrollBase>
    );
  }
}

export default withStyles(styles)(Configure);
