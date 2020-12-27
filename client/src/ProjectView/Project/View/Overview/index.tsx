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
  keyword: string;
  author: string;
  difficultyRange: { start: number; end: number };
  category: {
    [category: string]: boolean;
  };
  clickedTags: {
    [tag: string]: boolean;
  };
}

class Overview extends React.Component<OverviewProps, OverviewState> {
  state = {
    filter: (problem: ProblemType) => true,
    sortWeight: (problem: ProblemType) => problem.ind,
    keyword: "",
    author: "",
    difficultyRange: { start: 0, end: 0 },
    category: {} as {
      [category: string]: boolean;
    },
    clickedTags: {} as { [tag: string]: boolean },
  };

  constructor(props: OverviewProps) {
    super(props);

    this.setFilter = this.setFilter.bind(this);
    this.setSortWeight = this.setSortWeight.bind(this);
    this.filterUsed = this.filterUsed.bind(this);
    this.onClickTag = this.onClickTag.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  setFilter(filter: (problem: ProblemType) => boolean) {
    this.setState({ filter });
  }

  setSortWeight(sortWeight: (problem: ProblemType) => number) {
    this.setState({ sortWeight });
  }

  filterUsed(
    type: "keyword" | "author" | "category" | "tag" | "difficulty"
  ): boolean {
    switch (type) {
      case "keyword":
        return this.state.keyword !== "";
      case "author":
        return this.state.author !== "";
      case "category":
        return !Object.values(this.state.category).reduce(
          (a, b) => a && !b,
          true
        ); // just cant all be false/undefined
      case "tag":
        return !Object.values(this.state.clickedTags).reduce(
          (a, b) => a && !b,
          true
        );
      case "difficulty":
        return (
          this.state.difficultyRange.start !==
            this.props.difficultyRange.start ||
          this.state.difficultyRange.end !== this.props.difficultyRange.end
        );
    }
  }

  resetFilter() {
    const { keyword, author, difficultyRange } = this.state;

    this.setFilter((problem: ProblemType) => {
      if (this.filterUsed("keyword")) {
        if (
          !problem.text
            .toLocaleLowerCase()
            .includes(keyword.toLocaleLowerCase()) &&
          !problem.title
            .toLocaleLowerCase()
            .includes(keyword.toLocaleLowerCase())
        ) {
          return false;
        }
      }
      if (this.filterUsed("author")) {
        if (!problem.author.startsWith(author)) return false;
      }
      if (this.filterUsed("category")) {
        if (!this.state.category[problem.category]) return false;
      }
      if (this.filterUsed("tag")) {
        let works = false;
        for (let i = 0; i < problem.tags.length; i++) {
          if (this.state.clickedTags[problem.tags[i]]) {
            works = true;
            break;
          }
        }
        if (!works) return false;
      }
      if (this.filterUsed("difficulty")) {
        if (
          difficultyRange.start >= problem.difficulty ||
          problem.difficulty >= difficultyRange.end
        )
          return false;
      }
      return true;
    });
  }

  onChange(
    name: string,
    value: any,
    type: "keyword" | "author" | "category" | "tag" | "difficulty"
  ) {
    switch (type) {
      case "keyword":
        this.setState({ keyword: value as string }, () => this.resetFilter());
        break;
      case "author":
        this.setState({ author: value as string }, () => this.resetFilter());
        break;
      case "category":
        this.setState(
          {
            category: {
              ...this.state.category,
              [name]: !this.state.category[name],
            },
          },
          () => this.resetFilter()
        );
        break;
      case "tag":
        break;
      case "difficulty":
        const difficultyArray = value as number[];
        this.setState(
          {
            difficultyRange: {
              start: difficultyArray[0],
              end: difficultyArray[1],
            },
          },
          () => this.resetFilter()
        );
        break;
    }
  }

  onClickTag(tagText: string) {
    this.setState(
      {
        clickedTags: {
          ...this.state.clickedTags,
          [tagText]: !this.state.clickedTags[tagText],
        },
      },
      this.resetFilter
    );
  }

  componentDidMount() {
    this.setState({ difficultyRange: this.props.difficultyRange });
  }

  render() {
    const {
      menuBaseProps,
      project,
      categoryColors,
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
          keyword: this.state.keyword,
          author: this.state.author,
          difficulty: this.state.difficultyRange,
          difficultyRange: this.props.difficultyRange,
          category: this.state.category,
          categoryColors,
          editors,
          allTags,
          clickedTags: this.state.clickedTags,
          resetFilter: this.resetFilter,
          filterUsed: this.filterUsed,
          onChange: this.onChange,
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
