import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { parse, serialize } from "cookie";
import RefreshToken from "../models/RefreshToken";
import { accessTokenDuration } from "./constants";
import { Response } from "./types";
import connectdb from "./mongo";

connectdb();

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

const refreshAccessToken = (
  refreshToken: string,
  callback: (res: Response<object>) => void
): void => {
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    (err, decoded) => {
      if (!!err || !decoded) {
        callback({ success: false, value: "Invalid refresh token" });
        return;
      }

      callback({ success: true, value: decoded });
    }
  );
};

// middleware to get user object and restrict api route to logged in users
export function withAuth<
  Req extends { headers: { cookie?: string } },
  Res extends {
    status: (statusCode: number) => Res;
    send: (body: Response<any>) => void;
    setHeader(
      name: string,
      value: number | string | ReadonlyArray<string>
    ): void;
  }
>(
  handler: (
    req: Req & {
      user: UserData;
    },
    res: Res
  ) => void | Promise<void>
) {
  return async (req: Req, res: Res) => {
    const cookie = req.headers.cookie;
    const accessToken = !!cookie && parse(cookie).accessToken;
    if (!accessToken) {
      return res.status(401).send({ success: false, value: "Not logged in" });
    }

    return new Promise<void>((resolve, reject) => {
      jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string,
        async (err, decoded) => {
          // this requires messing with tokens, so it must be invalid, not simply "not logged in"
          if (!!err && err.message !== "jwt expired") {
            res
              .status(403)
              .send({ success: false, value: "Invalid access token" });
            return resolve();
          }

          if (!!err && err.message === "jwt expired") {
            const refreshToken = !!cookie && parse(cookie).refreshToken;
            // it could be invalided by a "sign out from all sessions" causing not logged in
            if (!refreshToken) {
              res.status(401).send({ success: false, value: "Not logged in" });
              return resolve();
            }

            const exists = await RefreshToken.exists({ token: refreshToken });

            if (exists) {
              return refreshAccessToken(refreshToken, (response) => {
                if (response.success) {
                  const user = getUserData(response.value as object & UserData); // see line 132

                  res.setHeader(
                    "Set-Cookie",
                    serialize("accessToken", generateAccessToken(user), {
                      path: "/",
                      httpOnly: true,
                    })
                  );

                  handler({ ...req, user }, res);
                  return resolve();
                } else {
                  res.status(403).send(response);
                  return resolve();
                }
              });
            } else {
              res.status(401).send({ success: false, value: "Not logged in" });
              return resolve();
            }
          }

          const user = getUserData(decoded as object & UserData); // essentially decoded includes stuff we don't need, so we get rid of them here

          handler({ ...req, user }, res);
          return resolve();
        }
      );
    });
  };
}
