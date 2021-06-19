import type { NextApiRequest, NextApiResponse } from "next";
import { generateAccessToken } from "../../utils/jwt";
import connectdb from "../../utils/mongo";
import { verify } from "../../utils/passwordHash";
import { Response } from "../../utils/types";
import User, { getUserData, IUser } from "../../models/User";
import jwt from "jsonwebtoken";
import RefreshToken from "../../models/RefreshToken";
import { serialize } from "cookie";
import { validateString } from "../../utils/bodyValidate";

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

  if (!body || !validateString(body, ["username", "password"])) {
    return res.status(400).send({ success: false, value: "Invalid arguments" });
  }

  const user: IUser | null = await User.findOne({
    username: body.username,
  });

  if (user === null) {
    return res.status(400).send({
      success: false,
      value: "The specified username does not have an account",
    });
  }

  if (await verify(body.password, user.passwordHash)) {
    const userData = getUserData(user);

    const accessToken = generateAccessToken(userData);
    const refreshToken = jwt.sign(
      userData,
      process.env.REFRESH_TOKEN_SECRET as string
    );

    const refreshTokenDoc = new RefreshToken({ token: refreshToken });
    await refreshTokenDoc.save();

    res.setHeader("Set-Cookie", [
      serialize("accessToken", accessToken, {
        path: "/",
        httpOnly: true,
        maxAge: 1000 * 365 * 24 * 60 * 60,
      }),
      serialize("refreshToken", refreshToken, {
        path: "/",
        httpOnly: true,
        maxAge: 1000 * 365 * 24 * 60 * 60,
      }),
    ]);
    return res.status(200).send({
      success: true,
      value: `Success. Set accessToken to ${accessToken} and refreshToken to ${refreshToken}`,
    });
  }

  return res.status(403).send({ success: false, value: "Wrong password" });
};
