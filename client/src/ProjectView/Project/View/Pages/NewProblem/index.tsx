import { withStyles, WithStyles, TextField, Slider, Button, Paper } from "@material-ui/core";
import React from "react";
import { CategoryColors, ViewSectionProps } from "../..";

import { Problem as ProblemType, Server, Votes } from "../../../../../../../.shared";
import {
  FrontendProblem,
  tryProblemAction,
  newProblem,
  tryProblemActionPrivileged,
} from "../../../../../Constants/types";
import TagGroup from "../../Embedded/TagGroup";
import styles from "./index.css";
import { FiChevronLeft, FiPlus } from "react-icons/fi";
import { compose } from "recompose";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import * as ROUTES from "../../../../../Constants/routes";
import { tupleToRGBString } from "../../../../../Constants/index";
import Dot from "../../Embedded/Dot";

interface NewProblemProps extends ViewSectionProps {
  categoryColors: CategoryColors;
  difficultyRange: { start: number; end: number };
  editors: Server.Editors;
  problemProps: (
    uuid: string,
    prob: ProblemType,
    tryProblemAction: tryProblemAction,
    tryProblemActionPrivileged: tryProblemActionPrivileged,
    authUser: firebase.User
  ) => FrontendProblem;
  tryProblemAction: tryProblemAction;
  newProblem: newProblem;
}

interface NewProblemState {
  title: string;
  text: string;
  category: string;
  difficulty: number;
}

class NewProblem extends React.Component<NewProblemProps & WithStyles<typeof styles> & RouteComponentProps<any>, NewProblemState> {

  state = {
    title: "",
    text: "",
    category: "miscellaneous",
    difficulty: 0,
  }

  private top = React.createRef<HTMLDivElement>();
  private prob = React.createRef<HTMLDivElement>();

  constructor(props: NewProblemProps & WithStyles<typeof styles> & RouteComponentProps & ViewSectionProps) {
    super(props);

    this.newProblem = this.newProblem.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  newProblem() {
    const uid = !!this.props.authUser.uid
      ? this.props.authUser.uid
      : "";
    const { uuid, project } = this.props;
    var { title, text, category, difficulty } = this.state;
    if (title.length == 0) {
      title = "Untitled";
    }
    if (text.length == 0) {
      text = "Empty";
    }
    if (!["algebra", "geometry", "numberTheory", "combinatorics"].includes(category)) {
      category = "miscellaneous";
    }
    this.props.newProblem({ author: uid, title, text, category, difficulty, replies: [], votes: {} as Votes, tags: [] });
    this.props.history.push(ROUTES.PROJECT_PROBLEM.replace(":uuid", uuid).replace(":ind", `${project.problems.length-1}`));
  }

  onChange(field: string, value: string | number | number[]) {
    switch (field) {
      case "title":
        if (typeof value != "string") {
          break;
        }

        this.setState({ title: value });

        break;
      case "text":
        if (typeof value != "string") {
          break;
        }

        this.setState({ text: value });

        break;
      case "category":
        if (typeof value != "string") {
          break;
        }

        this.setState({ category: value });

        break;
      case "difficulty":
        if (typeof value != "number") {
          break;
        }

        this.setState({ difficulty: value });

        break;
      default:
        break;
    }
  }

  render() {
    const {
      // height,
      project,
      // categoryColors,
      // editors,
      // problemProps,
      uuid,
      // tryProblemAction,
      authUser,
      classes,
      getCategoryColor,
      getDifficultyColor,
    } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.top} ref={this.top}>
          <Link
            className={classes.topLink}
            to={ROUTES.PROJECT_VIEW.replace(":uuid", uuid)}
          >
            <FiChevronLeft className={classes.topIcon} />
            Back
          </Link>
          <div className={classes.topFiller} />
        </div>

        <div ref={this.prob}>
          <Paper elevation={3} className={classes.probRoot}>
            <div className={classes.left}>
              <div className={classes.leftIndex}>#{project.problems.length+1}</div>
            </div>
            <div className={classes.body}>
              <div className={classes.bodyTitle}>
                <TextField fullWidth value={this.state.title} id="title" label="Title" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.onChange("title", e.target.value)} />
              </div>
              <div className={classes.bodyAuthor}>Proposed by {!!authUser.displayName && authUser.displayName}</div>
              <div className={classes.bodyText}>
                <TextField fullWidth variant="filled" value={this.state.text} id="text" multiline label="Text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.onChange("text", e.target.value)} />
              </div>
              <div className={classes.bodyFiller} />
            </div>
            <div className={classes.right}>
              <div className={classes.rightCategory}>
                <Dot
                  color={tupleToRGBString(getCategoryColor(["algebra", "geometry", "combinatorics", "numberTheory"].includes(this.state.category) ? this.state.category : "miscellaneous"))}
                  style={{ top: "0.48rem", margin: "0 0.7rem 0 0.2rem" }}
                />
                <TextField value={this.state.category} id="category" label="Category" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.onChange("category", e.target.value)} />
              </div>
              <div className={classes.rightDifficulty}>
                <Dot
                  color={tupleToRGBString(getDifficultyColor(this.state.difficulty))}
                  style={{ top: "0.48rem", margin: "0 0.7rem 0 0.2rem" }}
                />
                <Slider
                  value={this.state.difficulty}
                  onChange={(
                    e: React.ChangeEvent<{}>,
                    value: number | number[]
                  ) => {
                    e.preventDefault();
                    e.stopPropagation();

                    this.onChange("difficulty", value);
                  }}
                  valueLabelDisplay="auto"
                  aria-labelledby="difficulty-header"
                  getAriaValueText={() =>
                    `d-${this.state.difficulty}`
                  }
                />
              </div>
              <div className={classes.rightFiller} />
            </div>
          </Paper>
        </div>
        <Button variant="contained" color="secondary" onClick={() => this.newProblem()}>
          <FiPlus /> Add Problem
        </Button>
      </div>
    );
  }
}

export default compose<NewProblemProps & WithStyles<typeof styles> & RouteComponentProps<any>, NewProblemProps>(withStyles(styles), withRouter)(NewProblem);
