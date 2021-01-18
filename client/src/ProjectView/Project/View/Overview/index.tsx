import {
  withStyles,
  WithStyles,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  IconButton,
} from "@material-ui/core";
import { ArrowDropDownCircleSharp } from "@material-ui/icons";
import React from "react";
import { CategoryColors, ViewSectionProps } from "..";

import { Problem as ProblemType } from "../../../../../../.shared";
import { ProblemDetails, tryProblemAction } from "../../../../Constants/types";
import SidebaredBase from "../../../Template/SidebaredBase";
import Filter from "./Filter";
import styles from "./index.css";
import ListViewer from "./ListViewer";

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
  // filter: (problem: ProblemType) => boolean;
  // sortWeight: (problem: ProblemType) => { p: number, s: number }; // sorting by weight from least to greatest without fallback number
  clickedTags: {
    [tag: string]: boolean;
  };
  listMenuAnchorEl: EventTarget | null;
  currentList: number;
  problemList: number[];
}

class Overview extends React.PureComponent<OverviewProps, OverviewState> {
  private filter = (problem: ProblemType) => true;
  private sortWeight: (problem: ProblemType) => { p: number; s: number } = (
    problem: ProblemType
  ) => ({ p: problem.ind, s: problem.ind });

  state = {
    // filter: (problem: ProblemType) => true,
    // sortWeight: (problem: ProblemType) => problem.ind,
    clickedTags: {} as { [tag: string]: boolean },
    listMenuAnchorEl: null,
    currentList: -1,
    problemList: [],
  };

  constructor(props: OverviewProps) {
    super(props);

    this.setFilter = this.setFilter.bind(this);
    this.setSortWeight = this.setSortWeight.bind(this);
    this.onClickTag = this.onClickTag.bind(this);
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
    this.filter = filter;
    this.resetProblemIndexList();
  }

  setSortWeight(
    sortWeight: (problem: ProblemType) => { p: number; s: number }
  ) {
    this.sortWeight = sortWeight;
    this.resetProblemIndexList();
  }

  onClickTag(tagText: string) {
    this.setState({
      clickedTags: {
        ...this.state.clickedTags,
        [tagText]: !this.state.clickedTags[tagText],
      },
    });
  }

  getProblemIndexList() {
    const {
      project: { problems, lists },
    } = this.props;

    return [...Array(problems.length).keys()]
      .filter(
        (ind) =>
          this.filter(problems[ind]) &&
          (this.state.currentList < 0 ||
            lists[this.state.currentList].problems.includes(ind))
      )
      .sort((ind1, ind2) => {
        const w1 = this.sortWeight(problems[ind1]),
          w2 = this.sortWeight(problems[ind2]);
        if (w1.p === w2.p) return w1.s - w2.s;
        return w1.p - w2.p;
      });
  }

  resetProblemIndexList() {
    this.setState({ problemList: this.getProblemIndexList() });
  }

  componentDidMount() {
    this.resetProblemIndexList();
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

    const listProblems =
      this.state.currentList < 0
        ? project.problems
        : project.lists[this.state.currentList].problems.map(
            (probIndex) => project.problems[probIndex]
          );

    listProblems.forEach((prob) => {
      prob.tags.forEach((tag) => allTags.add(tag));
    });
    console.log(this.state.currentList);

    return (
      <SidebaredBase
        sidebarWidth={18}
        Sidebar={Filter}
        sidebarProps={{
          setFilter: this.setFilter,
          setSortWeight: this.setSortWeight,
          difficultyRange: this.props.difficultyRange,
          categoryColors,
          editors,
          allTags,
          clickedTags: this.state.clickedTags,
          onClickTag: this.onClickTag,
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
                <ArrowDropDownCircleSharp />{" "}
                {this.state.currentList < 0
                  ? "All Problems"
                  : project.lists[this.state.currentList].name}
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
                  <MenuItem
                    key={`list-${ind}`}
                    onClick={() => this.setState({ currentList: ind })}
                  >
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
          <ListViewer
            problems={project.problems}
            problemInds={this.state.problemList}
            uuid={uuid}
            authUser={authUser}
            problemProps={problemProps}
            tryProblemAction={tryProblemAction}
            onClickTag={this.onClickTag}
            clickedTags={this.state.clickedTags}
          />
        </div>
      </SidebaredBase>
    );
  }
}

export default withStyles(styles)(Overview);
