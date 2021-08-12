import {
  isUserId,
  postTextMaxLength,
  problemTitleMaxLength,
  UserId,
} from "./constants";

export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}

export interface Color {
  r: number;
  g: number;
  b: number;
}
const isRGBValue = (n: number) => {
  return isFinite(n) && n >= 0 && n < 256;
};

export const isColor = (o: unknown): o is Color => {
  if (typeof o !== "object" || !o) {
    return false;
  }
  if (!hasOwnProperty(o, "r") || typeof o.r !== "number" || !isRGBValue(o.r)) {
    return false;
  }
  if (!hasOwnProperty(o, "g") || typeof o.g !== "number" || !isRGBValue(o.g)) {
    return false;
  }
  if (!hasOwnProperty(o, "b") || typeof o.b !== "number" || !isRGBValue(o.b)) {
    return false;
  }
  return true;
};

/*
 * The idea here is that if success is true, the value must be of type output.
 * Otherwise, it must be of type string for the error.
 */
interface ResponseBase<Success, Output> {
  success: Success;
  value: Success extends true ? Output : string;
}

export type Response<Output> =
  | ResponseBase<true, Output>
  | ResponseBase<false, Output>;

/* Project Management */

export enum ProjectRole {
  OWNER,
  ADMIN,
  EDITOR,
  REMOVED,
}

export type projectRole = keyof typeof ProjectRole;

export interface EditStatus {
  lastEdit: number;
  shareDate: number;
  starred: boolean;
  role: projectRole;
}

export interface Editors {
  [uid: string]: EditStatus;
}

export interface ProjectPublic {
  editors: Editors;
  name: string;
  owner: string;
  trashed: boolean;
}

/* 
Project Edtiting Types

NOTE: Because this json is stored in firebase realtime database, null, undefined, and 
most importantly empty arrays and objects are simply discarded when stored. Thus, 
when fetching it and checking for validity, we set a value to an empty array/object if
it is supposed to be an empty array/object when it arrives undefined.
*/
export interface Project {
  lists: List[];
  problems: Problem[];
  settings: Settings;
}
export const isProject = (o: unknown): o is Project => {
  if (typeof o !== "object" || !o) {
    return false;
  }

  if (
    hasOwnProperty(o, "lists") &&
    (!Array.isArray(o.lists) || o.lists.some((list) => !isList(list)))
  ) {
    return false;
  }
  (o as Project).lists = hasOwnProperty(o, "lists") ? (o.lists as List[]) : [];
  if (
    hasOwnProperty(o, "problems") &&
    (!Array.isArray(o.problems) || o.problems.some((prob) => !isProblem(prob)))
  ) {
    return false;
  }
  (o as Project).problems = hasOwnProperty(o, "problems")
    ? (o.problems as Problem[])
    : [];
  if (!hasOwnProperty(o, "settings") || !isSettings(o.settings)) {
    return false;
  }

  return true;
};

/**
 * Problems or categories could possibly have been deleted, and valid difficulties
 * could have changed. This function takes care of that by cleaning up a project
 * object. Note that it directly modifies said object, rather than returning it.
 */
export const cleanupProject = (proj: Project): void => {
  proj.problems;
};

export interface List {
  name: string;
  problems: number[];
}
export const isList = (o: unknown): o is List => {
  if (typeof o !== "object" || !o) {
    return false;
  }
  if (!hasOwnProperty(o, "name") || typeof o.name !== "string") {
    return false;
  }
  if (
    hasOwnProperty(o, "problems") &&
    (!Array.isArray(o.problems) ||
      o.problems.some((prob) => typeof prob !== "number"))
  ) {
    return false;
  }
  (o as List).problems = hasOwnProperty(o, "problems")
    ? (o.problems as number[])
    : [];
  return true;
};

interface Post {
  author: string;
  text: string;
  time: number;
  lastEdit: number;
}
const isPost = (o: unknown): o is Post => {
  if (typeof o !== "object" || !o) {
    return false;
  }
  if (!hasOwnProperty(o, "author") || typeof o.author !== "string") {
    return false;
  }
  if (
    !hasOwnProperty(o, "text") ||
    typeof o.text !== "string" ||
    o.text.length > postTextMaxLength
  ) {
    return false;
  }
  if (!hasOwnProperty(o, "time") || typeof o.time !== "number") {
    return false;
  }
  if (!hasOwnProperty(o, "lastEdit") || typeof o.lastEdit !== "number") {
    return false;
  }
  return true;
};

export interface Problem extends Post {
  category: string;
  difficulty: number;
  replies: Reply[];
  tags: string[];
  title: string;
  votes: Votes;
}
export const isProblem = (o: unknown): o is Problem => {
  if (!isPost(o)) {
    return false;
  }
  if (!hasOwnProperty(o, "category") || typeof o.category !== "string") {
    return false;
  }
  if (!hasOwnProperty(o, "difficulty") || typeof o.difficulty !== "number") {
    return false;
  }
  if (
    hasOwnProperty(o, "replies") &&
    (!Array.isArray(o.replies) || o.replies.some((reply) => !isReply(reply)))
  ) {
    return false;
  }
  (o as Problem).replies = hasOwnProperty(o, "replies")
    ? (o.replies as Reply[])
    : [];
  if (
    hasOwnProperty(o, "tags") &&
    (!Array.isArray(o.tags) || o.tags.some((tag) => typeof tag !== "string"))
  ) {
    return false;
  }
  (o as Problem).tags = hasOwnProperty(o, "tags") ? (o.tags as string[]) : [];
  if (
    !hasOwnProperty(o, "title") ||
    typeof o.title !== "string" ||
    o.title.length > problemTitleMaxLength
  ) {
    return false;
  }
  if (hasOwnProperty(o, "votes") && !isVotes(o.votes)) {
    return false;
  }
  (o as Problem).votes = hasOwnProperty(o, "votes") ? (o.votes as Votes) : {};

  return true;
};

export enum ReplyType {
  COMMENT = "COMMENT",
  SOLUTION = "SOLUTION",
}

export interface Comment extends Post {
  type: ReplyType.COMMENT;
}
export const isComment = (o: unknown): o is Comment => {
  if (!isPost(o)) {
    return false;
  }
  if (!hasOwnProperty(o, "type") || o.type !== ReplyType.COMMENT) {
    return false;
  }
  return true;
};

export interface Solution extends Post {
  type: ReplyType.SOLUTION;
}
export const isSolution = (o: unknown): o is Solution => {
  if (!isPost(o)) {
    return false;
  }
  if (!hasOwnProperty(o, "type") || o.type !== ReplyType.SOLUTION) {
    return false;
  }
  return true;
};

export type Reply = Comment | Solution;
export const isReply = (o: unknown): o is Reply => {
  return isComment(o) || isSolution(o);
};

export type Vote = 0 | 1 | -1;
export const isVote = (o: unknown): o is Vote => {
  return o === 0 || o === 1 || o === -1;
};

export type Votes = Record<UserId, Vote>;
export const isVotes = (o: unknown): o is Vote => {
  if (typeof o !== "object" || !o) {
    return false;
  }
  if (Object.keys(o).some((key) => !isUserId(key))) {
    return false;
  }
  if (Object.values(o).some((val) => !isVote(val))) {
    return false;
  }
  return true;
};

export interface Settings {
  categoryColors: CategoryColors;
  difficultyColors: DifficultyColors;
  difficultyRange: DifficultyRange;
}
export const isSettings = (o: unknown): o is Settings => {
  if (typeof o !== "object" || !o) {
    return false;
  }
  if (
    !hasOwnProperty(o, "categoryColors") ||
    !isCategoryColors(o.categoryColors)
  ) {
    return false;
  }
  if (
    !hasOwnProperty(o, "difficultyColors") ||
    !isDifficultyColors(o.difficultyColors)
  ) {
    return false;
  }
  if (
    !hasOwnProperty(o, "difficultyRange") ||
    !isDifficultyRange(o.difficultyRange)
  ) {
    return false;
  }
  return true;
};

export type CategoryColors = Record<string, Color>;
export const isCategoryColors = (o: unknown): o is CategoryColors => {
  if (typeof o !== "object" || !o) {
    return false;
  }
  if (Object.keys(o).some((key) => typeof key !== "string")) {
    return false;
  }
  if (Object.values(o).some((val) => !isColor(val))) {
    return false;
  }
  return true;
};

export type DifficultyColors = Record<string, Color>;
export const isDifficultyColors = (o: unknown): o is DifficultyColors => {
  if (typeof o !== "object" || !o) {
    return false;
  }
  if (
    Object.keys(o).some(
      (key) => typeof key !== "string" || isNaN(parseInt(key))
    )
  ) {
    return false;
  }
  if (Object.values(o).some((val) => !isColor(val))) {
    return false;
  }
  return true;
};

export interface DifficultyRange {
  start: number;
  end: number;
}
export const isDifficultyRange = (o: unknown): o is DifficultyRange => {
  if (typeof o !== "object" || !o) {
    return false;
  }
  if (
    !hasOwnProperty(o, "start") ||
    typeof o.start !== "number" ||
    !isFinite(o.start)
  ) {
    return false;
  }
  if (
    !hasOwnProperty(o, "end") ||
    typeof o.end !== "number" ||
    !isFinite(o.end)
  ) {
    return false;
  }
  if (o.start >= o.end) {
    return false;
  }

  return true;
};

/**
 * Filtering types
 */
export enum SortParam {
  INDEX = "INDEX",
  DIFFICULTY = "DIFFICULTY",
  VOTES = "VOTES",
}
