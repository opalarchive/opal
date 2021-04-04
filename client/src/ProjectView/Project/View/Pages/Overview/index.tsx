import { Button, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { ViewSectionProps } from "../..";

import { Problem as ProblemType } from "../../../../../../../.shared";
import { problemFunctions, problemProps } from "../../../../../Constants/types";
import SidebaredBase from "../../../../Template/SidebaredBase";
import Filter from "./Filter";
import styles from "./index.css";
import ListViewer from "./ListViewer";
import * as ROUTES from "../../../../../Constants/routes";
import { FiPlus } from "react-icons/fi";

interface OverviewProps extends WithStyles<typeof styles>, ViewSectionProps {
  fixedSidebar: boolean;
  problemProps: problemProps;
  problemFunctions: problemFunctions;
  setDefaultScroll: (scroll: number) => void;
}

interface OverviewState {
  filter: (problem: ProblemType) => boolean;
  sortWeight: (problem: ProblemType) => { p: number; s: number }; // sorting by weight from least to greatest without fallback number
  clickedTags: {
    [tag: string]: boolean;
  };
  currentList: number;
}

class Overview extends React.Component<OverviewProps, OverviewState> {
  state = {
    filter: (problem: ProblemType) => true,
    sortWeight: (problem: ProblemType) => ({
      p: -problem.ind,
      s: problem.ind,
    }),
    clickedTags: {} as { [tag: string]: boolean },
    currentList: -1,
  };

  constructor(props: OverviewProps) {
    super(props);

    this.setCurrentList = this.setCurrentList.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.setSortWeight = this.setSortWeight.bind(this);
    this.onClickTag = this.onClickTag.bind(this);
  }

  setCurrentList(list: number) {
    this.setState({ currentList: list });
  }

  setFilter(filter: (problem: ProblemType) => boolean) {
    this.setState({ filter });
  }

  setSortWeight(
    sortWeight: (problem: ProblemType) => { p: number; s: number }
  ) {
    this.setState({ sortWeight });
  }

  onClickTag(tagText: string) {
    this.setState({
      clickedTags: {
        ...this.state.clickedTags,
        [tagText]: !this.state.clickedTags[tagText],
      },
    });
  }

  render() {
    const {
      fixedSidebar,
      bodyHeight,
      project,
      myRole,
      problemProps,
      uuid,
      problemFunctions,
      authUser,
      classes,
    } = this.props;

    const allTags = new Set<string>();

    const listProblems =
      this.state.currentList < 0
        ? project.problems
        : project.lists[this.state.currentList].problems.map(
            (probIndex) => project.problems[probIndex]
          );

    const problemList = listProblems
      .filter((prob) => this.state.filter(prob))
      .sort((p1, p2) => {
        const w1 = this.state.sortWeight(p1),
          w2 = this.state.sortWeight(p2);
        if (w1.p === w2.p) return w1.s - w2.s;
        return w1.p - w2.p;
      });

    listProblems.forEach((prob) => {
      prob.tags.forEach((tag) => allTags.add(tag));
    });

    return (
      <SidebaredBase
        sidebarWidth={18}
        Sidebar={Filter}
        sidebarProps={{
          setFilter: this.setFilter,
          setSortWeight: this.setSortWeight,
          difficultyRange: project.settings.difficultyRange,
          categoryColors: project.settings.categoryColors,
          allTags,
          clickedTags: this.state.clickedTags,
          onClickTag: this.onClickTag,
          lists: project.lists,
          currentList: this.state.currentList,
          setCurrentList: this.setCurrentList,
        }}
        height={bodyHeight}
        fixedSidebar={fixedSidebar}
        authUser={authUser}
      >
        <div className={classes.root}>
          <div className={classes.buttonWrapper}>
            <div className={classes.filler} />
            <div className={classes.buttonContainer}>
              <Button
                variant="contained"
                color="secondary"
                href={ROUTES.PROJECT_NEW_PROBLEM.replace(":uuid", uuid)}
              >
                <FiPlus />
                &nbsp;New Problem
              </Button>
            </div>
          </div>
          <ListViewer
            problemList={problemList}
            uuid={uuid}
            authUser={authUser}
            problemProps={problemProps}
            problemFunctions={problemFunctions}
            categoryColors={project.settings.categoryColors}
            difficultyColors={project.settings.difficultyColors}
            onClickTag={this.onClickTag}
            clickedTags={this.state.clickedTags}
            allTags={allTags}
            myRole={myRole}
          />
        </div>
      </SidebaredBase>
    );
  }
}

export default withStyles(styles)(Overview);
