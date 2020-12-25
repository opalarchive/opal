import React from "react";
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from "react-router-dom";
import MenuBase from "../../MenuBase";
import Filter from "./Filter";
import Problem from "./Problem";

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
import { ProblemDetails, replyTypes } from "../../../Constants/types";

interface ViewProps {
  project: ProjectPrivate;
  uuid: string;
  problemAction: (
    ind: number,
    data: data,
    type: problemAction
  ) => Promise<void>;
  fail: () => void;
  authUser: firebase.User;
}

interface CategoryColors {
  [category: string]: number[];
}

interface DifficultyColors {
  [difficultyKey: number]: number[]; // basically keyframes but with colors
}

interface ViewState {
  categoryColors: CategoryColors;
  difficultyColors: DifficultyColors;
  defaultScroll: number;
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
    defaultScroll: 0,
  };

  private scrollSet = 0;

  constructor(props: ViewProps) {
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
    ind: number,
    prob: ProblemType,
    problemAction: (
      ind: number,
      data: data,
      type: problemAction
    ) => Promise<void>,
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
      ind: ind,
      uuid: uuid,
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
      votes: !!prob.votes
        ? (Object.values(prob.votes) as number[]).reduce((a, b) => a + b)
        : 0,
      myVote: !!prob.votes ? prob.votes[authUser.displayName!] : 0,
      problemAction: (data: data, type: problemAction) =>
        problemAction(ind, data, type),
      replyTypes,
      authUser: authUser,
    };
  }

  setDefaultScroll(defaultScroll: number) {
    this.setState({ defaultScroll });
  }

  render() {
    const { project, uuid, problemAction, fail, authUser } = this.props;

    const loadBackground = "rgb(0, 0, 0, 0.025)";

    // don't set the scroll again if you've already done it once
    if (!!this.state.defaultScroll) {
      this.scrollSet++;
    }

    interface DetailsMatch {
      uuid: string;
      ind: string;
      reply?: string;
    }

    const DetailsPage: React.FC<RouteComponentProps<DetailsMatch>> = ({
      match,
    }) => {
      const ind = parseInt(match.params.ind);
      const reply = !!match.params.reply
        ? parseInt(match.params.reply)
        : undefined;

      return (
        <Details
          replies={project.problems[ind].replies}
          {...this.problemProps(
            uuid,
            ind,
            project.problems[ind],
            problemAction,
            authUser
          )}
          setDefaultScroll={this.setDefaultScroll}
          reply={reply}
        />
      );
    };

    const RoutedDetails = withRouter(DetailsPage);

    return (
      <MenuBase
        width={20}
        right
        background={loadBackground}
        Sidebar={Filter}
        defaultScroll={
          this.scrollSet > 1 ? undefined : this.state.defaultScroll
        }
        authUser={authUser}
      >
        <Switch>
          <Route
            exact
            path={ROUTES.PROJECT_VIEW.replace(":uuid", uuid)}
            render={(_) => {
              return project.problems.map((prob, ind) => (
                <Problem
                  key={`problem-${ind}`}
                  {...this.problemProps(
                    uuid,
                    ind,
                    prob,
                    problemAction,
                    authUser
                  )}
                  repliable
                />
              ));
            }}
          />
          <Route
            exact
            path={[
              ROUTES.PROJECT_PROBLEM.replace(":uuid", uuid),
              ROUTES.PROJECT_PROBLEM_REPLY.replace(":uuid", uuid),
            ]}
            render={(_) => <RoutedDetails />}
          />
        </Switch>
      </MenuBase>
    );
  }
}

export default View;
