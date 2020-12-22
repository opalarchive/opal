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

interface Post {
  author: string;
  text: string;
  time: number;
}

export interface Comment extends Post {
  type: "comment";
}

export interface Solution extends Post {
  type: "solution";
}

export type Reply = Comment | Solution;
export type Vote = 1 | -1;

export interface Votes {
  [uid: string]: Vote;
}

export interface Problem {
  author: string;
  category: string;
  difficulty: number;
  replies: Reply[];
  tags: string[];
  text: string;
  title: string;
  votes: Votes;
}

export interface ProjectPrivate {
  problems: Problem[];
}
