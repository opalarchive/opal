import React from 'react';
import { ChevronLeft } from 'react-feather';
import { darken, lighten, Paper, withStyles } from '@material-ui/core';
import Problem from '../problem';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../../../Constants/routes';
import { getProblemReplies } from '../../../../Firebase';
import { poll } from '../../../../Constants';
import Loading from '../../../../Loading';
import Reply from './reply';

const detailStyles = (theme) => ({
  top: {
    fontSize: "1.2rem",
    display: "flex"
  },
  topLink: {
    paddingBottom: "1rem",
    display: "flex",
    color: "rgba(0, 0, 0, 0.87)",
    textDecoration: "none",
    '&:hover': {
      color: darken(theme.palette.secondary.light, 0.1),
    },
    '&:focus': {
      color: darken(theme.palette.secondary.light, 0.1),
      outline: "none"
    }
  },
  topIcon: {
    position: "relative",
    top: "0.12em",
    marginRight: "0.25em"
  },
  topFiller: {
    flexGrow: 1
  },
  replyOffset: {
    position: "relative",
    marginLeft: "1rem"
  },
  replyWrapper: {
    position: "relative",
  },
  replyLine: {
    position: "absolute",
    top: "-1rem",
    left: "0.75rem",
    // boxShadow: `0 -0.2rem 0.1rem 0.2rem ${lighten(theme.palette.secondary.light, 0.25)}`,
    backgroundColor: lighten(theme.palette.secondary.light, 0.1),
    width: "0.5rem",
    height: "calc(100% + 2rem)",
    zIndex: -1
  },
});

class Details extends React.Component {
  render() {
    const { classes: styles, replies, comment, ...otherProps } = this.props;

    return (
      <>
        <div className={styles.top}>
          <Link className={styles.topLink} to={ROUTES.PROJECT_VIEW.replace(':uuid', otherProps.uuid)} >
            <ChevronLeft className={styles.topIcon} />Back
        </Link>
          <div className={styles.topFiller} />
        </div>
        <Problem {...otherProps} />
        <div className={styles.replyOffset}>
          <div className={styles.replyWrapper}>
            <div className={styles.replyLine} />
            {!!replies && replies.map((reply, id) => <Reply key={id} {...reply} id={id}  />)}
          </div>
          <Reply type="input" comment={comment} />
        </div>
      </>
    );
  }
}

export default withStyles(detailStyles)(Details);
