import React from "react";
import { Problem as ProblemType, Server } from "../../../../../../../../.shared";
import {
  FrontendProblem,
  problemFunctions,
  problemProps,
  tryProblemAction,
  tryProblemActionPrivileged,
} from "../../../../../../Constants/types";
import Problem from "../../../Embedded/Problem";

interface ListViewerProps {
  problemList: ProblemType[];
  uuid: string;
  authUser: firebase.User;
  problemProps: problemProps;
  problemFunctions: problemFunctions;
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
      problemFunctions,
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
        {...problemProps(uuid, prob, authUser)}
        {...problemFunctions(uuid, prob, authUser)}
        getCategoryColor={getCategoryColor}
        getDifficultyColor={getDifficultyColor}
        repliable
        clickedTags={clickedTags}
        onClickTag={onClickTag}
        allTags={allTags}
        editors={editors}
      />
    ));
  }
}
