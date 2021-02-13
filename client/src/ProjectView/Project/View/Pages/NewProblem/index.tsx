import { withStyles, WithStyles, TextField, Slider, Button } from "@material-ui/core";
import React from "react";
import { CategoryColors, ViewSectionProps } from "../..";

import { Problem as ProblemType, Votes } from "../../../../../../../.shared";
import {
  FrontendProblem,
  tryProblemAction,
  newProblem,
} from "../../../../../Constants/types";
import TagGroup from "../../Embedded/TagGroup";
import styles from "./index.css";
import { FiPlus } from "react-icons/fi";
import { compose } from "recompose";
import { withRouter, RouteComponentProps } from "react-router-dom";
import * as ROUTES from "../../../../../Constants/routes";

interface NewProblemProps extends ViewSectionProps {
  categoryColors: CategoryColors;
  difficultyRange: { start: number; end: number };
  editors: string[];
  problemProps: (
    uuid: string,
    prob: ProblemType,
    tryProblemAction: tryProblemAction,
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

  constructor(props: NewProblemProps & WithStyles<typeof styles> & RouteComponentProps & ViewSectionProps) {
    super(props);

    this.newProblem = this.newProblem.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  newProblem() {
    const uid = !!this.props.authUser.uid
      ? this.props.authUser.uid
      : "";
    const { title, text, category, difficulty } = this.state;
    this.props.newProblem({ author: uid, title, text, category, difficulty, replies: [], votes: {} as Votes, tags: [] });
    //this.props.history.push(ROUTES.PROJECT_PROBLEM.replace(":uuid", uuid).replace(":ind", `${project.problems.length}`));
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

        if (!["algebra", "geometry", "numberTheory", "combinatorics"].includes(value)) {
          this.setState({ category: "miscellaneous" })
        } else {
          this.setState({ title: value });
        }

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
      // project,
      // categoryColors,
      // editors,
      // problemProps,
      // uuid,
      // tryProblemAction,
      // authUser,
      classes,
    } = this.props;

    return (
      <div className={classes.root}>
        <TextField value={this.state.title} id="title" label="Title" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.onChange("title", e.target.value)} />
        <TextField value={this.state.text} id="text" multiline label="Text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.onChange("text", e.target.value)} />
        <TextField value={this.state.category} id="category" label="Category" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.onChange("category", e.target.value)} />
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
        <Button variant="contained" color="secondary" onClick={() => this.newProblem()}>
          <FiPlus /> Add Problem
        </Button>
      </div>
    );
  }
}

export default compose<NewProblemProps & WithStyles<typeof styles> & RouteComponentProps<any>, NewProblemProps>(withStyles(styles), withRouter)(NewProblem);
