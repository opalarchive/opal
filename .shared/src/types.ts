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

export namespace Server {
  export interface EditStatus {
    lastEdit: number;
    shareDate: number;
    starred: boolean;
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
  }

  export interface Publico {
    [uuid: string]: ProjectPublic;
  }
}

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
export type vote = 0 | 1 | -1;

export type data = string | number;

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

export interface List {
  name: string;
  problems: number[];
}

export interface ProjectPrivate {
  lists: List[];
  problems: Problem[]
}

export enum ProjectActionProtected {
  SHARE,
  DELETE,
  CHANGE_NAME,
  RESTORE,
}

export type projectActionProtected = keyof typeof ProjectActionProtected;

export const isProjectActionProtected = (
  input: projectAction
): input is projectActionProtected => {
  return Object.keys(ProjectActionProtected).includes(input);
};

export enum ProjectActionTrivial {
  STAR,
}

export type projectActionTrivial = keyof typeof ProjectActionTrivial;

export const isProjectActionTrivial = (
  input: projectAction
): input is projectActionTrivial => {
  return Object.keys(ProjectActionTrivial).includes(input);
};

export type projectAction = projectActionTrivial | projectActionProtected;
export type problemAction = "vote" | "comment";
