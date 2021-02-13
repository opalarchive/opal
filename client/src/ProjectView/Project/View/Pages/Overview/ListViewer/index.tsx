import React from "react";
import { Problem as ProblemType } from "../../../../../../../../.shared";
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
  onClickTag: (tagText: string) => void;
  clickedTags: {
    [tag: string]: boolean;
  };
  allTags: Set<string>;
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
      clickedTags,
      onClickTag,
      authUser,
      allTags,
    } = this.props;

    return problemList.map((prob) => (
      <Problem
        key={`problem-${prob.ind}`}
        {...problemProps(uuid, prob, tryProblemAction, tryProblemActionPrivileged, authUser)}
        repliable
        clickedTags={clickedTags}
        onClickTag={onClickTag}
        allTags={allTags}
      />
    ));
  }
}
