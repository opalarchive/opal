import {
  withStyles,
  WithStyles,
  WithTheme,
  withTheme,
} from "@material-ui/core";
import React from "react";
import { FiPlus } from "react-icons/fi";
import { compose } from "recompose";
import { data, problemAction } from "../../../../../../../.shared";
import styles from "./index.css";

interface TagProps {
  text: string;
  clicked: boolean;
  onClickTag?: (tagText: string) => void;
  onClickAddTag?: () => void;
  style?: React.CSSProperties;
  tryProblemAction?: (data: data, type: problemAction) => Promise<void>;
  filterTag?: boolean;
  addTag?: boolean;
}

class Tag extends React.PureComponent<
  TagProps & WithStyles<typeof styles> & WithTheme
> {
  constructor(props: TagProps & WithStyles<typeof styles> & WithTheme) {
    super(props);
  }

  render() {
    const {
      text,
      clicked,
      onClickTag,
      onClickAddTag,
      tryProblemAction,
      filterTag,
      addTag,
      style,
      classes,
      theme,
    } = this.props;

    // a simple tag that can only be used as filtering by clicking on it
    if (filterTag) {
      return (
        <span
          className={`${classes.tag} ${classes.tagBody}`}
          style={{
            ...(clicked
              ? { backgroundColor: theme.palette.secondary.light }
              : {}),
            ...style,
          }}
          onClick={
            !!onClickTag
              ? (e: React.MouseEvent<HTMLSpanElement>) => onClickTag(text)
              : undefined
          }
        >
          {text.replace(/ /g, "\u00a0")}
        </span>
      );
    }

    // not a real tag, but just a "+" sign for adding new tags that should have the same stylings as a tag
    if (addTag) {
      return (
        <span
          className={`${classes.tag} ${classes.addTag}`}
          style={style}
          onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
            !!onClickAddTag && onClickAddTag()
          }
        >
          <FiPlus className={classes.icon} />
        </span>
      );
    }

    // normal tag with click to filter and x to remove

    return (
      <span
        className={`${classes.tag} ${classes.tagBody}`}
        style={{
          ...(clicked
            ? { backgroundColor: theme.palette.secondary.light }
            : {}),
          ...style,
        }}
      >
        <span
          className={classes.tagText}
          onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
            !!onClickTag && onClickTag(text)
          }
        >
          {text.replace(/ /g, "\u00a0")}
        </span>
        <span
          onClick={() =>
            !!tryProblemAction && tryProblemAction(text, "removeTag")
          }
        >
          X
        </span>
      </span>
    );
  }
}

export default compose<
  TagProps & WithStyles<typeof styles> & WithTheme,
  TagProps
>(
  withStyles(styles),
  withTheme
)(Tag);
