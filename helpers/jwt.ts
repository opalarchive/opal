import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { accessTokenDuration } from "./constants";
import { Response } from "./types";

export interface UserData {
  userId: string;
  email: string;
  emailVerified: boolean;
  username: string;
}

// take only these props from an object with these props and possibly more
export const getUserData = (user: object & UserData) => {
  return {
    userId: user.userId,
    email: user.email,
    emailVerified: user.emailVerified,
    username: user.username,
  };
};

export type NextApiRequestWithUser = NextApiRequest & {
  user: UserData;
};

export const generateAccessToken = (userData: UserData) => {
  return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: accessTokenDuration,
  });
};

// parse strings of the form "foo1=bar1; foo2=bar2; foo3=bar3"
// into { "foo1": "bar1", "foo2": "bar2", "foo3": "bar3" }
// and also handles escaped characters in urls
export const parseCookie = (cookieString: string) => {
  let cookieObject: { [key: string]: string } = {};

  cookieString
    .split(";")
    .map((keyval) => keyval.split("="))
    .forEach(([key, val]) => {
      cookieObject[decodeURIComponent(key.trim())] = decodeURIComponent(
        val.trim()
      );
    });
  return cookieObject;
};

// middleware to get user object and restrict api route to logged in users
export const withAuth = (
  handler: (
    req: NextApiRequestWithUser,
    res: NextApiResponse
  ) => void | Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse<Response<any>>) => {
    const cookie = req.headers.cookie;
    const token = !!cookie && parseCookie(cookie).accessToken;
    if (!token) {
      return res.status(401).send({ success: false, value: "Not logged in" });
    }

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      (err, decoded) => {
        if (!!err || !decoded) {
          if (!!err && err.message === "jwt expired") {
            return res.status(401).send({
              success: false,
              value: "Temporary access token expired",
            });
          }
          return res
            .status(403)
            .send({ success: false, value: "Invalid access token" });
        }
        const newReq = req as NextApiRequestWithUser;
        newReq.user = getUserData(decoded as object & UserData); // essentially decoded includes stuff we don't need, so we get rid of them here

        return handler(newReq, res);
      }
    );
  };
};
