export const siteURL = !process.env.PRODUCTION
  ? `http://localhost:${process.env.NEXT_PUBLIC_PORT}`
  : process.env.PRODUCTION_URL;

/**
 * A uuid is a string serving as a unique identifier
 * for each opal project that is 20 characters long.
 * It always starts with a 'p' (for project). The rest
 * is (probably) random base 64.
 **/
export const uuidLength = 20;
export type UUID = string;
export function isUUID(maybe: any): maybe is UUID {
  if (typeof maybe !== "string") {
    return false;
  }
  return maybe.length === uuidLength && maybe.slice(0, 1) === "p";
}

/**
 * A userId is a string serving as a unique identifier
 * for each user that is 20 characters long. It always
 * starts with a 'u' (for user). The rest is (probably)
 * random base 64.
 **/
export const userIdLength = 20;
export type UserId = string;
export function isUserId(maybe: any): maybe is UserId {
  if (typeof maybe !== "string") {
    return false;
  }
  return maybe.length === userIdLength && maybe.slice(0, 1) === "u";
}

/** Length of random string sent in link to verify email */
export const emailVerifiyLength = 64;

export const emailVerifyTokenLifespan = 24 * 60 * 60 * 1000; // 24 hours
export const emailVerifyCooldown = 15 * 60 * 1000; // 15 minute cooldown between sending another in order to not spam the email system

export const problemTitleMaxLength = 64;
export const problemTextMaxLength = 65536;

export const listNameMaxLength = 16;

export const passwordSaltLength = 32; // in nibbles (1/2 bytes or hex chars)
export const passwordKeyLength = 64; // in bytes

export const accessTokenDuration = "5s";

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
