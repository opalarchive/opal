import React from 'react';

import { Paper, withStyles } from '@material-ui/core';

const styles = (category, difficulty) => (theme) => ({
  root: {
    width: "100%",
    marginBottom: "1rem"
  },
  head: {
    display: "flex",
    borderBottom: "solid 0.125rem rgba(0, 0, 0, 0.1)",
    fontSize: "1.1rem"
  },
  headIndex: {
    padding: "0.5rem"
  },
  headCategory: {
    padding: "0.5rem",
    backgroundColor: category.color,
    color: category.contrast
  },
  headDifficulty: {
    padding: "0.5rem",
    backgroundColor: difficulty.color,
    color: difficulty.contrast
  },
  tag: {
    marginRight: "0.25rem",
    backgroundColor: "#eaecec",
    padding: "0.1rem 0.4rem 0.1rem 0.2rem",
    borderBottomRightRadius: "1rem",
    borderTopRightRadius: "1rem"
  },
  headAuthor: {
    padding: "0.5rem",
    flexGrow: "1",
  },
  body: {
    padding: "0.5rem"
  },
  foot: {
    padding: "0.5rem"
  }
});

const Tag = (props) => {
  const { styles, text } = props;

  return <span className={styles.tag}>{text}</span>
}

class ProblemBase extends React.Component {
  render() {
    const { classes: styles, ind, text, category, difficulty, author, tags } = this.props;
    return (
      <Paper square elevation={3} className={styles.root}>
        <div className={styles.head}>
          <div className={styles.headIndex}>
            #{ind + 1}
          </div>
          <div className={styles.headCategory}>
            {category.name}
          </div>
          <div className={styles.headDifficulty}>
            d-{difficulty.name}
          </div>
          <div className={styles.headAuthor}>
            Proposed by {author}
          </div>
        </div>
        <div className={styles.body}>
          {text}
        </div>
        <div className={styles.foot}>
          Tags: {tags.map(tag => <Tag styles={styles} text={tag} />)}
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
