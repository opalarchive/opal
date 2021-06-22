/*
 * @name emailSetup
 *
 * This helper sets up the Email, using secrets stored in .env.local, and then
 * uses those credentials to log in to {process.env.EMAIL}
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
 * @author Amol Rama, Anthony Wang
 * @since May 22, 2021
 */

import * as nodemailer from "nodemailer";
import { google } from "googleapis";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import SMTPConnection from "nodemailer/lib/smtp-connection";
import { UserData } from "../models/User";
import { emailVerifyCooldown, siteURL } from "./constants";
import { nanoid } from "nanoid";
import EmailVerifyToken, {
  IEmailVerfiyToken,
} from "../models/EmailVerifyToken";
import { Response } from "./types";

interface EmailInput {
  targetEmail: string;
  subject: string;
  content: string;
}

const OAuth2 = google.auth.OAuth2;

/*
 * Create an OAuth2 Client Instance, using the one set up on the console. This
 * allows us to connect to the Google STMP server.
 */
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";
const oauth2Client = new OAuth2(
  process.env.MAILING_SERVICE_CLIENT_ID as string,
  process.env.MAILING_SERVICE_CLIENT_SECRET as string,
  OAUTH_PLAYGROUND
);
oauth2Client.setCredentials({
  refresh_token: process.env.MAILING_SERVICE_REFRESH_TOKEN as string,
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
const sendEmail = async (data: EmailInput) => {
  const accessToken = await oauth2Client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL as string,
      clientId: process.env.MAILING_SERVICE_CLIENT_ID as string,
      clientSecret: process.env.MAILING_SERVICE_CLIENT_SECRET as string,
      refreshToken: process.env.MAILING_SERVICE_REFRESH_TOKEN as string,
      accessToken,
    } as SMTPConnection.AuthenticationType,
  } as SMTPTransport.Options);

  const mailOptions = {
    from: process.env.EMAIL as string,
    to: data.targetEmail,
    subject: data.subject,
    html: data.content,
  };

  return new Promise<void>((resolve, reject) =>
    smtpTransport.sendMail(mailOptions, (err, info) => {
      if (err) reject(err);
      return resolve(info);
    })
  );
};

export const sendEmailVerify = async (
  user: UserData
): Promise<Response<string>> => {
  const verificationToken = nanoid(64);
  const link = `${siteURL}/verify/${verificationToken}`;

  const maybeToken: IEmailVerfiyToken | undefined =
    await EmailVerifyToken.findOne({ userId: user.userId });

  if (!!maybeToken) {
    if (maybeToken.creationDate > Date.now() - emailVerifyCooldown) {
      return {
        success: false,
        value:
          "You are trying to do this too fast! Wait 15 minutes before sending another verification email.",
      };
    }
  }

  let token: IEmailVerfiyToken = !!maybeToken
    ? maybeToken
    : new EmailVerifyToken({ userId: user.userId });
  token.verificationToken = verificationToken;
  token.creationDate = Date.now();

  await token.save();

  await sendEmail({
    targetEmail: user.email,
    subject: `Opalarchive: Please Verify Your Email`,
    content: `Hi ${user.username},<br /><br />You recently created an account for the Online Problem Archival Location website. We're glad to have you here. But before you can start, you'll need to verify your account by clicking <a href='${link}'>here</a>. If that doesn't work, copy the following into the browser: <a href='${link}'>${link}</a>.`,
  });
  return { success: true, value: "Successfully sent verification email" };
};
