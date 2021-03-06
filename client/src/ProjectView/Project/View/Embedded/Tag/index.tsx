import {
  withStyles,
  WithStyles,
  WithTheme,
  withTheme,
} from "@material-ui/core";
import React from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { compose } from "recompose";
import { actionData, problemAction } from "../../../../../../../.shared/src";
import styles from "./index.css";

interface TagProps {
  text: string;
  clicked: boolean;
  onClickTag?: (tagText: string) => void;
  onClickAddTag?: () => void;
  style?: React.CSSProperties;
  tryProblemAction?: (data: actionData, type: problemAction) => Promise<void>;
  filterTag?: boolean;
  addTag?: boolean;
}

class Tag extends React.PureComponent<
  TagProps & WithStyles<typeof styles> & WithTheme
> {
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

    let tag: JSX.Element = <></>;

    if (filterTag) {
      // a simple tag that can only be used as filtering by clicking on it
      tag = (
        <span
          className={`${classes.tag} ${classes.tagBody} ${classes.pointer}`}
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
    } else if (addTag) {
      // not a real tag, but just a "+" sign for adding new tags that should have the same stylings as a tag
      tag = (
        <span
          className={`${classes.tag} ${classes.addTag}`}
          style={style}
          onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
            !!onClickAddTag && onClickAddTag()
          }
        >
          <FiPlus className={`${classes.icon} ${classes.pointer}`} />
        </span>
      );
    } else {
      // normal tag with click to filter and x to remove
      tag = (
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
            className={`${classes.tagText}${
              !!onClickTag ? ` ${classes.pointer}` : ""
            }`} // add pointer on hover if clicking does something
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
            <FiX className={`${classes.icon} ${classes.pointer}`} />
          </span>
        </span>
      );
    }
    return <>{tag}&#8203;</>; // zero width space, makes it so that double clicking on a tag doesn't select adjacent ones as well (separates without adding space)
  }
}

export default compose<
  TagProps & WithStyles<typeof styles> & WithTheme,
  TagProps
>(
  withStyles(styles),
  withTheme
)(Tag);
