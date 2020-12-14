import React from 'react';

import { Button, darken, IconButton, Paper, TextField, Tooltip, withStyles, withTheme } from '@material-ui/core';
import { AlignLeft, Circle, CornerRightUp, Edit2, Link2, MessageSquare } from 'react-feather';
import Latex from '../../../../Constants/latex';
import { formatTime } from '../../../../Constants';
import * as ROUTES from '../../../../Constants/routes';
import { compose } from 'recompose';

const styles = (theme) => ({
  root: {
    position: "relative"
  },
  iconPaper: {
    padding: "0.5rem",
    top: 0,
    width: "2.1rem",
    position: "absolute",
  },
  icon: {
    position: "relative",
    top: "0.2rem",
    height: "1.2rem",
    width: "1.2rem",
  },
  iconBodge: {
    height: "100%",
    width: "1rem",
    position: "absolute",
    top: 0,
    left: "2.5rem",
    backgroundColor: "white",
    zIndex: 2
  },
  reply: {
    padding: "0.5rem 0.5rem 0.5rem 0.5rem",
    margin: "0 0 1rem 3rem",
    position: "relative",
    zIndex: 1
  },
  top: {
    display: "flex",
    fontSize: "1.09rem"
  },
  author: {
    marginRight: "0.5rem"
  },
  time: {
    color: "rgba(0, 0, 0, 0.64)"
  },
  filler: {
    flexGrow: 1
  },
  actions: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  linkIcon: {
    padding: 0,
    display: "inline-block"
  },
  text: {
    paddingTop: "0.5rem"
  },
  // highlightPaper: {
  //   boxShadow: `0 0.3rem 0.3rem 0 ${darken(fade(theme.palette.primary.main, 0.4), 0.2)}, 0 0.3rem 0.2rem 0.1rem ${darken(fade(theme.palette.secondary.main, 0.24), 0.2)}, 0 0.1rem 0.6rem 0.1rem ${darken(fade(theme.palette.secondary.main, 0.28), 0.2)}`
  // },
  reveal: {
    color: darken(theme.palette.secondary.main, 0.25),
    cursor: "pointer",
    '&:hover': {
      color: darken(theme.palette.secondary.dark, 0.25),
    },
    '&:focus': {
      color: darken(theme.palette.secondary.dark, 0.25),
      outline: "none"
    }
  },
  input: {
    display: "flex"
  },
  inputRight: {
    padding: "0.5rem",
    display: "flex",
    flexDirection: "column"
  },
  inputRightFiller: {
    flexGrow: 1
  },
  submitIcon: {
    top: "-0.12rem",
  }
});

class Reply extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      revealed: false,
      input: ''
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmitComment = this.handleSubmitComment.bind(this);
    this.getText = this.getText.bind(this);
  }

  handleClick(e) {
    e.preventDefault();

    this.setState({ revealed: !this.state.revealed });
  }

  handleInputChange(e) {
    e.preventDefault();

    let input = e.target.value;
    if (input.length > 4000) {
      input = input.slice(0, 4000);
    }

    this.setState({ input });
  }

  handleSubmitComment(e) {
    e.preventDefault();

    if (this.state.input.length < 8) return;

    this.props.problemAction(this.state.input, 'comment');
    this.setState({ input: '' });
  }

  getText(type, styles, text) {
    switch (type) {
      case 'comment':
        return <div className={styles.text}><Latex>{text}</Latex></div>;
      case 'solution':
        return (
          <>
            <div className={styles.text}>
              <span className={styles.reveal} onClick={this.handleClick}>{this.state.revealed ? "Hide" : "Reveal"} Solution</span>
            </div>
            {this.state.revealed && <div className={styles.text}><Latex>{text}</Latex></div>}
          </>
        );
      case 'input':
        return (
          <form onSubmit={this.handleSubmitComment} autoComplete="off" className={styles.input}>
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
            <div className={styles.inputRight}>
              <div className={styles.inputRightFiller} />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                endIcon={<CornerRightUp className={`${styles.icon} ${styles.submitIcon}`} />}
                disabled={this.state.input.length < 8}
              >
                Submit
              </Button>
            </div>
          </form>
        );
      default:
        return null
    }
  }

  getIcon(type) {
    switch (type) {
      case 'comment':
        return MessageSquare;
      case 'solution':
        return AlignLeft;
      case 'input':
        return Edit2;
      default:
        return Circle;
    }
  }

  render() {
    const { classes: styles, theme, type, author, time, text, uuid, ind, id, isHighlighted } = this.props;

    const Icon = this.getIcon(type);
    const linkPrefix = window.location.href.substr(0, window.location.href.indexOf(window.location.pathname)) 
    const link = linkPrefix + ROUTES.PROJECT_PROBLEM_REPLY.replace(':uuid', uuid).replace(':ind', ind).replace(':reply', id);
    return (
      <div className={styles.root}>
        <Paper elevation={3} className={`${styles.reply} ${isHighlighted ? styles.highlightPaper : null}`}>
          {!!author && <div className={styles.top}>
            <div className={styles.author}>{author}</div>
            <div className={styles.time}>{formatTime(time)}</div>
            <div className={styles.filler} />
            <div className={styles.actions}>
              <Tooltip title="Get Link" aria-label="get link">
                <IconButton className={styles.linkIcon} onClick={() => {
                  navigator.clipboard.writeText(link)
                }}>
                  <Link2 size="1.2rem" />
                </IconButton>
              </Tooltip>
            </div>
          </div>}
          {this.getText(type, styles, text)}
        </Paper>

        <Paper elevation={3} className={`${styles.iconPaper} ${isHighlighted ? styles.highlightPaper : null}`}>
          <Icon className={styles.icon} stroke={isHighlighted ? darken(theme.palette.secondary.main, 0.1) : "currentColor"} fill={isHighlighted ? darken(theme.palette.secondary.main, 0.1) : "none"} />
          <div className={styles.iconBodge} />
        </Paper>
      </div>
    );
  }
}

export default compose(withStyles(styles), withTheme)(Reply);;
