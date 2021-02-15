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
  FiAlignLeft,
  FiCornerRightUp,
  FiEdit2,
  FiLink2,
  FiMessageSquare,
} from "react-icons/fi";
import Latex from "../../../../../../Constants/latex";
import { formatTime } from "../../../../../../Constants";
import * as ROUTES from "../../../../../../Constants/routes";
import { compose } from "recompose";
import {
  problemAction,
  problemActionPrivileged,
  reply,
  ReplyType,
} from "../../../../../../../../.shared";
import styles from "./index.css";
import { problemFunctionsObj } from "../../../../../../Constants/types";

interface ReplyPropsBase {
  uuid: string;
  ind: number;
  reply: number;
  content?: reply;
  isHighlighted: boolean;
  problemFunctionsExtracted: problemFunctionsObj;
  authUser: firebase.User;
}

type ReplyProps = WithStyles<typeof styles> & WithTheme & ReplyPropsBase;
interface ReplyBaseState {
  edit: boolean;
  editValue: string;
}

class ReplyBase<State extends ReplyBaseState> extends React.PureComponent<ReplyProps, State> {

  constructor(props: ReplyProps) {
    super(props);
    this.state = { ...this.state, edit: false, editValue: "" };

    this.getText = this.getText.bind(this);
    this.handleEditChange = this.handleEditChange.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
  }

  componentDidMount() {
    this.setState({ editValue: (this.props.content ? this.props.content.text : "") });
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
    return FiMessageSquare;
  }

  handleEditChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    let input = e.target.value;
    if (input.length > 4000) {
      input = input.slice(0, 4000);
    }

    this.setState({ editValue: input });
  }

  handleSubmitEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (this.state.editValue.length < 8) return;

    this.props.problemFunctionsExtracted.tryReplyAction(this.props.reply, this.state.editValue, "edit");
    this.setState({ edit: false });
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
      authUser,
    } = this.props;

    const Icon = this.getIcon();
    const linkPrefix = window.location.href.substr(
      0,
      window.location.href.indexOf(window.location.pathname)
    );

    const link =
      linkPrefix +
      ROUTES.PROJECT_PROBLEM_REPLY.replace(":uuid", uuid)
        .replace(":ind", "" + ind)
        .replace(":reply", "" + reply);

    return (
      <div className={classes.root}>
        <Paper elevation={3} className={`${classes.reply}`}>
          {this.isLinkable() && !!content && (
            <div className={classes.top}>
              <div className={classes.author}>{content.author}</div>
              <div className={classes.time}>{formatTime(content.time)+(content.lastEdit != content.time ? ` (Edited at ${formatTime(content.lastEdit)})` : ``)}</div>
              <div className={classes.filler} />
              <div className={classes.actions}>
                <Tooltip title="Get Link" aria-label="get link">
                  <IconButton
                    className={classes.linkIcon}
                    onClick={() => {
                      navigator.clipboard.writeText(link);
                    }}
                  >
                    <FiLink2 size="1.2rem" />
                  </IconButton>
                </Tooltip>
                {content.author == authUser.displayName && (
                  <Tooltip title="Edit" aria-label="edit">
                    <IconButton
                      className={classes.linkIcon}
                      onClick={() => {
                        this.setState({ edit: true });
                      }}
                    >
                      <FiEdit2 size="1.2rem" />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            </div>
          )}
          {this.state.edit ? (
            <form
              onSubmit={this.handleSubmitEdit}
              autoComplete="off"
              className={classes.input}
            >
              <TextField
                autoFocus
                margin="dense"
                id="comment"
                label="Comment"
                type="text"
                value={this.state.editValue}
                onChange={this.handleEditChange}
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
                    <FiCornerRightUp
                      className={`${classes.icon} ${classes.submitIcon}`}
                    />
                  }
                  disabled={this.state.editValue.length < 8}
                >
                  Submit
                </Button>
              </div>
            </form>
          ) : (
            <>
              {this.getText(classes, !!content ? content.text : "")}
            </>
          )}
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

interface SolutionState extends ReplyBaseState {
  revealed: boolean;
}

class Solution extends ReplyBase<SolutionState> {

  constructor(props: ReplyProps) {
    super(props);
    this.state = { ...this.state, revealed: false };

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
    return FiAlignLeft;
  }
}

interface WriteCommentState extends ReplyBaseState {
  input: string;
}

export class WriteComment extends ReplyBase<WriteCommentState> {
  constructor(props: ReplyProps) {
    super(props);
    this.state = { ...this.state, input: "" };

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

    this.props.problemFunctionsExtracted.tryProblemAction(this.state.input, "comment");
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
              <FiCornerRightUp
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
    return FiEdit2;
  }
}

// interface EditState {
//   edit: boolean;
//   input: string;
// }

// export class EditComment extends ReplyBase<EditState> {
//   state = {
//     edit: false,
//     input: "",
//   }

//   constructor(props: ReplyProps) {
//     super(props);
//   }

//   componentDidMount() {
//     this.setState({ input: (!!this.props.content ? this.props.content.text : "") });
//   }

//   handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
//     e.preventDefault();

//     let input = e.target.value;
//     if (input.length > 4000) {
//       input = input.slice(0, 4000);
//     }

//     this.setState({ input });
//   }

//   handleSubmitComment(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();

//     if (this.state.input.length < 8) return;

//     this.props.tryProblemActionPrivileged(this.state.input, "editComment");
//     this.setState({ edit: false });
//   }

//   getText(classes: WithStyles<typeof styles>["classes"], text: string) {
//     return (
//       <form
//         onSubmit={this.handleSubmitComment}
//         autoComplete="off"
//         className={classes.input}
//       >
//         <TextField
//           autoFocus
//           margin="dense"
//           id="comment"
//           label="Comment"
//           type="text"
//           value={this.state.input}
//           onChange={this.handleInputChange}
//           fullWidth
//           multiline
//         />
//         <div className={classes.inputRight}>
//           <div className={classes.inputRightFiller} />
//           <Button
//             variant="contained"
//             color="primary"
//             type="submit"
//             endIcon={
//               <FiCornerRightUp
//                 className={`${classes.icon} ${classes.submitIcon}`}
//               />
//             }
//             disabled={this.state.input.length < 8}
//           >
//             Submit
//           </Button>
//         </div>
//       </form>
//     );
//   }

//   getIcon() {
//     return FiEdit2;
//   }
// }

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
