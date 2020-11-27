import React from 'react';
import { ChevronLeft } from 'react-feather';
import { darken, withStyles } from '@material-ui/core';
import Problem from '../problem';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../../../Constants/routes';
import { getProblemReplies } from '../../../../Firebase';
import { poll } from '../../../../Constants/poll';
import Loading from '../../../../Loading';

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
      color: darken(theme.palette.secondary.dark, 0.1)
    },
    '&:focus': {
      color: darken(theme.palette.secondary.dark, 0.1),
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
});

class Replies extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.setReplyLoading(false, true);
  }

  render() {
    return (
      <>
        {JSON.stringify(this.props.replies)}
      </>
    );
  }
}

class Details extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      replies: [],
      replyLoading: true
    }
  }

  async setReplies(uuid, ind, authuid) {
    try {
      const replies = await getProblemReplies(uuid, ind, authuid);

      this.setState({ replies, replyLoading: false });
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async componentDidMount() {
    this.props.setReplyLoading(true, true);
    try {
      await poll({
        func: () => this.setReplies(this.props.uuid, this.props.ind, this.props.authUser.uid),
        validate: (() => !this.state.replyLoading),
        interval: 1500,
        maxAttempts: 200
      });
      console.log(this.state.replies);
      this.interval = setInterval(_ => {
        this.setReplies(this.props.uuid, this.props.ind, this.props.authUser.uid);
      }, 30000);
    } catch (e) {
      this.props.fail();
    }
  }

  componentWillUnmount() {
    if (!!this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    const { classes: styles, ...otherProps } = this.props;


    return (
      <>
        <div className={styles.top}>
          <Link className={styles.topLink} to={ROUTES.PROJECT_VIEW.replace(':uuid', otherProps.uuid)} >
            <ChevronLeft className={styles.topIcon} />Back
        </Link>
          <div className={styles.topFiller} />
        </div>
        <Problem {...otherProps} />
        {this.state.replyLoading ? null : <Replies replies={this.state.replies} setReplyLoading={this.props.setReplyLoading} />}
      </>
    );
  }
}

export default withStyles(detailStyles)(Details);
