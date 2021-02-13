import firebase from "firebase/app";
import "firebase/auth";
import FirebaseContext, { withFirebase } from "./context";
import {
  UsernameInfo,
  ProjectPrivate,
  Notification,
  Client,
  projectActionAdmin,
  data,
  Problem,
} from "../../../.shared/";
import { Result } from "../Constants/types";

export { FirebaseContext, withFirebase };

var firebaseConfig = {
  apiKey: "AIzaSyA5FtY_otDq2-P9Z4NFKoInrK6_kKhYuo0",
  authDomain: "opal-5625e.firebaseapp.com",
  databaseURL: "https://opal-5625e.firebaseio.com",
  projectId: "opal-5625e",
  storageBucket: "opal-5625e.appspot.com",
  messagingSenderId: "1073802644774",
  appId: "1:1073802644774:web:c4c498378739c0d44085e7",
  measurementId: "G-M6M62MF7RN",
};

const fetchLocation =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:2718";

/**
 * Fetches from the server using a POST request.
 * @param Output expected output on success
 * @param url url to fetch from
 * @param data body of the POST request
 * @returns A promise returning a Result of type Output or string.
 * It is guaranteed that result.value is of type Output when result.success is true,
 * and result.value is of type string when result.success is false.
 */
export async function post<Output>(
  url: string,
  data: object,
  authUser?: firebase.User
): Promise<Result<Output>> {
  if (!!authUser) {
    const idToken = await authUser.getIdToken();

    data = { ...data, token: idToken };
  }

  const attempt = await fetch(`${fetchLocation}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const value: string = await attempt.text();
  let output: Output;
  let result: Result<Output> = { success: false, value };

  const success = attempt.status >= 200 && attempt.status < 300;

  try {
    output = JSON.parse(value);

    if (success) {
      result = { success: true, value: output };
    }
  } catch (_) {
    /*
     Assume that the serverside response is in the correct format i.e. 
     if it returns success, and we cannot parse it to JSON it must be 
     a string. Similarly, we must also assume that the clientside 
     function call is valid, i.e. that the given Output type is a 
     subtype of string
     there doesn't seem to be a good way to implement a check for this
    */
    if (success) {
      result = { success: true, value: (value as unknown) as Output };
    }
  } finally {
    return result;
  }
}

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();

export const getUsernames = async (): Promise<Result<string[]>> => {
  const usernamesObject = await post<UsernameInfo[]>(
    "public/getAllUsernames",
    {}
  );
  return { success: true, value: Object.keys(usernamesObject.value) };
};

export const createUser = async (
  username: string,
  password: string,
  email: string
): Promise<Result<null>> => {
  const attempt = await post<null>("public/createAccount", {
    username,
    password,
    email,
  });
  if (!attempt.success)
    return { success: false, value: understandSignupError(attempt.value) };

  // immediately sign them in
  return auth
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      return { success: true, value: null } as Result<null>;
    })
    .catch((error: { code: string; message: string }) => {
      console.log(error.code);
      return { success: false, value: understandLoginError(error.code) };
    });
};

export const getVisibleProjects = async (authUser: firebase.User) => {
  return await post<Client.Publico>("private/visibleProjects", {}, authUser);
};

export const tryProjectActionAdmin = async (
  uuid: string,
  authUser: firebase.User,
  type: projectActionAdmin,
  data?: string
): Promise<Result<string>> => {
  return await post<string>(
    "private/projectActionAdmin",
    {
      uuid,
      type,
      data: !!data ? data : "",
    },
    authUser
  );
};

export const starProject = async (uuid: string, authUser: firebase.User) => {
  return await post<string>("private/starProject", { uuid }, authUser);
};

export const getNotifications = async (authUser: firebase.User) => {
  return await post<Notification[]>("private/getNotifications", {}, authUser);
};

export const markAllNotifications = async (
  authUser: firebase.User,
  number: number
) => {
  return await post<string>("private/markNotifications", { number }, authUser);
};

export const getProjectPrivate = async (
  uuid: string,
  authUser: firebase.User
) => {
  return await post<ProjectPrivate | string>(
    "private/projectPrivate",
    {
      uuid,
    },
    authUser
  );
};

export const getProjectName = async (uuid: string, authUser: firebase.User) => {
  return await post<string>("private/projectName", { uuid }, authUser);
};

export const newProject = async (authUser: firebase.User) => {
  return await post<string>("private/newProject", {}, authUser);
};

export const tryProblemAction = async (
  uuid: string,
  problemInd: number,
  data: data,
  type: string,
  authUser: firebase.User
) => {
  return await post<string>(
    "private/problemAction",
    {
      uuid,
      problemInd,
      data,
      type,
    },
    authUser
  );
};

export const tryProblemActionPrivileged = async (
  uuid: string,
  problemInd: number,
  data: data,
  type: string,
  authUser: firebase.User
) => {
  return await post<string>(
    "private/problemActionPrivileged",
    {
      uuid,
      problemInd,
      data,
      type,
    },
    authUser
  );
};

export const newProblem = async (
  uuid: string,
  problem: Omit<Problem, "ind">,
  authUser: firebase.User
) => {
  return await post<string>(
    "private/newProblem",
    {
      uuid,
      problem
    },
    authUser
  );
};

export const changeList = async (
  uuid: string,
  listSelection: boolean[],
  problemInd: number,
  authUser: firebase.User
) => {
  return await post<string>(
    "private/changeList",
    {
      uuid,
      listSelection,
      problemInd,
    },
    authUser
  );
};

/*
export const changeTags = async (
  uuid: string,
  clickedTags: object,
  problemInd: number,
  authUser: firebase.User
) => {
  return await post<string>(
    "private/changeTags",
    {
      uuid,
      clickedTags,
      problemInd,
    },
    authUser
  );
};

export const newTag = async (
  uuid: string,
  newTag: string,
  problemInd: number,
  authUser: firebase.User
) => {
  return await post<string>(
    "private/newTag",
    {
      uuid,
      newTag,
      problemInd,
    },
    authUser
  );
};
*/

export const understandSignupError = (e: string) => {
  switch (e) {
    case "auth/email-already-in-use":
      return "This email address is already in use. Please use an alternate address.";
    case "auth/invalid-user-token":
      return "It seems like your token has expired. Refresh the page and try again.";
    case "auth/network-request-failed":
      return "There was a network error. Refresh the page and try again.";
    case "auth/too-many-requests":
      return "There were too many requests from this device. Wait 5 minutes, refresh the page, and try again.";
    case "auth/user-token-expired":
      return "It seems that your token has expired. Refresh the page and try again.";
    case "auth/user-not-found":
      return "It seems that you do not have an account. Please sign up and try again.";
    case "auth/user-disabled":
      return "Your account has been disabled. Email us at `email` to resolve this.";
    case "auth/web-storage-unsupported":
      return "We use IndexedDB to store your credentials. If you have disabled this, please re-enable it so we can keep you logged in.";
    case "auth/no-empty-username":
      return "You can't sign up with an empty username. Please enter a username and try again.";
    case "auth/incorrect-username-syntax":
      return "Usernames can only contain alphanumeric characters and underscores. Make sure that your username only contains such characters";
    case "auth/username-already-exists":
      return "The username already exists. Please try to input a different username.";
    case "auth/invalid-email":
      return "The email is invalid. Please try again with a valid email.";
    case "auth/username-too-long":
      return "The username is too long. Please enter a username of at most 40 characters.";
    case "auth/email-too-long":
      return "The email is too long. Please enter a email of at most 60 characters.";
    case "auth/password-too-short":
      return "The password is too short. Please make sure that the password is at least 8 characters long";
    case "auth/incorrect-password-format":
      return "The password must contain at least one captial letter, one lowercase letter, one number, and one special character";
    case "auth/invalid-grade":
      return "The grade must be a positive integer";
    default:
      return "This looks like an error on our side. Please refresh the page and try again, or contact us with the issue!";
  }
};

export const understandLoginError = (e: string) => {
  const email = "onlineproblemarchivallocation@gmail.com";
  switch (e) {
    case "auth/invalid-email":
      return "The email is invalid. Please try again with a valid email.";
    case "auth/user-not-found":
      return "It seems that you do not have an account. Please sign up and try again.";
    case "auth/user-disabled":
      return `Your account has been disabled. Email us at ${email} to resolve this.`;
    case "auth/wrong-password":
      return "The password is incorrect. Please try to type the password correctly.";
    case "auth/too-many-requests":
      return "There were too many requests from this device. Wait 5 minutes, refresh the page, and try again.";
    default:
      return "This looks like an error on our side. Please refresh the page and try again, or contact us with the issue!";
  }
};
