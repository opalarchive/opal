import type { NextApiRequest, NextApiResponse } from "next";
import { nanoid } from "nanoid";
import connectdb from "../../utils/mongo";
import User, { getUserData, IUser } from "../../models/User";
import jwt from "jsonwebtoken";
import { hash } from "../../utils/passwordHash";
import { Response } from "../../utils/types";
import { generateAccessToken } from "../../utils/jwt";
import RefreshToken from "../../models/RefreshToken";
import { serialize } from "cookie";
import { userIdLength } from "../../utils/constants";
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

  if (!body || !validateString(body, ["email", "username", "password"])) {
    return res.status(400).send({ success: false, value: "Invalid arguments" });
  }

  // see if email & username are already in use
  const conflictingUsers: IUser[] = await User.find({
    $or: [{ email: body.email }, { username: body.username }],
  }).limit(2);
  // the limit is 2 because in theory there can only be one account that is already using that email
  // and one that is already using that username

  if (conflictingUsers.some((user) => user.email === body.email)) {
    return res
      .status(400)
      .send({ success: false, value: "Email already in use" });
  }

  if (conflictingUsers.some((user) => user.username === body.username)) {
    return res
      .status(400)
      .send({ success: false, value: "Username already in use" });
  }

  const userId = "u" + nanoid(userIdLength - 1);
  const passwordHash = await hash(body.password);

  const newUser: IUser = new User({
    userId,
    email: body.email,
    emailVerified: false,
    username: body.username,
    passwordHash,
  });
  await newUser.save();

  // sign in (give jwt) after signing up

  const userData = getUserData(newUser);

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

  return res.status(201).send({ success: true, value: "Success" });
};
