import React from "react";

import {
  ProjectPrivate,
  Problem as ProblemType,
} from "../../../../../../.shared";
import { ProblemDetails, tryProblemAction } from "../../../../Constants/types";
import MenuBase, { MenuBaseProps } from "../../../MenuBase";
import Problem from "../Problem";
import Filter from "./Filter";

interface OverviewProps {
  menuBaseProps: Omit<MenuBaseProps, "Sidebar" | "children">;
  project: ProjectPrivate;
  uuid: string;
  problemProps: (
    uuid: string,
    ind: number,
    prob: ProblemType,
    tryProblemAction: tryProblemAction,
    authUser: firebase.User
  ) => ProblemDetails;
  tryProblemAction: tryProblemAction;
  authUser: firebase.User;
  setDefaultScroll: (scroll: number) => void;
}
const Overview: React.FC<OverviewProps> = ({
  menuBaseProps,
  project,
  problemProps,
  uuid,
  tryProblemAction,
  authUser,
}) => {
  return (
    <MenuBase Sidebar={Filter} {...menuBaseProps}>
      {project.problems.map((prob, ind) => (
        <Problem
          key={`problem-${ind}`}
          {...problemProps(uuid, ind, prob, tryProblemAction, authUser)}
          repliable
        />
      ))}
    </MenuBase>
  );
};

export default Overview;
