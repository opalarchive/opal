import { withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { ViewSectionProps } from "../..";

import { Server } from "../../../../../../../.shared";
import { problemFunctions, problemProps } from "../../../../../Constants/types";
import SidebaredBase from "../../../../Template/SidebaredBase";
import styles from "./index.css";
import Navigation from "./Navigation";

import * as ROUTES from "../../../../../Constants/routes";
import Export from "./Export";

interface CompileProps extends ViewSectionProps {
  editors: Server.Editors;
  problemProps: problemProps;
  problemFunctions: problemFunctions;
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
    const { project, fixedSidebar, authUser, classes } = this.props;

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
          <Export project={project} currentList={this.state.currentList} />
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
