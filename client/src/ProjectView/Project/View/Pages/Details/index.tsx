import React from "react";
import { FiChevronLeft } from "react-icons/fi";
import { withStyles, WithStyles } from "@material-ui/core";
import Problem from "../../Embedded/Problem";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";

import * as ROUTES from "../../../../../Constants/routes";
import Reply from "./Reply";
import {
  reply as replyType,
  Problem as ProblemType,
  Server,
  problemAction,
} from "../../../../../../../.shared";
import styles from "./index.css";
import {
  FrontendProblem,
  problemFunctions,
  problemFunctionsObj,
  problemProps,
  tryProblemAction,
  tryProblemActionPrivileged
} from "../../../../../Constants/types";
import Action from "./Action";
import SidebaredBase from "../../../../Template/SidebaredBase";
import { ViewSectionProps } from "../..";

interface DetailProps extends WithStyles<typeof styles> {
  replies: replyType[];
  setDefaultScroll: (scroll: number) => void;
  reply?: number;
  allTags: Set<string>;
  getCategoryColor: (category: string) => number[];
  getDifficultyColor: (difficulty: number) => number[];
  editors: Server.Editors;
  problemPropsExtracted: FrontendProblem;
  problemFunctionsExtracted: problemFunctionsObj;
}

class Details extends React.Component<DetailProps> {
  shouldComponentUpdate(nextProps: DetailProps) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }

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
    const {
      classes,
      replies,
      reply: replyNumber,
      problemPropsExtracted,
      problemFunctionsExtracted,
      ...otherProps
    } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.top} ref={this.top}>
          <Link
            className={classes.topLink}
            to={ROUTES.PROJECT_VIEW.replace(":uuid", problemPropsExtracted.uuid)}
          >
            <FiChevronLeft className={classes.topIcon} />
            Back
          </Link>
          <div className={classes.topFiller} />
        </div>

        <div ref={this.prob}>
          <Problem {...problemPropsExtracted} {...problemFunctionsExtracted} {...otherProps} abridged={false} />
        </div>

        <div className={classes.replyOffset}>
          <div className={classes.replyWrapper}>
            <div className={classes.replyLine} />
            {!!replies &&
              replies.map((reply, id) => (
                <div key={id} ref={this.commentRefs[id]}>
                  <Reply
                    uuid={problemPropsExtracted.uuid}
                    ind={problemPropsExtracted.ind}
                    reply={id}
                    content={reply}
                    isHighlighted={replyNumber === id}
                    problemFunctionsExtracted={problemFunctionsExtracted}
                    authUser={problemPropsExtracted.authUser}
                  />
                </div>
              ))}
          </div>
          <Reply
            uuid={problemPropsExtracted.uuid}
            ind={problemPropsExtracted.ind}
            reply={-1}
            isHighlighted={false}
            problemFunctionsExtracted={problemFunctionsExtracted}
            authUser={problemPropsExtracted.authUser}
          />
        </div>
      </div>
    );
  }
}

const StyledDetails = withStyles(styles)(Details);

interface DetailsMatch {
  uuid: string;
  ind: string;
  reply?: string;
}

interface RoutedDetailsProps
  extends RouteComponentProps<DetailsMatch>,
    ViewSectionProps {
  fixedSidebar: boolean;
  problemProps: problemProps;
  problemFunctions: problemFunctions;
  getCategoryColor: (category: string) => number[];
  getDifficultyColor: (difficulty: number) => number[];
  setDefaultScroll: (scroll: number) => void;
}

const RoutedDetails: React.FC<RoutedDetailsProps> = ({
  fixedSidebar,
  project,
  uuid,
  problemProps,
  problemFunctions,
  getCategoryColor,
  getDifficultyColor,
  authUser,
  setDefaultScroll,
  match,
  editors,
}) => {
  const ind = parseInt(match.params.ind);
  const reply = !!match.params.reply ? parseInt(match.params.reply) : undefined;
  const allTags = new Set<string>();
  project.problems.forEach((prob) => {
    prob.tags.forEach((tag) => allTags.add(tag));
  });
  const problemPropsExtracted = problemProps(uuid, project.problems[ind], authUser);
  const problemFunctionsExtracted = problemFunctions(uuid, project.problems[ind], authUser);

  return (
    <SidebaredBase
      sidebarWidth={18}
      Sidebar={Action}
      right
      sidebarProps={{
        project,
        allTags,
        editors,
        ...problemPropsExtracted,
        ...problemFunctionsExtracted,
      }}
      fixedSidebar={fixedSidebar}
      authUser={authUser}
    >
      <StyledDetails
        replies={project.problems[ind].replies}
        problemPropsExtracted={problemPropsExtracted}
        problemFunctionsExtracted={problemFunctionsExtracted}
        getCategoryColor={getCategoryColor}
        getDifficultyColor={getDifficultyColor}
        allTags={allTags}
        setDefaultScroll={setDefaultScroll}
        reply={reply}
        editors={editors}
      />
    </SidebaredBase>
  );
};

export default withRouter(RoutedDetails);