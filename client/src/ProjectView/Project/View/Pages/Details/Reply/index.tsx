import React from "react";

import {
  Button,
  darken,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  Menu,
  MenuItem,
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
  FiTrash2,
} from "react-icons/fi";
import Latex from "../../../../../../Constants/latex";
import { formatTime, anyToProper } from "../../../../../../Constants";
import * as ROUTES from "../../../../../../Constants/routes";
import { compose } from "recompose";
import {
  problemAction,
  ProjectRole,
  projectRole,
  reply,
  ReplyType,
} from "../../../../../../../../.shared/src";
import styles from "./index.css";
import { problemFunctionsExtracted } from "../../../../../../Constants/types";
import { IconType } from "react-icons";

interface ReplyPropsBase {
  uuid: string;
  ind: number;
  reply: number;
  content?: reply;
  isHighlighted: boolean;
  problemFunctionsExtracted: problemFunctionsExtracted;
  authUser: firebase.User;
  myRole: projectRole;
}

type ReplyProps = WithStyles<typeof styles> & WithTheme & ReplyPropsBase;

interface ReplyBaseState {
  edit: boolean;
  editValue: string;
  typeMenuAnchorEl: HTMLElement | null;
  currentType: ReplyType;
  deleteModalOpen: boolean;
}

class ReplyBase<State extends ReplyBaseState> extends React.PureComponent<
  ReplyProps,
  State
> {
  constructor(props: ReplyProps) {
    super(props);
    this.state = {
      ...this.state,
      edit: false,
      editValue: "",
      typeMenuAnchorEl: null,
      deleteModalOpen: false,
    };

    this.getText = this.getText.bind(this);
    this.handleEditChange = this.handleEditChange.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
    this.handleEditChange = this.handleEditChange.bind(this);
    this.openTypeMenu = this.openTypeMenu.bind(this);
    this.closeTypeMenu = this.closeTypeMenu.bind(this);
    this.setCurrentType = this.setCurrentType.bind(this);
    this.getIcon = this.getIcon.bind(this);
    this.handleOpenDeleteModal = this.handleOpenDeleteModal.bind(this);
    this.handleCloseDeleteModal = this.handleCloseDeleteModal.bind(this);
  }

  componentDidMount() {
    this.setState({
      editValue: this.props.content ? this.props.content.text : "",
    });
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
    let Icon: IconType;
    switch (this.state.currentType) {
      case ReplyType.COMMENT:
        Icon = FiMessageSquare;
        break;
      case ReplyType.SOLUTION:
        Icon = FiAlignLeft;
        break;
      default:
        Icon = FiMessageSquare;
        break;
    }
    return Icon;
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

    if (
      this.state.editValue.length < 8 ||
      (!!this.props.content && this.state.editValue === this.props.content.text)
    )
      return;

    this.props.problemFunctionsExtracted.tryReplyAction(
      this.props.reply,
      this.state.editValue,
      "editText"
    );
    this.setState({ edit: false });
  }

  openTypeMenu(e: React.MouseEvent<HTMLButtonElement>) {
    this.setState({ typeMenuAnchorEl: e.currentTarget });
  }

  closeTypeMenu() {
    this.setState({ typeMenuAnchorEl: null });
  }

  handleOpenDeleteModal() {
    this.setState({ deleteModalOpen: true });
  }

  handleCloseDeleteModal() {
    this.setState({ deleteModalOpen: false });
  }

  setCurrentType(type: ReplyType) {
    this.props.problemFunctionsExtracted.tryReplyAction(
      this.props.reply,
      type,
      "editType"
    );
    this.closeTypeMenu();
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
      myRole,
    } = this.props;
    const Icon = this.getIcon();
    const IconInDom = () => (
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
    );
    const linkPrefix = window.location.href.substr(
      0,
      window.location.href.indexOf(window.location.pathname)
    );

    const link =
      linkPrefix +
      ROUTES.PROJECT_PROBLEM_REPLY.replace(":uuid", uuid)
        .replace(":ind", "" + ind)
        .replace(":reply", "" + reply);

    const canEdit: boolean = !!content
      ? content.author === authUser.displayName
      : false;
    const canDelete: boolean = !!content
      ? ProjectRole[myRole] === 0 ||
        ProjectRole[myRole] === 1 ||
        content.author === authUser.displayName
      : false;

    return (
      <div className={classes.root}>
        <Paper elevation={3} className={`${classes.reply}`}>
          {this.isLinkable() && !!content && (
            <div className={classes.top}>
              <div className={classes.author}>{content.author}</div>
              <div className={classes.time}>
                {formatTime(content.time) +
                  (content.lastEdit !== content.time
                    ? ` (Edited at ${formatTime(content.lastEdit)})`
                    : ``)}
              </div>
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
                {canEdit && (
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
                {canDelete && (
                  <>
                    <Tooltip title="Delete" aria-label="delete">
                      <IconButton
                        className={classes.linkIcon}
                        onClick={this.handleOpenDeleteModal}
                      >
                        <FiTrash2 size="1.2rem" />
                      </IconButton>
                    </Tooltip>
                    <Dialog
                      open={this.state.deleteModalOpen}
                      onClose={this.handleCloseDeleteModal}
                      aria-describedby="delete-reply-description"
                    >
                      <DialogContent>
                        <DialogContentText id="delete-reply-description">
                          Are you sure you want to delete this reply? This is an
                          irreversible action.
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={this.handleCloseDeleteModal}
                          color="primary"
                          autoFocus
                        >
                          No
                        </Button>
                        <Button
                          onClick={() => {
                            this.props.problemFunctionsExtracted.tryReplyAction(
                              reply,
                              "_",
                              "delete"
                            ); //needs a placeholder for data since empty data ends up not reaching backend
                          }}
                          color="primary"
                        >
                          Yes
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </>
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
            <>{this.getText(classes, !!content ? content.text : "")}</>
          )}
        </Paper>

        <Paper elevation={3} className={`${classes.iconPaper}`}>
          {!content || canEdit ? (
            <>
              <IconButton
                size="small"
                color="inherit"
                onClick={this.openTypeMenu}
                aria-controls="list-select-menu"
                aria-haspopup="true"
                edge="end"
              >
                <IconInDom />
              </IconButton>
              <Menu
                id="list-select-menu"
                anchorEl={this.state.typeMenuAnchorEl}
                keepMounted
                open={!!this.state.typeMenuAnchorEl}
                onClose={this.closeTypeMenu}
                elevation={3}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem
                  onClick={(_) => {
                    this.setCurrentType(ReplyType.COMMENT);
                  }}
                >
                  <FiMessageSquare />
                  &nbsp;Comment
                </MenuItem>
                <MenuItem
                  onClick={(_) => {
                    this.setCurrentType(ReplyType.SOLUTION);
                  }}
                >
                  <FiAlignLeft />
                  &nbsp;Solution
                </MenuItem>
              </Menu>
            </>
          ) : (
            <IconInDom />
          )}
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
  typeMenuAnchorEl: HTMLElement | null;
  currentType: ReplyType;
}

export class WriteComment extends ReplyBase<WriteCommentState> {
  constructor(props: ReplyProps) {
    super(props);
    this.state = {
      ...this.state,
      input: "",
      typeMenuAnchorEl: null,
      currentType: ReplyType.COMMENT,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmitComment = this.handleSubmitComment.bind(this);
    this.openTypeMenu = this.openTypeMenu.bind(this);
    this.closeTypeMenu = this.closeTypeMenu.bind(this);
    this.setCurrentType = this.setCurrentType.bind(this);
    this.getIcon = this.getIcon.bind(this);
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

    let typeString: problemAction;
    switch (this.state.currentType) {
      case ReplyType.COMMENT:
        typeString = "comment";
        break;
      case ReplyType.SOLUTION:
        typeString = "solution";
        break;
      default:
        typeString = "comment";
    }
    this.props.problemFunctionsExtracted.tryProblemAction(
      this.state.input,
      typeString
    );
    this.setState({ input: "" });
  }

  openTypeMenu(e: React.MouseEvent<HTMLButtonElement>) {
    this.setState({ typeMenuAnchorEl: e.currentTarget });
  }

  closeTypeMenu() {
    this.setState({ typeMenuAnchorEl: null });
  }

  setCurrentType(type: ReplyType) {
    this.setState({ currentType: type });
    this.closeTypeMenu();
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
          label={anyToProper(this.state.currentType)}
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
