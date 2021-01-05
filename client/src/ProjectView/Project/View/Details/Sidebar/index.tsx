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
    <div className={classes.root} style={{ width: `${width}rem` }}>
      <div className={classes.wrapper}>
        <Paper elevation={3}>asfd{/* TODO: add details/actions here */}</Paper>
      </div>
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
