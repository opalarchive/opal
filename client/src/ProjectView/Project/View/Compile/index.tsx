import { withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { CategoryColors } from "..";

import {
  ProjectPrivate,
  Problem as ProblemType,
} from "../../../../../../.shared";
import { ProblemDetails, tryProblemAction } from "../../../../Constants/types";
import ScrollBase, { ScrollBaseProps } from "../../../Template/ScrollBase";
import styles from "./index.css";

interface CompileProps extends WithStyles<typeof styles> {
  menuBaseProps: Omit<ScrollBaseProps, "Sidebar" | "children">;
  project: ProjectPrivate;
  uuid: string;
  categoryColors: CategoryColors;
  difficultyRange: { start: number; end: number };
  editors: string[];
  problemProps: (
    uuid: string,
    prob: ProblemType,
    tryProblemAction: tryProblemAction,
    authUser: firebase.User
  ) => ProblemDetails;
  tryProblemAction: tryProblemAction;
  authUser: firebase.User;
}

class Compile extends React.Component<CompileProps> {
  render() {
    const {
      menuBaseProps,
      project,
      categoryColors,
      editors,
      problemProps,
      uuid,
      tryProblemAction,
      authUser,
      classes,
    } = this.props;

    return <div className={classes.root}>wen</div>;
  }
}

export default withStyles(styles)(Compile);
