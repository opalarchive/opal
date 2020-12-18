/*
 * @name envSetup
 *
 * This helper sets up the environment file, by taking the environment file and
 * making it a JSON object, which can be used. Instead of process.env.ENV_VAR,
 * you would call [importName].ENV_VAR, essentially getting rid of process.
 *
 * @author Amol Rama, Anthony Wang
 * @since October 20, 2020
 */

import dotenv from "dotenv";

dotenv.config();

interface ENVTemplate {
  FIREBASE_ADMIN_TYPE: string;
  FIREBASE_ADMIN_PROJECT_ID: string;
  FIREBASE_ADMIN_PRIVATE_KEY_ID: string;
  FIREBASE_ADMIN_PRIVATE_KEY: string;
  FIREBASE_ADMIN_CLIENT_EMAIL: string;
  FIREBASE_ADMIN_CLIENT_ID: string;
  FIREBASE_ADMIN_AUTH_URI: string;
  FIREBASE_ADMIN_TOKEN_URI: string;
  FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL: string;
  FIREBASE_ADMIN_X509_CERT_URL: string;
  MAILING_SERVICE_CLIENT_ID: string;
  MAILING_SERVICE_CLIENT_SECRET: string;
  MAILING_SERVICE_REFRESH_TOKEN: string;
  ENCRYPTION_KEY: string;
  ENCRYPTION_IV: string;
  DEVELOPMENT: string;
}

// get ts to shut up
const env = (process.env as unknown) as ENVTemplate;

export default env;
