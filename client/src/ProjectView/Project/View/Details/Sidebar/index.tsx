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

const Sidebar: React.FC<
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
        {/* TODO: add details/actions here */}
      </Paper>
    </div>
  );
};

export default compose<
  SidebarProps & WithStyles<typeof styles> & WithTheme,
  SidebarProps
>(
  withStyles(styles),
  withTheme
)(Sidebar);