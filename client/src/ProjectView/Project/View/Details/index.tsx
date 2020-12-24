import React, { RefObject } from "react";
import { ChevronLeft } from "react-feather";
import { withStyles, WithStyles } from "@material-ui/core";
import Problem from "../Problem";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { compose } from "recompose";

import * as ROUTES from "../../../../Constants/routes";
import Reply from "./Reply";
import { reply as replyType } from "../../../../../../.shared/src/types";
import styles from "./index.css";
import { ProblemDetails } from "../../../../Constants/types";

interface DetailProps extends WithStyles<typeof styles>, ProblemDetails {
  replies: replyType[];
  setDefaultScroll: (scroll: number) => void;
  reply?: number;
}

class Details extends React.Component<DetailProps> {
  private top = React.createRef<HTMLDivElement>();
  private prob = React.createRef<HTMLDivElement>();
  private commentRefs: RefObject<HTMLDivElement>[] = [];

  componentDidMount() {
    if (!this.props.reply) return;
    if (this.commentRefs.length <= this.props.reply) return;

    const rem = parseInt(
      getComputedStyle(this.top.current as Element).fontSize.replace("px", "")
    );

    const Reply0 =
      rem * 2 +
      (this.top.current as Element).clientHeight +
      (this.prob.current as Element).clientHeight;

    if (this.props.reply === 0) {
      this.props.setDefaultScroll(Reply0);
    } else {
      this.props.setDefaultScroll(
        Reply0 +
          [...Array(this.props.reply).keys()].reduce(
            (acc, cur) =>
              acc +
              (this.commentRefs[cur].current as Element).clientHeight +
              rem,
            0
          )
      );
    }
  }

  render() {
    const { classes, replies, reply: replyNumber, ...otherProps } = this.props;

    return (
      <>
        <div className={classes.top} ref={this.top}>
          <Link
            className={classes.topLink}
            to={ROUTES.PROJECT_VIEW.replace(":uuid", otherProps.uuid)}
          >
            <ChevronLeft className={classes.topIcon} />
            Back
          </Link>
          <div className={classes.topFiller} />
        </div>

        <div ref={this.prob}>
          <Problem {...otherProps} repliable={false} />
        </div>

        <div className={classes.replyOffset}>
          <div className={classes.replyWrapper}>
            <div className={classes.replyLine} />
            {!!replies &&
              replies.map((reply, id) => (
                <div key={id} ref={this.commentRefs[id]}>
                  <Reply
                    uuid={otherProps.uuid}
                    ind={otherProps.ind}
                    reply={id}
                    content={reply}
                    isHighlighted={replyNumber === id}
                    problemAction={otherProps.problemAction}
                  />
                </div>
              ))}
          </div>
          <Reply
            uuid={otherProps.uuid}
            ind={otherProps.ind}
            reply={-1}
            isHighlighted={false}
            problemAction={otherProps.problemAction}
          />
        </div>
      </>
    );
  }
}

export default withStyles(styles)(Details);
