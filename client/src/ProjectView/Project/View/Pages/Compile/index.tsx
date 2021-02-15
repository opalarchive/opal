import { withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { CategoryColors, ViewSectionProps } from "../..";

import { Problem as ProblemType, Server } from "../../../../../../../.shared";
import {
  FrontendProblem,
  problemFunctions,
  problemProps,
  tryProblemAction,
  tryProblemActionPrivileged,
} from "../../../../../Constants/types";
import styles from "./index.css";

interface CompileProps extends WithStyles<typeof styles>, ViewSectionProps {
  difficultyRange: { start: number; end: number };
  editors: Server.Editors;
  problemProps: problemProps;
  problemFunctions: problemFunctions;
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
