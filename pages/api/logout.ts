import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  getUserData,
  parseCookie,
  UserData,
} from "../../utils/jwt";
import connectdb from "../../utils/mongo";
import { Response } from "../../utils/types";
import RefreshToken from "../../models/RefreshToken";
import { serialize } from "cookie";

connectdb();

type response = string;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Response<response>>
) => {
  const { method, headers } = req;

  if (method !== "POST") {
    return res
      .status(400)
      .send({ success: false, value: "POST requests only" });
  }

  const cookie = headers.cookie;
  const token = !!cookie && parseCookie(cookie).refreshToken;
  if (!token) {
    return res.status(401).send({ success: false, value: "Not logged in" });
  }

  await RefreshToken.deleteMany({ token });
  // delete jwt cookies
  res.setHeader("Set-Cookie", [
    serialize("accessToken", "", { path: "/", httpOnly: true }),
    serialize("refreshToken", "", { path: "/", httpOnly: true }),
  ]);
  return res.status(200).send({ success: true, value: "Success" });
};
