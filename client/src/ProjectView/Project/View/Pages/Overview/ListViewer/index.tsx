import React from "react";
import { Problem as ProblemType, Server } from "../../../../../../../../.shared";
import {
  FrontendProblem,
  tryProblemAction,
  tryProblemActionPrivileged,
} from "../../../../../../Constants/types";
import Problem from "../../../Embedded/Problem";

interface ListViewerProps {
  problemList: ProblemType[];
  uuid: string;
  authUser: firebase.User;
  problemProps: (
    uuid: string,
    prob: ProblemType,
    tryProblemAction: tryProblemAction,
    tryProblemActionPrivileged: tryProblemActionPrivileged,
    authUser: firebase.User
  ) => FrontendProblem;
  tryProblemAction: tryProblemAction;
  tryProblemActionPrivileged: tryProblemActionPrivileged;
  getCategoryColor: (category: string) => number[];
  getDifficultyColor: (difficulty: number) => number[];
  onClickTag: (tagText: string) => void;
  clickedTags: {
    [tag: string]: boolean;
  };
  allTags: Set<string>;
  editors: Server.Editors;
}

export default class ListViewer extends React.Component<ListViewerProps> {
  state = {};

  render() {
    const {
      problemList,
      problemProps,
      uuid,
      tryProblemAction,
      tryProblemActionPrivileged,
      getCategoryColor,
      getDifficultyColor,
      clickedTags,
      onClickTag,
      authUser,
      allTags,
      editors,
    } = this.props;

    return problemList.map((prob) => (
      <Problem
        key={`problem-${prob.ind}`}
        {...problemProps(uuid, prob, tryProblemAction, tryProblemActionPrivileged, authUser)}
        repliable
        getCategoryColor={getCategoryColor}
        getDifficultyColor={getDifficultyColor}
        clickedTags={clickedTags}
        onClickTag={onClickTag}
        allTags={allTags}
        editors={editors}
      />
    ));
  }
}
