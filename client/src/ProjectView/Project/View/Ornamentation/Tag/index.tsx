import {
  withStyles,
  WithStyles,
  WithTheme,
  withTheme,
  Theme,
  TextField,
  Button,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { FaCheck } from "react-icons/fa";
import React from "react";
import { compose } from "recompose";
import {data, problemAction } from "../../../../../../../.shared";
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

interface TagState {
  hoverRemoveTag: boolean;
  hoverAddTag: boolean;
  editAddTag: boolean;
  inputAddTag: string;
}

class Tag extends React.PureComponent<TagProps & WithStyles<typeof styles> & WithTheme, TagState> {
  state = {
    hoverRemoveTag: false,
    hoverAddTag: false,
    editAddTag: false,
    inputAddTag: "",
  }

  constructor(props: TagProps & WithStyles<typeof styles> & WithTheme) {
    super(props);

    this.hoverRemoveTag = this.hoverRemoveTag.bind(this);
    this.unHoverRemoveTag = this.unHoverRemoveTag.bind(this);
    this.hoverAddTag = this.hoverAddTag.bind(this);
    this.unHoverAddTag = this.unHoverAddTag.bind(this);
  }

  hoverRemoveTag() {
    this.setState({ hoverRemoveTag: true });
  }

  unHoverRemoveTag() {
    this.setState({ hoverRemoveTag: false });
  }

  hoverAddTag() {
    this.setState({ hoverAddTag: true });
  }

  unHoverAddTag() {
    this.setState({ hoverAddTag: false });
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

    return (
      <>
        {filterTag ? (
            <span
              className={classes.abnormalTag}
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
          ) : (
            <>
              {addTag ? (
                <span
                  className={classes.abnormalTag}
                  style={{
                    ...(this.state.hoverAddTag ? { backgroundColor: theme.palette.secondary.light } : {}),
                    ...style,
                  }}
                  onMouseEnter={this.hoverAddTag}
                  onMouseLeave={this.unHoverAddTag}
                  onClick={!!onClickAddTag ? (e: React.MouseEvent<HTMLSpanElement>) => onClickAddTag() : undefined}
                >
                  +
                </span>
              ) : (
                <>
                  <span
                    className={classes.tagText}
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
                    {text.replace(/ /g, "\u00a0")}
                  </span>
                  <span
                    className={classes.tagRemove}
                    style={{
                      ...(this.state.hoverRemoveTag ? { backgroundColor: theme.palette.secondary.light } : {}),
                      ...style,
                    }}
                    onMouseEnter={this.hoverRemoveTag}
                    onMouseLeave={this.unHoverRemoveTag}
                    onClick={!!tryProblemAction ? () => tryProblemAction(text, "removeTag") : () => undefined}
                  >
                    X
                  </span>
                </>
              )}
            </>
          )
        }
      </>
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
