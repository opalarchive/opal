/*
 * @name emailSetup
 *
 * This helper sets up the Email, using secrets stored in ../.env, and then
 * uses those credentials to log in to onlineproblemarchivallocation@gmail.com
 *
 * To use, call sendEmail. Requires the following parameters:
 * @param data: This is a JSON object consisting of the following things:
 *     - @param email: The email to which you want to send
 *     - @param subject: The subject line that you want to enter
 *     - @param content: The content of the email. This can be in raw HTML.
 *
 * Using this, calling sendEmail(data) is an asynchronous function that will
 * return an error in the case of an authentication error (and possibly if
 * the email bounces)
 *
 * @author Amol Rama
 * @since October 20, 2020
 */

/*
 * Get the environment variables. In this instance, we need the following:
 *     - MAILING_SERVICE_CLIENT_ID
 *     - MAILING_SERVICE_CLIENT_SECRET
 *     - MAILING_SERVICE_REFRESH_TOKEN
 * In addition, get NodeMailer and the google OAuth2 Client
 */
import env from "./envSetup";
import * as nodemailer from "nodemailer";
import { google } from "googleapis";

const OAuth2 = google.auth.OAuth2;

/*
 * Create an OAuth2 Client Instance, using the one set up on the console. This
 * allows us to connect to the Google STMP server.
 */
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";
const oauth2Client = new OAuth2(
  env.MAILING_SERVICE_CLIENT_ID,
  env.MAILING_SERVICE_CLIENT_SECRET,
  OAUTH_PLAYGROUND
);
oauth2Client.setCredentials({
  refresh_token: env.MAILING_SERVICE_REFRESH_TOKEN,
});

/*
 * sendEmail is the main function. It takes in a data variable, and then sets
 * the OAuth2 Client to be ready (by creating an access token). Then, it sets up
 * NodeMailer with the Google Email, and then finally sends the email with the
 * given parameters in data.
 *
 * @param data: This is a JSON object consisting of the following things:
 *     - @param email: The email to which you want to send
 *     - @param subject: The subject line that you want to enter
 *     - @param content: The content of the email. This can be in raw HTML.
 *
 * Note that the function is asynchronous
 */
export const sendEmail = (data) => {
  const accessToken = oauth2Client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "onlineproblemarchivallocation@gmail.com",
      clientId: env.MAILING_SERVICE_CLIENT_ID,
      clientSecret: env.MAILING_SERVICE_CLIENT_SECRET,
      refreshToken: env.MAILING_SERVICE_REFRESH_TOKEN,
      accessToken,
    },
  });

  const mailOptions = {
    from: "onlineproblemarchivallocation@gmail.com",
    to: data.email,
    subject: data.subject,
    html: data.content,
  };

  smtpTransport.sendMail(mailOptions, (err, info) => {
    if (err) return err;
    return info;
  });
};
