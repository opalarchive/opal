import React from "react";

import {
  Paper,
  WithStyles,
  withStyles,
  TextField,
  Button,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import {
  FiAlignLeft,
  FiArrowDown,
  FiArrowUp,
  FiCornerDownRight,
  FiMessageSquare,
} from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import Latex from "../../../../../Constants/latex";
import { Link } from "react-router-dom";

import * as ROUTES from "../../../../../Constants/routes";
import styles from "./index.css";
import { FrontendProblem } from "../../../../../Constants/types";
import Dot from "../Dot";
import Tag from "../Tag";
import TagGroup from "../TagGroup";

interface ProblemProps extends FrontendProblem {
  repliable: boolean;
  clickedTags?: {
    [tag: string]: boolean;
  };
  onClickTag?: (tagText: string) => void;
  allTags: Set<string>;
}

class Problem extends React.PureComponent<
  ProblemProps & WithStyles<typeof styles>
> {
  constructor(props: ProblemProps & WithStyles<typeof styles>) {
    super(props);
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
      replyTypes,
      repliable,
      clickedTags,
      onClickTag,
      authUser,
      allTags,
    } = this.props;

    const availableTags = [...allTags].filter((tag) => tags.indexOf(tag) < 0);

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
            {repliable ? (
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
              title
            )}
          </div>
          <div className={classes.bodyAuthor}>Proposed by {author}</div>
          <div className={classes.bodyText}>
            <Latex>{text}</Latex>
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
          {repliable ? (
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
              color={category.color}
              style={{ top: "0.48rem", margin: "0 0.7rem 0 0.2rem" }}
            />
            {category.name}
          </div>
          <div className={classes.rightDifficulty}>
            <Dot
              color={difficulty.color}
              style={{ top: "0.48rem", margin: "0 0.7rem 0 0.2rem" }}
            />
            d-{difficulty.name}
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
