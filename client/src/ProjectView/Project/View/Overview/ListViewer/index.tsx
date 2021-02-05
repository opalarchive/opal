import React from "react";
import { Problem as ProblemType } from "../../../../../../../.shared";
import {
  ProblemDetails,
  tryProblemAction,
} from "../../../../../Constants/types";
import Problem from "../../Problem";

interface ListViewerProps {
  problemList: ProblemType[];
  uuid: string;
  authUser: firebase.User;
  problemProps: (
    uuid: string,
    prob: ProblemType,
    tryProblemAction: tryProblemAction,
    authUser: firebase.User
  ) => ProblemDetails;
  tryProblemAction: tryProblemAction;
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
      clickedTags,
      onClickTag,
      authUser,
      allTags
    } = this.props;

    return problemList.map((prob) => (
      <Problem
        key={`problem-${prob.ind}`}
        {...problemProps(uuid, prob, tryProblemAction, authUser)}
        repliable
        clickedTags={clickedTags}
        onClickTag={onClickTag}
        allTags={allTags}
      />
    ));
  }
}
