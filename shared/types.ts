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

export interface EditStatus {
  lastEdit: number;
  shareDate: number;
  starred: boolean;
}

export interface Editors {
  [key: string]: EditStatus;
}

export interface ProjectPublic {
  editors: Editors;
  name: string;
  owner: string;
  trashed: boolean;
}

// uuid => ProjectPublic
export interface Publico {
  [key: string]: ProjectPublic;
}
