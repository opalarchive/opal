import React from "react";

import {
  Paper,
  WithStyles,
  withStyles,
  TextField,
  IconButton,
  Slider,
} from "@material-ui/core";
import {
  FiAlignLeft,
  FiArrowDown,
  FiArrowUp,
  FiCheck,
  FiCornerDownRight,
  FiEdit2,
  FiMessageSquare,
} from "react-icons/fi";
import Latex from "../../../../../Constants/latex";
import { Link } from "react-router-dom";

import * as ROUTES from "../../../../../Constants/routes";
import styles from "./index.css";
import {
  FrontendProblem,
  problemFunctionsExtracted,
} from "../../../../../Constants/types";
import Dot from "../Dot";
import TagGroup from "../TagGroup";
import { tupleToRGBString } from "../../../../../Constants";
import { Server } from "../../../../../../../.shared";

interface ProblemProps extends FrontendProblem, problemFunctionsExtracted {
  abridged: boolean;
  clickedTags?: {
    [tag: string]: boolean;
  };
  onClickTag?: (tagText: string) => void;
  allTags: Set<string>;
  getCategoryColor: (category: string) => number[];
  getDifficultyColor: (difficulty: number) => number[];
  editors: Server.Editors;
}

interface ProblemState {
  editCategory: boolean;
  editDifficulty: boolean;
  editTitle: boolean;
  editText: boolean;
  editTitleValue: string;
  editTextValue: string;
  editCategoryValue: string;
  editDifficultyValue: number;
}

class Problem extends React.PureComponent<
  ProblemProps & WithStyles<typeof styles>,
  ProblemState
> {
  state = {
    editCategory: false,
    editDifficulty: false,
    editTitle: false,
    editText: false,
    editTitleValue: "",
    editTextValue: "",
    editCategoryValue: "",
    editDifficultyValue: 0,
  };

  constructor(props: ProblemProps & WithStyles<typeof styles>) {
    super(props);

    this.state = {
      ...this.state,
      editTitleValue: this.props.title,
      editTextValue: this.props.text,
      editCategoryValue: this.props.category.name,
      editDifficultyValue: this.props.difficulty.name,
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(field: string, value: string | number | number[]) {
    switch (field) {
      case "title":
        if (typeof value != "string") {
          break;
        }

        this.setState({ editTitleValue: value });

        break;
      case "text":
        if (typeof value != "string") {
          break;
        }

        this.setState({ editTextValue: value });

        break;
      case "category":
        if (typeof value != "string") {
          break;
        }

        this.setState({ editCategoryValue: value });

        break;
      case "difficulty":
        if (typeof value != "number") {
          break;
        }

        this.setState({ editDifficultyValue: value });

        break;
      default:
        break;
    }
  }

  render() {
    const {
      classes,
      ind,
      uuid,
      title,
      text,
      category,
      difficulty,
      author,
      tags,
      votes,
      myVote,
      tryProblemAction,
      tryProblemActionPrivileged,
      tryReplyAction,
      getCategoryColor,
      getDifficultyColor,
      replyTypes,
      abridged,
      clickedTags,
      onClickTag,
      authUser,
      allTags,
      editors,
    } = this.props;

    const availableTags: string[] = [...allTags].filter(
      (tag) => tags.indexOf(tag) < 0
    );

    const canEdit =
      !abridged &&
      (editors[authUser.uid].role === "ADMIN" ||
        editors[authUser.uid].role === "OWNER" ||
        authUser.displayName === author);

    return (
      <Paper elevation={3} className={classes.root}>
        <div className={classes.left}>
          <div className={classes.leftIndex}>#{ind + 1}</div>
          <div className={classes.leftVote}>
            <div>
              <FiArrowUp
                size="1.2rem"
                strokeWidth={3}
                className={
                  myVote === 1
                    ? classes.leftVoteArrowActivated
                    : classes.leftVoteArrow
                }
                onClick={(_) => tryProblemAction(1, "vote")}
              />
            </div>
            <div>
              <span className={classes.leftVoteNumber}>{votes}</span>
            </div>
            <div>
              <FiArrowDown
                size="1.2rem"
                strokeWidth={3}
                className={
                  myVote === -1
                    ? classes.leftVoteArrowActivated
                    : classes.leftVoteArrow
                }
                onClick={(_) => tryProblemAction(-1, "vote")}
              />
            </div>
          </div>
        </div>
        <div className={classes.body}>
          <div className={classes.bodyTitle}>
            {abridged ? (
              <Link
                className={classes.link}
                to={ROUTES.PROJECT_PROBLEM.replace(":uuid", uuid).replace(
                  ":ind",
                  "" + ind
                )}
              >
                {title}
              </Link>
            ) : (
              <>
                {this.state.editTitle ? (
                  <div className={classes.editTextContainer}>
                    <TextField
                      className={classes.editTextField}
                      fullWidth
                      value={this.state.editTitleValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        this.onChange("title", e.target.value)
                      }
                    />
                    &nbsp;
                    <IconButton
                      size="small"
                      onClick={(_) => {
                        if (this.state.editTitleValue.length === 0) {
                          tryProblemActionPrivileged("Untitled", "title");
                        } else {
                          tryProblemActionPrivileged(
                            this.state.editTitleValue,
                            "title"
                          );
                        }
                        this.setState({ editTitle: false });
                      }}
                    >
                      <FiCheck />
                    </IconButton>
                  </div>
                ) : (
                  <>
                    {title}
                    {canEdit ? (
                      <>
                        &nbsp;
                        <IconButton
                          size="small"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            this.setState({ editTitle: true });
                          }}
                        >
                          <FiEdit2 />
                        </IconButton>
                      </>
                    ) : null}
                  </>
                )}
              </>
            )}
          </div>
          <div className={classes.bodyAuthor}>Proposed by {author}</div>
          <div className={classes.bodyText}>
            {this.state.editText ? (
              <>
                <TextField
                  variant="filled"
                  fullWidth
                  multiline
                  value={this.state.editTextValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    this.onChange("text", e.target.value)
                  }
                />
                &nbsp;
                <IconButton
                  size="small"
                  onClick={(_) => {
                    if (this.state.editTextValue.length === 0) {
                      tryProblemActionPrivileged("Empty", "text");
                    } else {
                      tryProblemActionPrivileged(
                        this.state.editTextValue,
                        "text"
                      );
                    }
                    this.setState({ editText: false });
                  }}
                >
                  <FiCheck />
                </IconButton>
              </>
            ) : (
              <>
                <Latex>{text}</Latex>
                {canEdit ? (
                  <>
                    &nbsp;
                    <IconButton
                      size="small"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        this.setState({ editText: true });
                      }}
                    >
                      <FiEdit2 />
                    </IconButton>
                  </>
                ) : null}
              </>
            )}
          </div>
          <div className={classes.bodyFiller} />
          <div className={classes.bodyTags}>
            Tags:{" "}
            {!!tags && (
              <TagGroup
                text={tags}
                clickedTags={clickedTags}
                onClickTag={onClickTag}
                tryProblemAction={tryProblemAction}
                canAddTag
                availableTags={availableTags}
              />
            )}
          </div>
          {abridged ? (
            <div className={classes.bodyReply}>
              <Link
                className={classes.link}
                to={ROUTES.PROJECT_PROBLEM.replace(":uuid", uuid).replace(
                  ":ind",
                  "" + ind
                )}
              >
                <FiCornerDownRight className={classes.icon} />
                Reply
              </Link>
            </div>
          ) : null}
        </div>
        <div className={classes.right}>
          <div className={classes.rightCategory}>
            <Dot
              color={
                this.state.editCategory
                  ? tupleToRGBString(
                      getCategoryColor(
                        [
                          "algebra",
                          "geometry",
                          "combinatoris",
                          "numberTheory",
                        ].includes(this.state.editCategoryValue)
                          ? this.state.editCategoryValue
                          : "miscellaneous"
                      )
                    )
                  : category.color
              }
              style={{ top: "0.48rem", margin: "0 0.7rem 0 0.2rem" }}
            />
            {this.state.editCategory ? (
              <div className={classes.editTextContainer}>
                <TextField
                  className={classes.editTextField}
                  value={this.state.editCategoryValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    this.onChange("category", e.target.value)
                  }
                />
                &nbsp;
                <IconButton
                  size="small"
                  onClick={(_) => {
                    tryProblemActionPrivileged(
                      this.state.editCategoryValue,
                      "category"
                    );
                    this.setState({ editCategory: false });
                  }}
                >
                  <FiCheck />
                </IconButton>
              </div>
            ) : (
              <>
                {category.name}
                {canEdit ? (
                  <>
                    &nbsp;
                    <IconButton
                      size="small"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        this.setState({ editCategory: true });
                      }}
                    >
                      <FiEdit2 />
                    </IconButton>
                  </>
                ) : null}
              </>
            )}
          </div>
          <div className={classes.rightDifficulty}>
            <Dot
              color={
                this.state.editDifficulty
                  ? tupleToRGBString(
                      getDifficultyColor(this.state.editDifficultyValue)
                    )
                  : difficulty.color
              }
              style={{ top: "0.48rem", margin: "0 0.7rem 0 0.2rem" }}
            />
            {this.state.editDifficulty ? (
              <>
                <Slider
                  value={this.state.editDifficultyValue}
                  onChange={(
                    e: React.ChangeEvent<{}>,
                    value: number | number[]
                  ) => {
                    e.preventDefault();
                    e.stopPropagation();

                    this.onChange("difficulty", value);
                  }}
                  valueLabelDisplay="auto"
                  aria-labelledby="difficulty-header"
                  getAriaValueText={() => `d-${this.state.editDifficultyValue}`}
                />
                &nbsp;
                <IconButton
                  size="small"
                  onClick={(_) => {
                    tryProblemActionPrivileged(
                      this.state.editDifficultyValue,
                      "difficulty"
                    );
                    this.setState({ editDifficulty: false });
                  }}
                >
                  <FiCheck />
                </IconButton>
              </>
            ) : (
              <>
                d-{difficulty.name}
                {canEdit ? (
                  <>
                    &nbsp;
                    <IconButton
                      size="small"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        this.setState({ editDifficulty: true });
                      }}
                    >
                      <FiEdit2 />
                    </IconButton>
                  </>
                ) : null}
              </>
            )}
          </div>
          <div className={classes.rightFiller} />
          <div className={classes.rightComments}>
            <FiMessageSquare className={classes.icon} />
            {replyTypes.COMMENT}&nbsp;comment
            {replyTypes.COMMENT === 1 ? "" : "s"}
          </div>
          <div className={classes.rightSolutions}>
            <FiAlignLeft className={classes.icon} />
            {replyTypes.SOLUTION}&nbsp;solution
            {replyTypes.SOLUTION === 1 ? "" : "s"}
          </div>
        </div>
      </Paper>
    );
  }
}
export default withStyles(styles)(Problem);
