import { withStyles, WithStyles, AppBar, Toolbar, Menu, MenuItem, ListItemIcon, ListItemText, IconButton } from "@material-ui/core";
import { ArrowDropDownCircleSharp } from '@material-ui/icons';
import React from "react";
import { CategoryColors, ViewSectionProps } from "..";

import { Problem as ProblemType } from "../../../../../../.shared";
import {
  ProblemDetails,
  SortDirection,
  tryProblemAction,
} from "../../../../Constants/types";
import SidebaredBase from "../../../Template/SidebaredBase";
import Problem from "../Problem";
import Filter from "./Filter";
import styles from "./index.css";

interface OverviewProps extends WithStyles<typeof styles>, ViewSectionProps {
  fixedSidebar: boolean;
  sidebarYOffset: number;
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
  sort: {
    dataPoint: "ind" | "difficulty" | "votes";
    direction: SortDirection;
  };
  listMenuAnchorEl: EventTarget | null;
  currentList: number;
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
    sort: {
      dataPoint: "ind",
      direction: "desc",
    } as {
      dataPoint: "ind" | "difficulty" | "votes";
      direction: SortDirection;
    },
    listMenuAnchorEl: null,
    currentList: 0,
  };

  constructor(props: OverviewProps) {
    super(props);

    this.setFilter = this.setFilter.bind(this);
    this.setSortWeight = this.setSortWeight.bind(this);
    this.filterUsed = this.filterUsed.bind(this);
    this.onClickTag = this.onClickTag.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSortClick = this.onSortClick.bind(this);
    this.openListMenu = this.openListMenu.bind(this);
    this.closeListMenu = this.closeListMenu.bind(this);
  }

  openListMenu(event: React.MouseEvent<HTMLButtonElement>) {
    this.setState({ listMenuAnchorEl: event.currentTarget });
  }

  closeListMenu() {
    this.setState({ listMenuAnchorEl: null });
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

  resetSort() {
    const { dataPoint, direction } = this.state.sort;
    const sign = direction === "asc" ? 1 : -1;

    this.setSortWeight((problem: ProblemType) => {
      let magnitude = 0;
      switch (dataPoint) {
        case "ind":
          magnitude = problem.ind;
          break;
        case "difficulty":
          magnitude = problem.difficulty;
          break;
        case "votes":
          magnitude =
            Object.values(problem.votes).length === 0
              ? 0
              : (Object.values(problem.votes) as number[]).reduce(
                  (a, b) => a + b
                );
          break;
      }
      return sign * magnitude;
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

  onSortClick(
    event: React.MouseEvent<HTMLButtonElement>,
    dataPoint: "ind" | "difficulty" | "votes"
  ) {
    let sort = { dataPoint: dataPoint, direction: "asc" as SortDirection };
    if (dataPoint === this.state.sort.dataPoint) {
      sort = {
        dataPoint,
        direction: this.state.sort.direction === "asc" ? "desc" : "asc",
      };
    }
    this.setState({ sort }, () => this.resetSort());
  }

  componentDidMount() {
    this.setState({ difficultyRange: this.props.difficultyRange });
    this.resetSort(); // nothing should be filtered out at the beginning, but the problems will not be sorted
  }

  render() {
    const {
      height,
      fixedSidebar,
      sidebarYOffset,
      project,
      categoryColors,
      editors,
      problemProps,
      uuid,
      tryProblemAction,
      authUser,
      classes,
    } = this.props;

    const { listMenuAnchorEl } = this.state;

    const allTags = new Set<string>();

    const listProblems = this.state.currentList < 0 ? project.problems : project.lists[this.state.currentList].problems.map((probIndex) => project.problems[probIndex]);

    listProblems.forEach((prob) => {
      prob.tags.forEach((tag) => allTags.add(tag));
    });

    const problems = listProblems
      .filter((prob) => this.state.filter(prob))
      .sort((p1, p2) => {
        const w1 = this.state.sortWeight(p1),
          w2 = this.state.sortWeight(p2);
        if (w1 === w2)
          return (
            (this.state.sort.direction === "asc" ? 1 : -1) * (p1.ind - p2.ind)
          );
        return w1 - w2;
      });

    return (
      <SidebaredBase
        sidebarWidth={18}
        Sidebar={Filter}
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
          sort: this.state.sort,
          resetFilter: this.resetFilter,
          filterUsed: this.filterUsed,
          onChange: this.onChange,
          onClickTag: this.onClickTag,
          onSortClick: this.onSortClick,
        }}
        fixedSidebar={fixedSidebar}
        sidebarYOffset={sidebarYOffset}
        height={height}
        authUser={authUser}
      >
        <AppBar position="sticky" className={classes.headerWrapper}>
          <Toolbar>
            <div className={classes.logo}>
              <div className={classes.filler} />
                <IconButton
                  color="inherit"
                  onClick={this.openListMenu}
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                >
                  <ArrowDropDownCircleSharp /> {this.state.currentList < 0 ? "All Problems" : project.lists[this.state.currentList].name}
                </IconButton>
                <Menu
                  id="customized-menu"
                  anchorEl={listMenuAnchorEl}
                  keepMounted
                  open={Boolean(listMenuAnchorEl)}
                  onClose={this.closeListMenu}
                  elevation={0}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  {project.lists.map((list, ind) => (
                    <MenuItem onClick={() => this.setState({ currentList: ind })}>
                      {list.name}
                    </MenuItem>
                  ))}
                  <MenuItem onClick={() => this.setState({ currentList: -1 })}>
                    All Problems
                  </MenuItem>
                </Menu>
              <div className={classes.filler} />
            </div>
            <div className={classes.filler} />
          </Toolbar>
        </AppBar>
        <div className={classes.root}>
          {problems.map((prob) => (
            <Problem
              key={`problem-${prob.ind}`}
              {...problemProps(uuid, prob, tryProblemAction, authUser)}
              repliable
              clickedTags={this.state.clickedTags}
              onClickTag={this.onClickTag}
            />
          ))}
        </div>
      </SidebaredBase>
    );
  }
}

export default withStyles(styles)(Overview);
