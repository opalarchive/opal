import {
  data,
  problemAction,
  reply,
  ReplyType,
} from "../../../.shared/src/types";

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

export interface ProblemDetails {
  uuid: string;
  ind: number;
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
  problemAction: (data: data, type: problemAction) => Promise<void>;
  replyTypes: replyTypes;
  authUser: firebase.User;
}
