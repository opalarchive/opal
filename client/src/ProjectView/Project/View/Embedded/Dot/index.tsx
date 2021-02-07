import { withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import styles from "./index.css";

interface DotProps extends WithStyles<typeof styles> {
  color?: string;
  style?: React.CSSProperties;
}

const Dot: React.FC<DotProps> = ({ color, style, classes }) => {
  return (
    <div className={classes.dot} style={{ backgroundColor: color, ...style }} />
  );
};
export default withStyles(styles)(Dot);
