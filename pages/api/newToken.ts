import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { generateAccessToken, getUserData, UserData } from "../../helpers/jwt";
import connectdb from "../../helpers/mongo";
import { Response } from "../../helpers/types";
import RefreshToken from "../../models/RefreshToken";

connectdb();

type response = string;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Response<response>>
) => {
  const { method, body } = req;

  if (method !== "POST") {
    return res
      .status(400)
      .send({ success: false, value: "POST requests only" });
  }

  if (!body || !body.token) {
    return res.status(400).send({ success: false, value: "Missing arguments" });
  }

  const refreshToken: string = body.token;

  if (!(await RefreshToken.exists({ token: refreshToken }))) {
    return res
      .status(403)
      .send({ success: false, value: "Invalid refresh token" });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    (err, decoded) => {
      if (!!err || !decoded) {
        return res
          .status(403)
          .send({ success: false, value: "Invalid refresh token" });
      }
      const accessToken = generateAccessToken(
        getUserData(decoded as object & UserData) // see line 80 in /helpers/jwt.ts
      );
      return res.status(200).send({ success: false, value: accessToken });
    }
  );
};
