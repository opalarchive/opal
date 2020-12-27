import React from "react";

import {
  Button,
  darken,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  WithStyles,
  withStyles,
  WithTheme,
  withTheme,
} from "@material-ui/core";
import {
  AlignLeft,
  CornerRightUp,
  Edit2,
  Link2,
  MessageSquare,
} from "react-feather";
import Latex from "../../../../../Constants/latex";
import { formatTime } from "../../../../../Constants";
import * as ROUTES from "../../../../../Constants/routes";
import { compose } from "recompose";
import { problemAction, reply, ReplyType } from "../../../../../../../.shared";
import styles from "./index.css";

interface ReplyPropsBase {
  uuid: string;
  ind: string;
  reply: string;
  content?: reply;
  isHighlighted: boolean;
  tryProblemAction: (
    data: string | number,
    type: problemAction
  ) => Promise<void>;
}

type ReplyProps = WithStyles<typeof styles> & WithTheme & ReplyPropsBase;

class ReplyBase<State> extends React.Component<ReplyProps, State> {
  constructor(props: ReplyProps) {
    super(props);

    this.getText = this.getText.bind(this);
  }

  isLinkable() {
    return true;
  }

  getText(classes: WithStyles<typeof styles>["classes"], text: string) {
    return (
      <div className={classes.text}>
        <Latex>{text}</Latex>
      </div>
    );
  }

  getIcon() {
    return MessageSquare;
  }

  render() {
    const {
      classes,
      theme,
      content,
      uuid,
      ind,
      reply,
      isHighlighted,
    } = this.props;

    const Icon = this.getIcon();
    const linkPrefix = window.location.href.substr(
      0,
      window.location.href.indexOf(window.location.pathname)
    );

    const link =
      linkPrefix +
      ROUTES.PROJECT_PROBLEM_REPLY.replace(":uuid", uuid)
        .replace(":ind", ind)
        .replace(":reply", reply);

    return (
      <div className={classes.root}>
        <Paper elevation={3} className={`${classes.reply}`}>
          {this.isLinkable() && !!content && (
            <div className={classes.top}>
              <div className={classes.author}>{content.author}</div>
              <div className={classes.time}>{formatTime(content.time)}</div>
              <div className={classes.filler} />
              <div className={classes.actions}>
                <Tooltip title="Get Link" aria-label="get link">
                  <IconButton
                    className={classes.linkIcon}
                    onClick={() => {
                      navigator.clipboard.writeText(link);
                    }}
                  >
                    <Link2 size="1.2rem" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          )}
          {this.getText(classes, !!content ? content.text : "")}
        </Paper>

        <Paper elevation={3} className={`${classes.iconPaper}`}>
          <Icon
            className={classes.icon}
            stroke={
              isHighlighted
                ? darken(theme.palette.secondary.main, 0.1)
                : "currentColor"
            }
            fill={
              isHighlighted ? darken(theme.palette.secondary.main, 0.1) : "none"
            }
          />
          <div className={classes.iconBodge} />
        </Paper>
      </div>
    );
  }
}

interface SolutionState {
  revealed: boolean;
}

class Solution extends ReplyBase<SolutionState> {
  state = {
    revealed: false,
  };

  constructor(props: ReplyProps) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e: React.MouseEvent<HTMLSpanElement>) {
    e.preventDefault();

    this.setState({ revealed: !this.state.revealed });
  }

  getText(classes: WithStyles<typeof styles>["classes"], text: string) {
    return (
      <>
        <div className={classes.text}>
          <span className={classes.reveal} onClick={this.handleClick}>
            {this.state.revealed ? "Hide" : "Reveal"} Solution
          </span>
        </div>
        {this.state.revealed && (
          <div className={classes.text}>
            <Latex>{text}</Latex>
          </div>
        )}
      </>
    );
  }

  getIcon() {
    return AlignLeft;
  }
}

interface WriteCommentState {
  input: string;
}

export class WriteComment extends ReplyBase<WriteCommentState> {
  state = {
    input: "",
  };

  constructor(props: ReplyProps) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmitComment = this.handleSubmitComment.bind(this);
  }

  handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    let input = e.target.value;
    if (input.length > 4000) {
      input = input.slice(0, 4000);
    }

    this.setState({ input });
  }

  handleSubmitComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (this.state.input.length < 8) return;

    this.props.tryProblemAction(this.state.input, "comment");
    this.setState({ input: "" });
  }

  isLinkable() {
    return false;
  }

  getText(classes: WithStyles<typeof styles>["classes"], text: string) {
    return (
      <form
        onSubmit={this.handleSubmitComment}
        autoComplete="off"
        className={classes.input}
      >
        <TextField
          autoFocus
          margin="dense"
          id="comment"
          label="Comment"
          type="text"
          value={this.state.input}
          onChange={this.handleInputChange}
          fullWidth
          multiline
        />
        <div className={classes.inputRight}>
          <div className={classes.inputRightFiller} />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            endIcon={
              <CornerRightUp
                className={`${classes.icon} ${classes.submitIcon}`}
              />
            }
            disabled={this.state.input.length < 8}
          >
            Submit
          </Button>
        </div>
      </form>
    );
  }
  getIcon() {
    return Edit2;
  }
}

const Reply: React.FC<ReplyProps> = (props) => {
  if (!props.content) {
    return <WriteComment {...props} />;
  }

  switch (ReplyType[props.content.type]) {
    case ReplyType.COMMENT:
      return <ReplyBase {...props} />;
    case ReplyType.SOLUTION:
      return <Solution {...props} />;
    default:
      return <ReplyBase {...props} />;
  }
};

export default compose<ReplyProps, ReplyPropsBase>(
  withStyles(styles),
  withTheme
)(Reply);
