import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";
import { parse, serialize } from "cookie";
import RefreshToken from "../models/RefreshToken";
import { accessTokenDuration } from "./constants";
import { Response } from "./types";
import connectdb from "./mongo";
import { getUserData, UserData } from "../models/User";

connectdb();

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

/**
 * Function that computes the current user given basic request headers (cookie)
 * and sends cookies back if the tokens need refreshing.
 * Similar use to a react hook middleware.
 * @param req A request object that contains the cookie header
 * @param res A response object that has the setHeader function (we only use the Set-Cookie header here though)
 * @returns Promise of the current user in the form of UserData, promise of null if not logged in
 */
export function useAuth<
  Req extends { headers: { cookie?: string } },
  Res extends {
    setHeader(
      name: string,
      value: number | string | ReadonlyArray<string>
    ): void;
  }
>(req: Req, res: Res): Promise<UserData | null> {
  const cookie = req.headers.cookie;
  if (!cookie) {
    return new Promise((resolve, reject) => resolve(null));
  }

  const { accessToken, refreshToken } = parse(cookie);

  return new Promise<UserData | null>((resolve, reject) => {
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string,
      async (err, decoded) => {
        // if the accessToken is not valid, we create a new one with the refreshToken and immediately use it
        if (!!err) {
          if (!refreshToken) {
            return resolve(null);
          }

          const exists = await RefreshToken.exists({ token: refreshToken });

          if (exists) {
            return refreshAccessToken(refreshToken, (response) => {
              if (response.success) {
                const user = getUserData(response.value as object & UserData); // see line 103

                res.setHeader(
                  "Set-Cookie",
                  serialize("accessToken", generateAccessToken(user), {
                    path: "/",
                    httpOnly: true,
                    maxAge: 1000 * 365 * 24 * 60 * 60,
                  })
                );

                return resolve(user);
              } else {
                return resolve(null);
              }
            });
          } else {
            return resolve(null);
          }
        }

        const user = getUserData(decoded as object & UserData); // essentially decoded includes stuff we don't need, so we get rid of them here

        return resolve(user);
      }
    );
  });
}
