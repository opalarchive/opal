import React from "react";
import { CategoryColors } from "../..";
import {
  Problem as ProblemType,
  ProjectPrivate,
} from "../../../../../../../.shared";
import {
  ProblemDetails,
  tryProblemAction,
} from "../../../../../Constants/types";
import Problem from "../../Problem";

interface ListViewerProps {
  problems: ProblemType[];
  problemInds: number[];
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
}

export default class ListViewer extends React.Component<ListViewerProps> {
  state = {};

  render() {
    const {
      problems,
      problemInds,
      problemProps,
      uuid,
      tryProblemAction,
      clickedTags,
      onClickTag,
      authUser,
    } = this.props;
    return problemInds.map((ind) => (
      <Problem
        key={`problem-${ind}`}
        {...problemProps(uuid, problems[ind], tryProblemAction, authUser)}
        repliable
        clickedTags={clickedTags}
        onClickTag={onClickTag}
      />
    ));
  }
}
