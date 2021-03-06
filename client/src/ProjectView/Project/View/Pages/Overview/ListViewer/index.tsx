import React from "react";
import {
  CategoryColors,
  DifficultyColors,
  Problem as ProblemType,
  projectRole,
} from "../../../../../../../../.shared/src";
import {
  problemFunctions,
  problemProps,
} from "../../../../../../Constants/types";
import Problem from "../../../Embedded/Problem";

interface ListViewerProps {
  problemList: ProblemType[];
  uuid: string;
  authUser: firebase.User;
  problemProps: problemProps;
  problemFunctions: problemFunctions;
  categoryColors: CategoryColors;
  difficultyColors: DifficultyColors;
  onClickTag: (tagText: string) => void;
  clickedTags: {
    [tag: string]: boolean;
  };
  allTags: Set<string>;
  myRole: projectRole;
}

export default class ListViewer extends React.PureComponent<ListViewerProps> {
  state = {};

  render() {
    const {
      problemList,
      problemProps,
      uuid,
      problemFunctions,
      categoryColors,
      difficultyColors,
      clickedTags,
      onClickTag,
      authUser,
      allTags,
      myRole,
    } = this.props;

    return problemList.map((prob) => (
      <Problem
        key={`problem-${prob.ind}`}
        {...problemProps(uuid, prob, authUser)}
        {...problemFunctions(uuid, prob, authUser)}
        abridged
        categoryColors={categoryColors}
        difficultyColors={difficultyColors}
        clickedTags={clickedTags}
        onClickTag={onClickTag}
        allTags={allTags}
        myRole={myRole}
      />
    ));
  }
}
