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
  if (works.status !== 200) return works.text();
  return;
};

export const understandError = e => {
  let error = "";
  switch(e) {
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
