import firebase from "firebase/app";
import "firebase/auth";
import FirebaseContext, { withFirebase } from "./context";

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

const post = async (url, data) => {
  const attempt = await fetch(`${fetchLocation}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let value = await attempt.text();

  try {
    value = JSON.parse(value);
  } finally {
    return { status: attempt.status >= 200 && attempt.status < 300, value };
  }
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();

export const getUsernames = async (_) => {
  const usernamesObject = await post("getAllUsernames", {});
  return Object.keys(usernamesObject);
};

export const createUser = async (username, password, email) => {
  const works = await post("createAccount", { username, password, email });
  if (works.status !== 201) return works.value;

  // immediately sign them in
  auth.signInWithEmailAndPassword(email, password).catch((error) => {
    console.log(error.code);
  });

  return;
};

export const getVisibleProjects = async (uid) => {
  return (
    await post("visibleProjects", {
      authuid: uid,
    })
  ).value;
};

export const changeName = async (name, uuid, authuid) => {
  const attempt = await post("projectAction", {
    data: name,
    uuid,
    authuid,
    type: "changeName",
  });

  if (attempt.status) return attempt.value;

  return { success: true };
};

export const restoreProject = async (uuid, authuid) => {
  const attempt = await post("projectAction", {
    data: "",
    uuid,
    authuid,
    type: "restore",
  });

  if (attempt.status) return attempt.value;

  return { success: true };
};

export const deleteProject = async (uuid, authuid) => {
  const attempt = await post("projectAction", {
    data: "",
    uuid,
    authuid,
    type: "delete",
  });

  if (attempt.status) return attempt.value;

  return { success: true };
};

export const deleteForeverProject = async (uuid, authuid) => {};

export const shareProject = async (username, uuid, authuid) => {
  const attempt = await post("projectAction", {
    data: username,
    uuid,
    authuid,
    type: "share",
  });

  if (attempt.status) return attempt.value;

  return { success: true };
};

export const starProject = async (uuid, authuid) => {
  const attempt = await post("starProject", { uuid, authuid });

  if (attempt.status) return attempt.value;

  return { success: true };
};

export const getNotifications = async (authuid) => {
  return await post("getNotifications", { authuid });
};

export const markAllNotifications = async (authuid, number) => {
  const attempt = await post("markNotifications", { authuid, number });

  if (attempt.status) return attempt.value;

  return { success: true };
};

export const getProjectPrivate = async (uuid, authuid) => {
  const attempt = await post("projectPrivate", { uuid, authuid });

  return attempt.value;
};

export const getProjectName = async (uuid, authuid) => {
  const attempt = await post("projectName", { uuid, authuid });

  return {
    success: attempt.status && attempt.value !== "unconfigured",
    value: attempt.value,
  };
};

export const newProject = async (uid) => {
  return await (await post("newProject"), { uid }).value();
};

export const tryProblemAction = async (
  uuid,
  problemId,
  data,
  type,
  authuid
) => {
  const attempt = await post("problemAction", {
    uuid,
    problemId,
    data,
    type,
    authuid,
  });

  if (!attempt.status || attempt.value === "unconfigured") {
    return attempt.value;
  }
  return { success: true };
};

export const understandError = (e) => {
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
