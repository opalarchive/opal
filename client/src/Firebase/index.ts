import firebase from "firebase/app";
import "firebase/auth";
import FirebaseContext, { withFirebase } from "./context";
import {
  UsernameInfo,
  ProjectPrivate,
  Notification,
  Client,
} from "../../../.shared//src/types";

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
async function post<Output>(
  url: string,
  data: object
): Promise<Result<Output | string>> {
  const attempt = await fetch(`${fetchLocation}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let value: string | Output = await attempt.text();

  try {
    value = JSON.parse(value);
  } finally {
    return { success: attempt.status >= 200 && attempt.status < 300, value };
  }
}

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();

export const getUsernames = async (): Promise<Result<string[]>> => {
  const usernamesObject = await post<UsernameInfo[]>("getAllUsernames", {});
  return { success: true, value: Object.keys(usernamesObject.value) };
};

export const createUser = async (
  username: string,
  password: string,
  email: string
): Promise<Result<null>> => {
  const works = await post<null>("createAccount", {
    username,
    password,
    email,
  });
  if (!works.success) return { success: false, value: null };

  // immediately sign them in
  return auth
    .signInWithEmailAndPassword(email, password)
    .then((_) => {
      return { success: true, value: null };
    })
    .catch((error) => {
      console.log(error.code);
      return { success: false, value: null };
    });
};

export const getVisibleProjects = async (authuid: string) => {
  return await post<Client.ProjectPublic>("visibleProjects", { authuid });
};

export const tryProjectAction = async (
  uuid: string,
  authuid: string,
  type: string,
  data?: string
): Promise<Result<string>> => {
  return await post("projectAction", { uuid, authuid, type, data });
};

export const starProject = async (uuid: string, authuid: string) => {
  return await post("starProject", { uuid, authuid });
};

export const getNotifications = async (authuid: string) => {
  return await post<Notification[]>("getNotifications", { authuid });
};

export const markAllNotifications = async (authuid: string, number: string) => {
  return await post<string>("markNotifications", { authuid, number });
};

export const getProjectPrivate = async (uuid: string, authuid: string) => {
  return await post<ProjectPrivate>("projectPrivate", { uuid, authuid });
};

export const getProjectName = async (uuid: string, authuid: string) => {
  return await post<string>("projectName", { uuid, authuid });
};

export const newProject = async (uid: string) => {
  return await post<string>("newProject", { uid });
};

export const tryProblemAction = async (
  uuid: string,
  problemId: string,
  data: string,
  type: string,
  authuid: string
) => {
  return await post<string>("problemAction", {
    uuid,
    problemId,
    data,
    type,
    authuid,
  });
};

export const understandError = (e: string) => {
  let error = "";
  switch (e) {
    case "auth/email-already-exists":
      error =
        "This email address is already in use. Please use an alternate address.";
      break;
    case "auth/invalid-user-token":
      error =
        "It seems like your token has expired. Refresh the page and try again.";
      break;
    case "auth/network-request-failed":
      error = "There was a network error. Refresh the page and try again.";
      break;
    case "auth/too-many-requests":
      error =
        "There were too many requests from this device. Wait 5 minutes, refresh the page, and try again.";
      break;
    case "auth/user-token-expired":
      error =
        "It seems that your token has expired. Refresh the page and try again.";
      break;
    case "auth/user-not-found":
      error =
        "It seems that you do not have an account. Please sign up and try again.";
      break;
    case "auth/user-disabled":
      error =
        "Your account has been disabled. Email us at `email` to resolve this.";
      break;
    case "auth/web-storage-unsupported":
      error =
        "We use IndexedDB to store your credentials. If you have disabled this, please re-enable it so we can keep you logged in.";
      break;
    case "auth/no-empty-username":
      error =
        "You can't sign up with an empty username. Please enter a username and try again.";
      break;
    case "auth/incorrect-username-syntax":
      error =
        "Usernames can only contain alphanumeric characters and underscores. Make sure that your username only contains such characters";
      break;
    case "auth/username-already-exists":
      error =
        "The username already exists. Please try to input a different username.";
      break;
    case "auth/invalid-email":
      error = "The email is invalid. Please try again with a valid email.";
      break;
    case "auth/wrong-password":
      error =
        "The password is incorrect. Please try to type the password correctly.";
      break;
    default:
      error =
        "This looks like an error on our side. Please refresh the page and try again, or contact us with the issue!";
  }
  return error;
};
