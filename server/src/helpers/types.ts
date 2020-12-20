export interface ENVTemplate {
  FIREBASE_ADMIN_TYPE: string;
  FIREBASE_ADMIN_PROJECT_ID: string;
  FIREBASE_ADMIN_PRIVATE_KEY_ID: string;
  FIREBASE_ADMIN_PRIVATE_KEY: string;
  FIREBASE_ADMIN_CLIENT_EMAIL: string;
  FIREBASE_ADMIN_CLIENT_ID: string;
  FIREBASE_ADMIN_AUTH_URI: string;
  FIREBASE_ADMIN_TOKEN_URI: string;
  FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL: string;
  FIREBASE_ADMIN_CLIENT_X509_CERT_URL: string;
  MAILING_SERVICE_CLIENT_ID: string;
  MAILING_SERVICE_CLIENT_SECRET: string;
  MAILING_SERVICE_REFRESH_TOKEN: string;
  ENCRYPTION_KEY: string;
  ENCRYPTION_IV: string;
  EMAIL: string;
  DEVELOPMENT: string;
}

export interface Result<T> {
  status: number;
  value: T;
}

export interface EmailInput {
  targetEmail: string;
  subject: string;
  content: string;
}
