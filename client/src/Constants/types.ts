import {
  actionData,
  problemAction,
  problemActionPrivileged,
  ReplyType,
  Problem,
  replyAction,
  List,
} from "../../../.shared";

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
  data: actionData,
  type: problemAction
) => Promise<void>;

export type tryProblemActionPrivileged = (
  ind: number,
  data: actionData,
  type: problemActionPrivileged
) => Promise<void>;

export type tryReplyAction = (
  ind: number,
  replyInd: number,
  data: actionData,
  type: replyAction
) => Promise<void>;

export type newProblem = (problem: Omit<Problem, "ind">) => Promise<void>;
export type newList = (list: List) => Promise<void>;

export type problemProps = (
  uuid: string,
  prob: Problem,
  authUser: firebase.User
) => ClientProblem;

export interface problemFunctionsExtracted {
  tryProblemAction: (data: actionData, type: problemAction) => Promise<void>;
  tryProblemActionPrivileged: (
    data: actionData,
    type: problemActionPrivileged
  ) => Promise<void>;
  tryReplyAction: (
    replyInd: number,
    data: actionData,
    type: replyAction
  ) => Promise<void>;
}

export type problemFunctions = (
  uuid: string,
  prob: Problem,
  authUser: firebase.User
) => problemFunctionsExtracted;

export interface ClientProblem {
  uuid: string;
  ind: number;
  title: string;
  text: string;
  category: string;
  difficulty: number;
  author: string;
  tags: string[];
  votes: number;
  myVote: number;
  replyTypes: replyTypes;
  authUser: firebase.User;
}
