import { withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { CategoryColors, ViewSectionProps } from "../..";

import { Problem as ProblemType } from "../../../../../../../.shared";
import {
  ProblemDetails,
  tryProblemAction,
} from "../../../../../Constants/types";
import styles from "./index.css";

interface CompileProps extends WithStyles<typeof styles>, ViewSectionProps {
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
}

class Compile extends React.Component<CompileProps> {
  render() {
    const {
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
        {/* TODO add problem compilation code. The above props are recommended */}
      </div>
    );
  }
}

export default withStyles(styles)(Compile);
