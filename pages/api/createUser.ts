import type { NextApiRequest, NextApiResponse } from "next";
import { nanoid } from "nanoid";
import connectdb from "../../helpers/mongo";
import User, { IUser } from "../../models/User";
import { hash } from "../../helpers/passwordHash";
import { Response } from "../../helpers/types";

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

  if (!body || !body.email || !body.username || !body.password) {
    return res.status(400).send({ success: false, value: "Missing arguments" });
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

  const userId = "u" + nanoid(19);
  const passwordHash = await hash(body.password);

  const newUser: IUser = new User({
    userId,
    email: body.email,
    emailVerified: false,
    username: body.username,
    passwordHash,
  });
  await newUser.save();

  return res.status(200).send({ success: true, value: "Success" });
};
