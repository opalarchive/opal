import React from 'react';

import { Button, darken, Paper, TextField, withStyles } from '@material-ui/core';
import { AlignLeft, Circle, CornerRightUp, Edit2, MessageSquare } from 'react-feather';
import Latex from '../../../../Constants/latex';
import { formatTime } from '../../../../Constants';

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
  text: {
    paddingTop: "0.5rem"
  },
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

    this.props.comment(this.state.input);
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
    const { classes: styles, type, author, time, text, id } = this.props;

    const Icon = this.getIcon(type);
    return (
      <div className={styles.root} id={`c${id}`}>
        <Paper square elevation={3} className={styles.reply}>
          {!!author && <div className={styles.top}>
            <div className={styles.author}>{author}</div>
            <div className={styles.time}>{formatTime(time)}</div>
          </div>}
          {this.getText(type, styles, text)}
        </Paper>

        <Paper square elevation={3} className={styles.iconPaper}>
          <Icon className={styles.icon} />
          <div className={styles.iconBodge} />
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Reply);;
