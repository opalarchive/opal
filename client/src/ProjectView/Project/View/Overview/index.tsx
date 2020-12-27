import React from "react";
import { CategoryColors } from "..";

import {
  ProjectPrivate,
  Problem as ProblemType,
} from "../../../../../../.shared";
import { ProblemDetails, tryProblemAction } from "../../../../Constants/types";
import MenuBase, { MenuBaseProps } from "../../../MenuBase";
import Problem from "../Problem";
import Filter from "./Filter";

interface OverviewProps {
  menuBaseProps: Omit<MenuBaseProps, "Sidebar" | "children">;
  project: ProjectPrivate;
  uuid: string;
  categoryColors: CategoryColors;
  difficultyRange: { start: number; end: number };
  editors: string[];
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

interface OverviewState {
  filter: (problem: ProblemType) => boolean;
  sortWeight: (problem: ProblemType) => number; // sorting by weight from least to greatest
  clickedTags: {
    [tag: string]: boolean;
  };
}

class Overview extends React.Component<OverviewProps, OverviewState> {
  state = {
    filter: (problem: ProblemType) => true,
    sortWeight: (problem: ProblemType) => problem.ind,
    clickedTags: {} as { [tag: string]: boolean },
  };

  constructor(props: OverviewProps) {
    super(props);

    this.setFilter = this.setFilter.bind(this);
    this.setSortWeight = this.setSortWeight.bind(this);
    this.onClickTag = this.onClickTag.bind(this);
  }

  setFilter(filter: (problem: ProblemType) => boolean) {
    this.setState({ filter });
  }

  setSortWeight(sortWeight: (problem: ProblemType) => number) {
    this.setState({ sortWeight });
  }

  onClickTag(tagText: string, callBack?: () => void) {
    this.setState(
      {
        clickedTags: {
          ...this.state.clickedTags,
          [tagText]: !this.state.clickedTags[tagText],
        },
      },
      callBack
    );
  }

  render() {
    const {
      menuBaseProps,
      project,
      categoryColors,
      difficultyRange,
      editors,
      problemProps,
      uuid,
      tryProblemAction,
      authUser,
    } = this.props;

    const allTags = new Set<string>();

    project.problems.forEach((prob) => {
      prob.tags.forEach((tag) => allTags.add(tag));
    });

    const problems = project.problems
      .filter((prob) => this.state.filter(prob))
      .sort((p1, p2) => this.state.sortWeight(p1) - this.state.sortWeight(p2));

    return (
      <MenuBase
        Sidebar={Filter}
        {...menuBaseProps}
        sidebarProps={{
          setFilter: this.setFilter,
          setSortWeight: this.setSortWeight,
          categoryColors,
          difficultyRange,
          editors,
          allTags,
          clickedTags: this.state.clickedTags,
          onClickTag: this.onClickTag,
        }}
      >
        {problems.map((prob) => (
          <Problem
            key={`problem-${prob.ind}`}
            {...problemProps(uuid, prob, tryProblemAction, authUser)}
            repliable
            clickedTags={this.state.clickedTags}
            onClickTag={this.onClickTag}
          />
        ))}
      </MenuBase>
    );
  }
}

export default Overview;
