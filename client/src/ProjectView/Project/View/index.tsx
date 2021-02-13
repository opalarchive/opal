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
  tupleToRGBString,
  camelToTitle,
  lerp,
  lowerBound,
} from "../../../Constants";
import {
  data,
  Problem as ProblemType,
  problemAction,
  ProjectPrivate,
  ReplyType,
} from "../../../../../.shared/src/types";
import {
  FrontendProblem,
  replyTypes,
  tryProblemAction,
  newProblem,
} from "../../../Constants/types";
import Overview from "./Pages/Overview";
import Compile from "./Pages/Compile";
import NewProblem from "./Pages/NewProblem";

interface ViewProps {
  project: ProjectPrivate;
  editors: string[];
  uuid: string;
  tryProblemAction: tryProblemAction;
  fail: () => void;
  authUser: firebase.User;
  newProblem: newProblem;
}

export interface ViewSectionProps {
  project: ProjectPrivate;
  uuid: string;
  authUser: firebase.User;
}

export interface CategoryColors {
  [category: string]: number[];
}

interface DifficultyColors {
  [difficultyKey: number]: number[]; // basically keyframes but with colors
}

interface ViewState {
  categoryColors: CategoryColors;
  difficultyColors: DifficultyColors;
  difficultyRange: {
    start: number;
    end: number;
  };
  defaultScroll: number;
  scrollTop: number;
  bodyHeight: number;
  navbarHeight: number;
}

class View extends React.Component<ViewProps & RouteComponentProps, ViewState> {
  state = {
    categoryColors: {
      algebra: [241, 37, 30],
      geometry: [35, 141, 25],
      combinatorics: [21, 52, 224],
      numberTheory: [173, 19, 179],
      miscellaneous: [100, 100, 110],
    } as CategoryColors,
    difficultyColors: {
      0: [0, 200, 100],
      25: [0, 200, 255],
      50: [150, 50, 255],
      51: [255, 150, 0],
      75: [255, 0, 0],
      100: [0, 0, 0],
    } as DifficultyColors,
    difficultyRange: { start: 0, end: 100 },
    defaultScroll: 0,
    scrollTop: 0,
    bodyHeight: 0,
    navbarHeight: 0,
  };

  private scrollSet = 0;

  constructor(props: ViewProps & RouteComponentProps) {
    super(props);

    this.getCategoryColor = this.getCategoryColor.bind(this);
    this.getDifficultyColor = this.getDifficultyColor.bind(this);
    this.problemProps = this.problemProps.bind(this);
    this.setDefaultScroll = this.setDefaultScroll.bind(this);
  }

  getCategoryColor(category: string) {
    return this.state.categoryColors[category];
  }

  // linearlly interpolate the difficulty color using keyframesque colors
  getDifficultyColor(difficulty: number) {
    const colors = this.state.difficultyColors;
    const keys = Object.keys(colors).map((key) => parseInt(key));

    let top = lowerBound(keys, difficulty);
    const difficultyColor = colors[keys[top]];

    if (top === 0) {
      return difficultyColor;
    }
    return difficultyColor.map((value, ind) =>
      lerp(
        keys[top - 1],
        keys[top],
        colors[keys[top - 1]][ind],
        colors[keys[top]][ind],
        difficulty
      )
    ) as number[];
  }

  problemProps(
    uuid: string,
    prob: ProblemType,
    tryProblemAction: tryProblemAction,
    authUser: firebase.User
  ): FrontendProblem {
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
      category: {
        name: camelToTitle(prob.category),
        color: tupleToRGBString(this.getCategoryColor(prob.category)),
      },
      difficulty: {
        name: prob.difficulty,
        color: tupleToRGBString(this.getDifficultyColor(prob.difficulty)),
      },
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
      tryProblemAction: (problemActionData: data, type: problemAction) =>
        tryProblemAction(prob.ind, problemActionData, type),
      replyTypes: types,
      authUser: authUser,
    };
  }

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
      project,
      editors,
      uuid,
      tryProblemAction,
      authUser,
      match,
      newProblem,
    } = this.props;

    const loadBackground = "rgb(0, 0, 0, 0.025)";

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

    const viewSectionProps = {
      fixedSidebar: true,
      project,
      uuid,
      authUser,
    };

    return (
      <ScrollBase
        maxWidth={1320}
        background={loadBackground}
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
                categoryColors={this.state.categoryColors}
                difficultyRange={this.state.difficultyRange}
                editors={editors}
                problemProps={this.problemProps}
                tryProblemAction={tryProblemAction}
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
                problemProps={this.problemProps}
                tryProblemAction={tryProblemAction}
                setDefaultScroll={this.setDefaultScroll}
              />
            )}
          />
          <Route
            exact
            path={[ROUTES.PROJECT_COMPILE.replace(":uuid", uuid)]}
            render={(_) => (
              <Compile
                {...viewSectionProps}
                categoryColors={this.state.categoryColors}
                difficultyRange={this.state.difficultyRange}
                editors={editors}
                problemProps={this.problemProps}
                tryProblemAction={tryProblemAction}
              />
            )}
          />
          <Route
            exact
            path={[ROUTES.PROJECT_NEW_PROBLEM.replace(":uuid", uuid)]}
            render={(_) => (
              <NewProblem
                {...viewSectionProps}
                categoryColors={this.state.categoryColors}
                difficultyRange={this.state.difficultyRange}
                editors={editors}
                problemProps={this.problemProps}
                tryProblemAction={tryProblemAction}
                newProblem={newProblem}
              />
            )}
          />
        </Switch>
      </ScrollBase>
    );
  }
}

export default withRouter(View);
