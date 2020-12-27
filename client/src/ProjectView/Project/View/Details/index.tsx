import React from "react";
import { ChevronLeft } from "react-feather";
import { withStyles, WithStyles } from "@material-ui/core";
import Problem from "../Problem";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";

import * as ROUTES from "../../../../Constants/routes";
import Reply from "./Reply";
import {
  ProjectPrivate,
  reply as replyType,
  Problem as ProblemType,
} from "../../../../../../.shared";
import styles from "./index.css";
import { ProblemDetails, tryProblemAction } from "../../../../Constants/types";
import MenuBase, { MenuBaseProps } from "../../../MenuBase";
import Sidebar from "./Sidebar";

interface DetailProps extends WithStyles<typeof styles>, ProblemDetails {
  replies: replyType[];
  setDefaultScroll: (scroll: number) => void;
  reply?: number;
}

class Details extends React.Component<DetailProps> {
  private top = React.createRef<HTMLDivElement>();
  private prob = React.createRef<HTMLDivElement>();
  private commentRefs = [...Array(this.props.replies.length).keys()].map((_) =>
    React.createRef<HTMLDivElement>()
  );

  componentDidMount() {
    if (this.props.reply === undefined) return;
    if (this.commentRefs.length <= this.props.reply) return;

    const rem = parseInt(
      getComputedStyle(this.prob.current as Element).fontSize.replace("px", "")
    );

    const Reply0 =
      rem +
      (this.top.current as Element).clientHeight +
      (this.prob.current as Element).clientHeight;

    if (this.props.reply === 0) {
      this.props.setDefaultScroll(Reply0);
    } else {
      this.props.setDefaultScroll(
        Reply0 +
          [...Array(this.props.reply).keys()].reduce(
            (acc, cur) =>
              acc + this.commentRefs[cur].current!.clientHeight + rem,
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
                    tryProblemAction={otherProps.tryProblemAction}
                  />
                </div>
              ))}
          </div>
          <Reply
            uuid={otherProps.uuid}
            ind={otherProps.ind}
            reply={-1}
            isHighlighted={false}
            tryProblemAction={otherProps.tryProblemAction}
          />
        </div>
      </>
    );
  }
}

const StyledDetails = withStyles(styles)(Details);

interface DetailsMatch {
  uuid: string;
  ind: string;
  reply?: string;
}

interface RoutedDetailsProps extends RouteComponentProps<DetailsMatch> {
  project: ProjectPrivate;
  uuid: string;
  problemProps: (
    uuid: string,
    prob: ProblemType,
    tryProblemAction: tryProblemAction,
    authUser: firebase.User
  ) => ProblemDetails;
  tryProblemAction: tryProblemAction;
  authUser: firebase.User;
  setDefaultScroll: (scroll: number) => void;
}

const RoutedDetails: React.FC<RoutedDetailsProps> = ({
  project,
  uuid,
  problemProps,
  tryProblemAction,
  authUser,
  setDefaultScroll,
  match,
}) => {
  const ind = parseInt(match.params.ind);
  const reply = !!match.params.reply ? parseInt(match.params.reply) : undefined;

  return (
    <StyledDetails
      replies={project.problems[ind].replies}
      {...problemProps(uuid, project.problems[ind], tryProblemAction, authUser)}
      setDefaultScroll={setDefaultScroll}
      reply={reply}
    />
  );
};

const DetailsPage: React.FC<
  RoutedDetailsProps & {
    menuBaseProps: Omit<MenuBaseProps, "Sidebar" | "children">;
  }
> = ({ menuBaseProps, ...rest }) => {
  return (
    <MenuBase Sidebar={Sidebar} {...menuBaseProps}>
      <RoutedDetails {...rest} />
    </MenuBase>
  );
};

export default withRouter(DetailsPage);
