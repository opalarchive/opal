/**
 * General project management types
 */

export interface Config {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  databaseURL: string;
}

export interface Notification {
  content: string;
  link: string;
  read: boolean;
  timestamp: number;
  title: string;
}

// username => stuff
export interface UsernameInfo {
  email: string;
  uid: string;
}

// uid => stuff
export interface UserInfo {
  email: string;
  emailVerified: boolean;
  notifications?: Notification[];
  username: string;
}

// server only, contains all data
export namespace Server {
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

  export interface Publico {
    [uuid: string]: ProjectPublic;
  }
}

// client only, contains only relevant data
export namespace Client {
  export interface EditStatus {
    lastEdit: number;
  }

  export interface Editors {
    [uid: string]: EditStatus;
  }

  export interface ProjectPublic {
    editors: Editors;
    name: string;
    owner: string;
    trashed: boolean;
    starred: boolean;
    shareDate: number;
    role: projectRole;
  }

  export interface Publico {
    [uuid: string]: ProjectPublic;
  }
}

/**
 * Project related types
 */

export interface List {
  name: string;
  problems: number[];
}

export interface ProjectPrivate {
  lists: List[];
  problems: Problem[];
}

export enum ProjectRole {
  OWNER,
  ADMIN,
  EDITOR,
  REMOVED,
}

export type projectRole = keyof typeof ProjectRole;

// project actions

export enum ProjectActionOwner {
  MAKE_OWNER,
}

export type projectActionOwner = keyof typeof ProjectActionOwner;

export const isProjectActionOwner = (
  input: projectAction
): input is projectActionOwner => {
  return Object.keys(ProjectActionOwner).includes(input);
};

export enum ProjectActionAdmin {
  SHARE,
  DELETE,
  CHANGE_NAME,
  RESTORE,
  UNSHARE,
  PROMOTE,
  DEMOTE,
}

export type projectActionAdmin = keyof typeof ProjectActionAdmin;

export const isProjectActionAdmin = (
  input: projectAction
): input is projectActionAdmin => {
  return Object.keys(ProjectActionAdmin).includes(input);
};

export enum ProjectActionEditor {
  STAR,
}

export type projectActionEditor = keyof typeof ProjectActionEditor;

export const isProjectActionEditor = (
  input: projectAction
): input is projectActionEditor => {
  return Object.keys(ProjectActionEditor).includes(input);
};

export type projectAction =
  | projectActionOwner
  | projectActionAdmin
  | projectActionEditor;

/**
 * Problem related types
 */

export type vote = 0 | 1 | -1;
export type data = string | number | string[];

export interface Votes {
  [uid: string]: vote;
}

export interface Problem {
  ind: number;
  author: string;
  category: string;
  difficulty: number;
  replies: reply[];
  tags: string[];
  text: string;
  title: string;
  votes: Votes;
}

export type problemAction = "vote" | "comment" | "addTag" | "removeTag";
export type problemActionPrivileged = "title" | "text" | "category" | "difficulty";

/**
 * Reply related types
 */

export enum ReplyType {
  COMMENT = "COMMENT",
  SOLUTION = "SOLUTION",
}

interface Post {
  author: string;
  text: string;
  time: number;
}

export interface Comment extends Post {
  type: ReplyType.COMMENT;
}

export interface Solution extends Post {
  type: ReplyType.SOLUTION;
}

export type reply = Comment | Solution;
