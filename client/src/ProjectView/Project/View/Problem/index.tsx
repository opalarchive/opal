import React from "react";

import { darken, Paper, WithStyles, withStyles } from "@material-ui/core";
import {
  AlignLeft,
  ArrowDown,
  ArrowUp,
  CornerDownRight,
  MessageSquare,
} from "react-feather";
import Latex from "../../../../Constants/latex";
import { Link } from "react-router-dom";

import * as ROUTES from "../../../../Constants/routes";
import styles from "./index.css";
import { ProblemDetails } from "../../../../Constants/types";

interface ProblemProps extends ProblemDetails {
  repliable: boolean;
}

class Problem extends React.Component<
  ProblemProps & WithStyles<typeof styles>
> {
  render() {
    const {
      classes,
      ind,
      uuid,
      text,
      category,
      difficulty,
      author,
      tags,
      votes,
      myVote,
      tryProblemAction,
      replyTypes,
      repliable,
      authUser,
    } = this.props;

    const Tag: React.FC<{ text: string }> = ({ text }) => {
      return <span className={classes.tag}>{text}</span>;
    };

    return (
      <Paper elevation={3} className={classes.root}>
        <div className={classes.left}>
          <div className={classes.leftIndex}>#{ind + 1}</div>
          <div className={classes.leftVote}>
            <div>
              <ArrowUp
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
              <ArrowDown
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
          <div className={classes.bodyTitle}>Epic Problem</div>
          <div className={classes.bodyAuthor}>Proposed by {author}</div>
          <div className={classes.bodyText}>
            <Latex>{text}</Latex>
          </div>
          <div className={classes.bodyFiller} />
          <div className={classes.bodyTags}>
            Tags:{" "}
            {!!tags ? tags.map((tag) => <Tag key={tag} text={tag} />) : null}
          </div>
          {repliable ? (
            <div className={classes.bodyReply}>
              <Link
                className={classes.bodyReplyLink}
                to={`${ROUTES.PROJECT_VIEW.replace(":uuid", uuid)}/p${ind}`}
              >
                <CornerDownRight className={classes.icon} />
                Reply
              </Link>
            </div>
          ) : null}
        </div>
        <div className={classes.right}>
          <div className={classes.rightCategory}>
            <div
              className={`${classes.icon} ${classes.rightDot} ${classes.rightCategoryDot}`}
              style={{ backgroundColor: category.color }}
            ></div>
            {category.name}
          </div>
          <div className={classes.rightDifficulty}>
            <div
              className={`${classes.icon} ${classes.rightDot} ${classes.rightDifficultyDot}`}
              style={{ backgroundColor: difficulty.color }}
            ></div>
            d-{difficulty.name}
          </div>
          <div className={classes.rightFiller} />
          <div className={classes.rightComments}>
            <MessageSquare className={classes.icon} />
            {replyTypes.COMMENT}&nbsp;comment
            {replyTypes.COMMENT === 1 ? "" : "s"}
          </div>
          <div className={classes.rightSolutions}>
            <AlignLeft className={classes.icon} />
            {replyTypes.SOLUTION}&nbsp;solution
            {replyTypes.SOLUTION === 1 ? "" : "s"}
          </div>
        </div>
      </Paper>
    );
  }
}
export default withStyles(styles)(Problem);
