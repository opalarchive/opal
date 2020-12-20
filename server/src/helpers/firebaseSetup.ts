/*
 * @name firebaseSetup
 *
 * This helper sets up the Firebase Account, using secrets stored in ../.env,
 * and then uses those credentials to log in to the firebase problem.
 *
 * To use, call either auth (authentication) or db (database). These are the
 * standard functions provided by firebase, so thus check the firebase Admin SDK
 * Documentation (https://firebase.google.com/docs/reference/admin) for more
 * information on how to use such functions.
 *
 * @author Amol Rama, Anthony Wang
 * @since October 20, 2020
 */

/*
 * Get the environment variables. In this instance, we need the following:
 *     - FIREBASE_ADMIN_TYPE
 *     - FIREBASE_ADMIN_PROJECT_ID
 *     - FIREBASE_ADMIN_PRIVATE_KEY_ID
 *     - FIREBASE_ADMIN_PRIVATE_KEY (small note: this is an RSA key, so thus all
 *           newlines `\n` are parsed as `\\n`, and thus they need to be changed
 *           back to `\n`)
 *     - FIREBASE_ADMIN_CLIENT_EMAIL
 *     - FIREBASE_ADMIN_CLIENT_ID
 *     - FIREBASE_ADMIN_AUTH_URI
 *     - FIREBASE_ADMIN_TOKEN_URI
 *     - FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL
 *     - FIREBASE_ADMIN_CLIENT_X509_CERT_URL
 * In addition, get the firebase-admin module to sign in
 */
import env from "./envSetup";
import * as firebase from "firebase-admin";

/*
 * Create an object that sets up the admin configurations with all the
 * information necessary there, so then we can initialize the firebase app.
 */
const adminConfig = {
  type: env.FIREBASE_ADMIN_TYPE,
  project_id: env.FIREBASE_ADMIN_PROJECT_ID,
  private_key_id: env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
  private_key: !!env.FIREBASE_ADMIN_PRIVATE_KEY
    ? env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined,
  client_email: env.FIREBASE_ADMIN_CLIENT_EMAIL,
  client_id: env.FIREBASE_ADMIN_CLIENT_ID,
  auth_uri: env.FIREBASE_ADMIN_AUTH_URI,
  token_uri: env.FIREBASE_ADMIN_TOKEN_URI,
  auth_provider_x509_cert_url: env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
};

/*
 * Initialize a Firebase App, using what is produced from the firebase
 * credential certificate
 */
firebase.initializeApp({
  credential: firebase.credential.cert(adminConfig as firebase.ServiceAccount),
  databaseURL: "https://opal-5625e.firebaseio.com/",
});

export const db = firebase.database();
export const auth = firebase.auth();
