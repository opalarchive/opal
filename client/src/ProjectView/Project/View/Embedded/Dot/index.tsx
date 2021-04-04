import { withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { RGB } from "../../../../../../../.shared/src";
import { RGBToString } from "../../../../../Constants";
import styles from "./index.css";

interface DotProps extends WithStyles<typeof styles> {
  color?: RGB;
  style?: React.CSSProperties;
}

const Dot: React.FC<DotProps> = ({ color, style, classes }) => {
  return (
    <div
      className={classes.dot}
      style={{
        ...(!!color ? { backgroundColor: RGBToString(color) } : {}),
        ...style,
      }}
    />
  );
};
export default withStyles(styles)(Dot);
