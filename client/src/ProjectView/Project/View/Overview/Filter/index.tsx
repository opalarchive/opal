import React from "react";

import {
  Paper,
  withStyles,
  WithStyles,
  withTheme,
  WithTheme,
} from "@material-ui/core";
import styles from "./index.css";
import { compose } from "recompose";
import { SidebarProps } from "../../../../MenuBase";

const Filter: React.FC<
  SidebarProps & WithStyles<typeof styles> & WithTheme
> = ({ classes, width, authUser, theme }) => {
  return (
    <div
      className={classes.wrapper}
      style={{ width: `calc(${width}rem - 2 * ${theme.spacing(2)}px)` }}
    >
      <Paper
        elevation={3}
        className={classes.root}
        style={{ height: `calc(100% - ${2 * theme.spacing(2)}px)` }}
      >
        add stuff
      </Paper>
    </div>
  );
};

export default compose<
  SidebarProps & WithStyles<typeof styles> & WithTheme,
  any
>(
  withStyles(styles),
  withTheme
)(Filter);
