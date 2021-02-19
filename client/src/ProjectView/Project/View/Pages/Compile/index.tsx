import { withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { CategoryColors, ViewSectionProps } from "../..";

import { Server } from "../../../../../../../.shared";
import { problemFunctions, problemProps } from "../../../../../Constants/types";
import SidebaredBase from "../../../../Template/SidebaredBase";
import styles from "./index.css";
import Navigation from "./Navigation";

import * as ROUTES from "../../../../../Constants/routes";
import Export from "./Export";
import ListDetails from "./ListDetails";
import Problems from "./Problems";

interface CompileProps extends ViewSectionProps {
  editors: Server.Editors;
  problemProps: problemProps;
  problemFunctions: problemFunctions;
  categoryColors: CategoryColors;
  getCategoryColor: (category: string) => number[];
  getDifficultyColor: (difficulty: number) => number[];
}

interface CompileState {
  currentList: number;
}

interface CompileMatch {
  list: string;
}

class Compile extends React.Component<
  CompileProps & RouteComponentProps<CompileMatch> & WithStyles<typeof styles>,
  CompileState
> {
  state = {
    currentList: -1,
  };

  constructor(
    props: CompileProps &
      RouteComponentProps<CompileMatch> &
      WithStyles<typeof styles>
  ) {
    super(props);

    if (props.match.params.list !== undefined) {
      this.state = {
        ...this.state,
        currentList: parseInt(props.match.params.list),
      };
    }

    this.setCurrentList = this.setCurrentList.bind(this);
  }

  setCurrentList(list: number) {
    if (list === -1) {
      this.props.history.push(
        ROUTES.PROJECT_ALL_PROBLEMS.replace(":uuid", this.props.uuid)
      );
    } else {
      this.props.history.push(
        ROUTES.PROJECT_LIST.replace(":uuid", this.props.uuid).replace(
          ":list",
          "" + list
        )
      );
    }
    this.setState({ currentList: list });
  }

  render() {
    const {
      uuid,
      project,
      fixedSidebar,
      categoryColors,
      getCategoryColor,
      getDifficultyColor,
      authUser,
      classes,
    } = this.props;
    const problemList =
      this.state.currentList === -1
        ? project.problems
        : project.lists[this.state.currentList].problems.map(
            (probInd) => project.problems[probInd]
          );

    return (
      <SidebaredBase
        sidebarWidth={18}
        Sidebar={Navigation}
        sidebarProps={{
          lists: project.lists,
          currentList: this.state.currentList,
          setCurrentList: this.setCurrentList,
        }}
        fixedSidebar={fixedSidebar}
        authUser={authUser}
      >
        <div className={classes.root}>
          <ListDetails
            problemList={problemList}
            categoryColors={categoryColors}
            getCategoryColor={getCategoryColor}
            getDifficultyColor={getDifficultyColor}
          />
          {problemList.length !== 0 && (
            <>
              <Problems
                uuid={uuid}
                currentList={this.state.currentList}
                problemList={problemList}
                getCategoryColor={getCategoryColor}
                getDifficultyColor={getDifficultyColor}
                authUser={authUser}
              />
              <Export problemList={problemList} />
            </>
          )}
        </div>
      </SidebaredBase>
    );
  }
}

export default compose<
  CompileProps & RouteComponentProps<CompileMatch> & WithStyles<typeof styles>,
  CompileProps
>(
  withStyles(styles),
  withRouter
)(Compile);
