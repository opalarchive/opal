import {
  withStyles,
  WithStyles,
  WithTheme,
  withTheme,
} from "@material-ui/core";
import React from "react";
import { compose } from "recompose";
import styles from "./index.css";

interface TagProps {
  text: string;
  clicked: boolean;
  onClickTag?: (tagText: string) => void;
  style?: React.CSSProperties;
}

const Tag: React.FC<TagProps & WithStyles<typeof styles> & WithTheme> = ({
  text,
  clicked,
  onClickTag,
  style,
  classes,
  theme,
}) => {
  return (
    <span
      className={classes.tag}
      style={{
        ...(clicked ? { backgroundColor: theme.palette.secondary.light } : {}),
        ...style,
      }}
      onClick={
        !!onClickTag
          ? (e: React.MouseEvent<HTMLSpanElement>) => onClickTag(text)
          : undefined
      }
    >
      {text.replace(/ /g, "\u00a0")}{" "}
    </span>
  );
};
export default compose<
  TagProps & WithStyles<typeof styles> & WithTheme,
  TagProps
>(
  withStyles(styles),
  withTheme
)(Tag);
