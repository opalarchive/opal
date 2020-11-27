import firebase from 'firebase/app';
import 'firebase/auth';
import FirebaseContext, { withFirebase } from './context';

export { FirebaseContext, withFirebase };

var firebaseConfig = {
  apiKey: "AIzaSyA5FtY_otDq2-P9Z4NFKoInrK6_kKhYuo0",
  authDomain: "opal-5625e.firebaseapp.com",
  databaseURL: "https://opal-5625e.firebaseio.com",
  projectId: "opal-5625e",
  storageBucket: "opal-5625e.appspot.com",
  messagingSenderId: "1073802644774",
  appId: "1:1073802644774:web:c4c498378739c0d44085e7",
  measurementId: "G-M6M62MF7RN"
};

const fetchLocation = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:2718';

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();

export const getUsernames = async _ => {
  const usernamesString = await fetch(`${fetchLocation}/get-all-usernames`).then(res => res.text());
  let usernamesObject = {};

  try {
    usernamesObject = JSON.parse(usernamesString);
  }
  catch (e) {
    return [];
  }
  return Object.keys(usernamesObject);
}

export const createUser = async (username, password, email) => {
  const works = await fetch(`${fetchLocation}/create-account?username=${username}&password=${password}&email=${email}`);
  if (works.status !== 201) return works.text();

  // immediately sign them in
  auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => {
      console.log(error.code);
    });

  return;
};

export const getVisibleProjects = async (uid) => {
  const projString = await fetch(`${fetchLocation}/visible-projects?authuid=${uid}`).then(res => res.text());
  let projObject = {};

  try {
    projObject = JSON.parse(projString);
  }
  catch (e) {
    return {};
  }
  return projObject;
};

export const deleteProject = async (uuid, authuid) => {
  const attempt = await fetch(`${fetchLocation}/delete-project?uuid=${uuid}&authuid=${authuid}`);

  if (attempt.status !== 201) return attempt.text();

  return { success: true };
}

export const deleteForeverProject = async (uuid, authuid) => {
  const attempt = await fetch(`${fetchLocation}/delete-forever-project?uuid=${uuid}&authuid=${authuid}`);

  if (attempt.status !== 201) return attempt.text();

  return { success: true };
}

export const shareProject = async (username, uuid, authuid) => {
  const attempt = await fetch(`${fetchLocation}/share-project?uuid=${uuid}&authuid=${authuid}&username=${username}`);

  if (attempt.status !== 201) return attempt.text();

  return { success: true };
}

export const changeName = async (name, uuid, authuid) => {
  const attempt = await fetch(`${fetchLocation}/change-project-name?uuid=${uuid}&authuid=${authuid}&projectname=${name}`);

  if (attempt.status !== 201) return attempt.text();

  return { success: true };
}

export const restoreProject = async (uuid, authuid) => {
  const attempt = await fetch(`${fetchLocation}/restore-project?uuid=${uuid}&authuid=${authuid}`);

  if (attempt.status !== 201) return attempt.text();

  return { success: true };
}

export const starProject = async (uuid, authuid) => {
  const attempt = await fetch(`${fetchLocation}/star-project?uuid=${uuid}&authuid=${authuid}`);

  if (attempt.status !== 201) return attempt.text();

  return { success: true };
}

export const getNotifications = async (authuid) => {
  const attempt = await fetch(`${fetchLocation}/get-notifications?authuid=${authuid}`);
  let notifications = [];

  if (attempt.status !== 201) return attempt.text();

  await attempt.text().then(text => {
    try {
      notifications = JSON.parse(text);
    }
    catch (e) {
      notifications = [];
    }
  });
  return notifications;
}

export const markAllNotifications = async (authuid, number) => {
  const attempt = await fetch(`${fetchLocation}/mark-notifications?authuid=${authuid}&number=${number}`);

  if (attempt.status !== 201) return attempt.text();

  return { success: true };
}

export const getProjectPrivate = async (uuid, authuid) => {
  const attempt = await fetch(`${fetchLocation}/project-private?uuid=${uuid}&authuid=${authuid}`);
  const text = await attempt.text();
  let projObject = {};

  if (attempt.status !== 200 || text === 'unconfigured') {
    return text;
  }

  try {
    projObject = JSON.parse(text);
  } catch (e) {
    projObject = {};
  }
  return projObject;
};

export const getProjectName = async (uuid, authuid) => {
  const attempt = await fetch(`${fetchLocation}/project-name?uuid=${uuid}&authuid=${authuid}`);
  const text = await attempt.text();

  return { success: (attempt.status === 200 && text !== 'unconfigured'), text };
};

export const newProject = async (uid) => {
  return await fetch(`${fetchLocation}/new-project?uid=${uid}`).then(res => res.text());
};

export const tryVote = async (uuid, problemId, authuid, direction) => {
  const attempt = await fetch(`${fetchLocation}/project-vote?uuid=${uuid}&problemId=${problemId}&authuid=${authuid}&direction=${direction}`);

  if (attempt.status !== 200 && attempt.status !== 201) return attempt.text();

  return { success: true };
};

export const tryComment = async (uuid, problemId, authuid, text) => {
  const attempt = await fetch(`${fetchLocation}/project-write-comment?uuid=${uuid}&problemId=${problemId}&authuid=${authuid}&text=${text}`);

  if (attempt.status !== 200 && attempt.status !== 201) return attempt.text();

  return { success: true };
};

export const understandError = e => {
  let error = "";
  switch (e) {
    case 'auth/email-already-exists':
      error = "This email address is already in use. Please use an alternate address."
      break;
    case 'auth/invalid-user-token':
      error = "It seems like your token has expired. Refresh the page and try again."
      break;
    case 'auth/network-request-failed':
      error = "There was a network error. Refresh the page and try again."
      break;
    case 'auth/too-many-requests':
      error = "There were too many requests from this device. Wait 5 minutes, refresh the page, and try again."
      break;
    case 'auth/user-token-expired':
      error = "It seems that your token has expired. Refresh the page and try again."
      break;
    case 'auth/user-not-found':
      error = "It seems that you do not have an account. Please sign up and try again."
      break;
    case 'auth/user-disabled':
      error = "Your account has been disabled. Email us at `email` to resolve this."
      break;
    case 'auth/web-storage-unsupported':
      error = "We use IndexedDB to store your credentials. If you have disabled this, please re-enable it so we can keep you logged in."
      break;
    case 'auth/no-empty-username':
      error = "You can't sign up with an empty username. Please enter a username and try again."
      break;
    case 'auth/incorrect-username-syntax':
      error = "Usernames can only contain alphanumeric characters and underscores. Make sure that your username only contains such characters"
      break;
    case 'auth/username-already-exists':
      error = "The username already exists. Please try to input a different username."
      break;
    case 'auth/invalid-email':
      error = "The email is invalid. Please try again with a valid email."
      break;
    case 'auth/wrong-password':
      error = "The password is incorrect. Please try to type the password correctly."
      break;
    default:
      error = "This looks like an error on our side. Please refresh the page and try again, or contact us with the issue!"
  }
  return error;
};
