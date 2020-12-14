import React from 'react';

import { darken, Paper, withStyles } from '@material-ui/core';
import { AlignLeft, ArrowDown, ArrowUp, CornerDownRight, MessageSquare } from 'react-feather';
import Latex from '../../../Constants/latex';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../../Constants/routes';

const styles = (category, difficulty) => (theme) => ({
  root: {
    width: "100%",
    marginBottom: "1rem",
    display: "flex",
  },
  icon: {
    display: "inline-block",
    flexShrink: 0,
    position: "relative",
    top: "0.28rem",
    fontSize: "1.2rem",
    height: "1.2rem",
    width: "1.2rem",
    marginRight: "0.5rem"
  },
  left: {
    display: "flex",
    flexDirection: "column",
    fontSize: "1.1rem",
    minWidth: "4rem"
  },
  leftIndex: {
    padding: "1rem 0 0.5rem 0",
    textAlign: "center"
  },
  leftVote: {
    padding: "0.5rem",
    textAlign: "center"
  },
  leftVoteNumber: {
    position: "relative",
    fontWeight: 600,
    top: "-0.15rem"
  },
  leftVoteArrow: {
    color: "black",
    '&:hover': {
      color: "rgb(0, 0, 0, 0.4)"
    }
  },
  leftVoteArrowActivated: {
    color: theme.palette.primary.light,
    '&:hover': {
      color: darken(theme.palette.primary.light, 0.2)
    }
  },
  body: {
    padding: "0.25rem 0 0.25rem 0",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1
  },
  bodyTitle: {
    padding: "0.5rem 0.5rem 0.1rem 0.5rem",
    fontSize: "1.25rem"
  },
  bodyAuthor: {
    padding: "0.1rem 0.5rem 0.5rem 0.5rem",
    fontSize: "0.9rem",
  },
  bodyText: {
    padding: "0.5rem",
  },
  bodyFiller: {
    flexGrow: 1
  },
  bodyTags: {
    padding: "0.5rem",
  },
  bodyReply: {
    padding: "0.5rem 0.5rem 0.5rem 0.5rem",
    display: "flex",
  },
  bodyReplyLink: {
    color: "rgba(0, 0, 0, 0.87)",
    textDecoration: "none",
    '&:hover': {
      color: darken(theme.palette.secondary.light, 0.1)
    },
    '&:focus': {
      color: darken(theme.palette.secondary.light, 0.1),
      outline: "none"
    }
  },
  right: {
    padding: "0.25rem 0.5rem 0.25rem 0",
    display: "flex",
    flexDirection: "column",
    fontSize: "1.2rem",
    width: "11rem",
    flexShrink: 0
  },
  rightCategory: {
    padding: "0.5rem 0.5rem 0 0.5rem",
    display: "flex"
  },
  rightDot: {
    height: "0.75rem",
    width: "0.75rem",
    top: "0.48rem",
    borderRadius: "50%",
    margin: "0 0.7rem 0 0.2rem"
  },
  rightCategoryDot: {
    backgroundColor: category.color,
  },
  rightDifficulty: {
    padding: "0.5rem",
    display: "flex"
  },
  rightDifficultyDot: {
    backgroundColor: difficulty.color,
  },
  rightFiller: {
    flexGrow: 1
  },
  rightComments: {
    padding: "0 0.5rem 0.5rem 0.5rem",
    display: "flex"
  },
  rightSolutions: {
    padding: "0 0.5rem 0.5rem 0.5rem",
    display: "flex"
  },
  tag: {
    marginRight: "0.25rem",
    backgroundColor: "#eaecec",
    padding: "0.1rem 0.4rem 0.1rem 0.2rem",
    borderBottomRightRadius: "1rem",
    borderTopRightRadius: "1rem"
  },
});

const Tag = (props) => {
  const { styles, text } = props;

  return <span className={styles.tag}>{text}</span>
}

class ProblemBase extends React.Component {
  render() {
    const { classes: styles, ind, uuid, text, category, difficulty, author, tags, votes, myVote, problemAction, replyTypes, repliable, authUser } = this.props;
    return (
      <Paper elevation={3} className={styles.root}>
        <div className={styles.left}>
          <div className={styles.leftIndex}>
            #{ind + 1}
          </div>
          <div className={styles.leftVote}>
            <div>
              <ArrowUp
                size="1.2rem"
                strokeWidth={3}
                className={myVote === 1 ? styles.leftVoteArrowActivated : styles.leftVoteArrow}
                onClick={_ => problemAction(1, 'vote')}
              />
            </div>
            <div><span className={styles.leftVoteNumber}>{votes}</span></div>
            <div>
              <ArrowDown
                size="1.2rem"
                strokeWidth={3}
                className={myVote === -1 ? styles.leftVoteArrowActivated : styles.leftVoteArrow}
                onClick={_ => problemAction(-1, 'vote')}
              />
            </div>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.bodyTitle}>
            Epic Problem
          </div>
          <div className={styles.bodyAuthor}>
            Proposed by {author}
          </div>
          <div className={styles.bodyText}>
            <Latex>{text}</Latex>
          </div>
          <div className={styles.bodyFiller} />
          <div className={styles.bodyTags}>
            Tags: {!!tags ? tags.map(tag => <Tag styles={styles} key={tag} text={tag} />) : null}
          </div>
          {repliable ? <div className={styles.bodyReply}><Link className={styles.bodyReplyLink} to={`${ROUTES.PROJECT_VIEW.replace(':uuid', uuid)}/p${ind}`}><CornerDownRight className={styles.icon} />Reply</Link></div> : null}
        </div>
        <div className={styles.right}>
          <div className={styles.rightCategory}><div className={`${styles.icon} ${styles.rightDot} ${styles.rightCategoryDot}`}></div>{category.name}</div>
          <div className={styles.rightDifficulty}><div className={`${styles.icon} ${styles.rightDot} ${styles.rightDifficultyDot}`}></div>d-{difficulty.name}</div>
          <div className={styles.rightFiller} />
          <div className={styles.rightComments}>
            <MessageSquare className={styles.icon} />
            {replyTypes.comment}&nbsp;comment{replyTypes.comment === 1 ? '' : 's'}
          </div>
          <div className={styles.rightSolutions}>
            <AlignLeft className={styles.icon} />
            {replyTypes.solution}&nbsp;solution{replyTypes.solution === 1 ? '' : 's'}
          </div>
        </div>
      </Paper>
    );
  }
}
const Problem = (props) => {
  const StyledProblem = withStyles(styles(props.category, props.difficulty))(ProblemBase);
  return <StyledProblem {...props} />
};

export default Problem;
