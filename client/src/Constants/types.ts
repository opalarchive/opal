import { data, problemAction, problemActionPrivileged, ReplyType, Problem, replyAction } from "../../../.shared";

/*
 * The idea here is that if success is true, the value must be of type output.
 * Otherwise, it must be of type string for the error.
 */
interface ResultBase<Success, Output> {
  success: Success;
  value: Success extends true ? Output : string;
}

export type Result<Output> =
  | ResultBase<true, Output>
  | ResultBase<false, Output>;

// project related types

export type ProjectViewType =
  | "priority"
  | "myProjects"
  | "sharedWithMe"
  | "recent"
  | "trash";

export type ProjectDataPoint =
  | "name"
  | "owner"
  | "lastModified"
  | "shareDate"
  | "lastModifiedByMe"
  | "lastModifier";

export type SortDirection = "asc" | "desc";

export interface ProjectViewSort {
  dataPoint: ProjectDataPoint;
  direction: SortDirection;
}

export interface ProjectViewFilter {
  includeMine: boolean;
  includeShared: boolean;
  includeAllStarred: boolean;
  includeTrash: boolean;
}

export interface ProjectView {
  filter: ProjectViewFilter;
  data: ProjectDataPoint[];
  fixed: boolean;
  defaultSort: ProjectViewSort;
}

export type replyTypes = {
  -readonly // defaults to readonly for some reason
  [type in keyof typeof ReplyType]: number;
};

export interface Category {
  name: string;
  color: string;
}

export interface Difficulty {
  name: number;
  color: string;
}

export type tryProblemAction = (
  ind: number,
  data: data,
  type: problemAction
) => Promise<void>;

export type tryProblemActionPrivileged = (
  ind: number,
  data: data,
  type: problemActionPrivileged
) => Promise<void>;

export type tryReplyAction = (
  ind: number,
  replyInd: number,
  data: data,
  type: replyAction
) => Promise<void>;

export type newProblem = (
  problem: Omit<Problem, "ind">
) => Promise<void>;

export type problemProps = (
  uuid: string,
  prob: Problem,
  authUser: firebase.User
) => FrontendProblem;

export interface problemFunctionsObj {
  tryProblemAction: (data: data, type: problemAction) => Promise<void>;
  tryProblemActionPrivileged: (data: data, type: problemActionPrivileged) => Promise<void>;
  tryReplyAction: (replyInd: number, data: data, type: replyAction) => Promise<void>;
}

export type problemFunctions = (
  uuid: string,
  prob: Problem,
  authUser: firebase.User
) => problemFunctionsObj;

export interface FrontendProblem {
  uuid: string;
  ind: number;
  title: string;
  text: string;
  category: {
    name: string;
    color: string;
  };
  difficulty: {
    name: number;
    color: string;
  };
  author: string;
  tags: string[];
  votes: number;
  myVote: number;
  replyTypes: replyTypes;
  authUser: firebase.User;
}
