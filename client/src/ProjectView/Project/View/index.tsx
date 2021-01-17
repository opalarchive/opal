import React from "react";
import { Route, Switch } from "react-router-dom";
import ScrollBase from "../../Template/ScrollBase";

import * as ROUTES from "../../../Constants/routes";
import Details from "./Details";
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
  ProblemDetails,
  replyTypes,
  tryProblemAction,
} from "../../../Constants/types";
import Overview from "./Overview";
import Navbar from "./Navbar";
import Compile from "./Compile";

interface ViewProps {
  project: ProjectPrivate;
  editors: string[];
  uuid: string;
  tryProblemAction: tryProblemAction;
  fail: () => void;
  authUser: firebase.User;
}

export interface ViewSectionProps {
  height: number;
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

class View extends React.Component<ViewProps, ViewState> {
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
  private navbarRef = React.createRef<HTMLDivElement>();

  constructor(props: ViewProps) {
    super(props);

    this.getCategoryColor = this.getCategoryColor.bind(this);
    this.getDifficultyColor = this.getDifficultyColor.bind(this);
    this.problemProps = this.problemProps.bind(this);
    this.setDefaultScroll = this.setDefaultScroll.bind(this);
    this.onBodyHeightChange = this.onBodyHeightChange.bind(this);
    this.onScrollTopChange = this.onScrollTopChange.bind(this);
    this.changeNavbarHeight = this.changeNavbarHeight.bind(this);
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
  ): ProblemDetails {
    const replyTypes = Object.fromEntries(
      Object.keys(ReplyType).map((replyType) => [replyType, 0])
    ) as replyTypes;

    if (!!prob.replies) {
      prob.replies.forEach((reply) => {
        replyTypes[reply.type]++;
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
      tryProblemAction: (data: data, type: problemAction) =>
        tryProblemAction(prob.ind, data, type),
      replyTypes,
      authUser: authUser,
    };
  }

  setDefaultScroll(defaultScroll: number) {
    if (this.scrollSet === 0) {
      this.setState({ defaultScroll });
    }
  }

  onScrollTopChange(scrollTop: number) {
    this.setState({ scrollTop });
  }

  onBodyHeightChange(height: number) {
    this.setState({ bodyHeight: height });
  }

  changeNavbarHeight() {
    this.setState({ navbarHeight: this.navbarRef.current!.clientHeight! });
  }

  componentDidMount() {
    this.changeNavbarHeight();
    window.addEventListener("resize", this.changeNavbarHeight);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.changeNavbarHeight);
  }

  render() {
    const { project, editors, uuid, tryProblemAction, authUser } = this.props;

    const loadBackground = "rgb(0, 0, 0, 0.025)";

    // don't set the scroll again if you've already done it once
    if (!!this.state.defaultScroll) {
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

    const scrollPastHeader = this.state.scrollTop >= this.state.navbarHeight;
    const viewableWindowHeight = scrollPastHeader
      ? this.state.bodyHeight
      : this.state.bodyHeight - this.state.navbarHeight + this.state.scrollTop;

    const viewSectionProps = {
      height: viewableWindowHeight,
      project,
      uuid,
      authUser,
    };

    const viewSectionWithSidebarProps = {
      fixedSidebar: scrollPastHeader,
      sidebarYOffset: -this.state.navbarHeight,
    };

    return (
      <ScrollBase
        maxWidth={1320}
        background={loadBackground}
        defaultScroll={
          this.scrollSet > 1 ? undefined : this.state.defaultScroll
        }
        onBodyHeightChange={this.onBodyHeightChange}
        onScrollTopChange={this.onScrollTopChange}
      >
        <Navbar uuid={uuid} forwardedRef={this.navbarRef} />

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
                {...viewSectionWithSidebarProps}
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
                {...viewSectionWithSidebarProps}
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
        </Switch>
      </ScrollBase>
    );
  }
}

export default View;
