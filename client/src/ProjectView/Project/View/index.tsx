import React from "react";
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from "react-router-dom";
import ScrollBase from "../../Template/ScrollBase";

import * as ROUTES from "../../../Constants/routes";
import Details from "./Pages/Details";
import {
  CategoryColors,
  actionData,
  DifficultyColors,
  Problem as ProblemType,
  problemAction,
  problemActionPrivileged,
  ProjectPrivate,
  replyAction,
  ReplyType,
  Server,
  projectRole,
  Client,
} from "../../../../../.shared/src/types";
import {
  replyTypes,
  tryProblemAction,
  newProblem,
  tryProblemActionPrivileged,
  tryReplyAction,
  problemProps,
  problemFunctions,
} from "../../../Constants/types";
import Overview from "./Pages/Overview";
import Compile from "./Pages/Compile";
import NewProblem from "./Pages/NewProblem";
import Settings from "./Pages/Settings";

interface ViewProps {
  background: string;
  project: ProjectPrivate;
  editors: Client.Editors;
  uuid: string;
  tryProblemAction: tryProblemAction;
  tryProblemActionPrivileged: tryProblemActionPrivileged;
  tryReplyAction: tryReplyAction;
  fail: () => void;
  authUser: firebase.User;
  myRole: projectRole;
  newProblem: newProblem;
}

export interface ViewSectionProps {
  fixedSidebar: boolean;
  project: ProjectPrivate;
  uuid: string;
  authUser: firebase.User;
  problemProps: problemProps;
  problemFunctions: problemFunctions;
  myRole: projectRole;
  categoryColors: CategoryColors;
  difficultyColors: DifficultyColors;
}

interface ViewState {
  defaultScroll: number;
  scrollTop: number;
  bodyHeight: number;
  navbarHeight: number;
}

class View extends React.Component<ViewProps & RouteComponentProps, ViewState> {
  state = {
    defaultScroll: 0,
    scrollTop: 0,
    bodyHeight: 0,
    navbarHeight: 0,
  };

  private scrollSet = 0;

  constructor(props: ViewProps & RouteComponentProps) {
    super(props);

    this.problemProps = this.problemProps.bind(this);
    this.problemFunctions = this.problemFunctions.bind(this);
    this.setDefaultScroll = this.setDefaultScroll.bind(this);
  }

  problemProps: problemProps = (
    uuid: string,
    prob: ProblemType,
    authUser: firebase.User
  ) => {
    const types = Object.fromEntries(
      Object.keys(ReplyType).map((replyType) => [replyType, 0])
    ) as replyTypes;

    if (!!prob.replies) {
      prob.replies.forEach((reply) => {
        types[reply.type]++;
      });
    }

    return {
      ind: prob.ind,
      uuid: uuid,
      title: prob.title,
      text: prob.text,
      category: prob.category,
      difficulty: prob.difficulty,
      author: prob.author,
      tags: prob.tags,
      votes:
        Object.values(prob.votes).length === 0
          ? 0
          : (Object.values(prob.votes) as number[]).reduce((a, b) => a + b),
      myVote:
        Object.values(prob.votes).length === 0
          ? 0
          : prob.votes[authUser.displayName!],
      replyTypes: types,
      authUser: authUser,
    };
  };

  problemFunctions: problemFunctions = (
    uuid: string,
    prob: ProblemType,
    authUser: firebase.User
  ) => {
    return {
      tryProblemAction: (problemActionData: actionData, type: problemAction) =>
        this.props.tryProblemAction(prob.ind, problemActionData, type),
      tryProblemActionPrivileged: (
        problemActionPrivilegedData: actionData,
        type: problemActionPrivileged
      ) =>
        this.props.tryProblemActionPrivileged(
          prob.ind,
          problemActionPrivilegedData,
          type
        ),
      tryReplyAction: (
        replyInd: number,
        replyActionData: actionData,
        type: replyAction
      ) => this.props.tryReplyAction(prob.ind, replyInd, replyActionData, type),
    };
  };

  setDefaultScroll(defaultScroll: number) {
    if (this.scrollSet === 0) {
      this.setState({ defaultScroll });
    }
  }

  componentDidUpdate(prevProps: ViewProps & RouteComponentProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.scrollSet = 0;
    }
  }

  render() {
    const {
      background,
      project,
      myRole,
      editors,
      uuid,
      authUser,
      newProblem,
    } = this.props;

    // don't set the scroll again if you've already done it once
    if (!!this.state.defaultScroll || this.state.defaultScroll === 0) {
      this.scrollSet++;
    }

    // const menuBaseProps: Omit<ScrollBaseProps, "Sidebar" | "children"> = {
    //   sidebarWidth: 18,
    //   maxWidth: 1320,
    //   background: loadBackground,
    //   totalScroll: true,
    //   defaultScroll: this.scrollSet > 1 ? undefined : this.state.defaultScroll,
    //   authUser: authUser,
    // };

    const viewSectionProps: ViewSectionProps = {
      fixedSidebar: true,
      project,
      uuid,
      authUser,
      problemProps: this.problemProps,
      problemFunctions: this.problemFunctions,
      myRole,
      categoryColors: project.settings.categoryColors,
      difficultyColors: project.settings.difficultyColors,
    };

    return (
      <ScrollBase
        maxWidth={1320}
        background={background}
        customScrollTop={
          this.scrollSet > 1 ? undefined : this.state.defaultScroll
        }
      >
        <Switch>
          <Route
            exact
            path={[
              ROUTES.PROJECT_VIEW.replace(":uuid", uuid),
              ROUTES.PROJECT_OVERVIEW.replace(":uuid", uuid),
            ]}
            render={(_) => (
              <Overview
                {...viewSectionProps}
                problemFunctions={this.problemFunctions}
                setDefaultScroll={this.setDefaultScroll}
              />
            )}
          />
          <Route
            exact
            path={[
              ROUTES.PROJECT_PROBLEM.replace(":uuid", uuid),
              ROUTES.PROJECT_PROBLEM_REPLY.replace(":uuid", uuid),
            ]}
            render={(_) => (
              <Details
                {...viewSectionProps}
                setDefaultScroll={this.setDefaultScroll}
              />
            )}
          />
          <Route
            exact
            path={[
              ROUTES.PROJECT_COMPILE.replace(":uuid", uuid),
              ROUTES.PROJECT_LIST.replace(":uuid", uuid),
              ROUTES.PROJECT_ALL_PROBLEMS.replace(":uuid", uuid),
            ]}
            render={(_) => <Compile {...viewSectionProps} />}
          />
          <Route
            exact
            path={[ROUTES.PROJECT_SETTINGS.replace(":uuid", uuid)]}
            render={(_) => (
              <Settings
                {...viewSectionProps}
                editors={editors}
              />
            )}
          />
          <Route
            exact
            path={[ROUTES.PROJECT_NEW_PROBLEM.replace(":uuid", uuid)]}
            render={(_) => (
              <NewProblem
                {...viewSectionProps}
                newProblem={newProblem}
                difficultyRange={project.settings.difficultyRange}
              />
            )}
          />
        </Switch>
      </ScrollBase>
    );
  }
}

export default withRouter(View);
