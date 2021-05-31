import type { NextApiRequest, NextApiResponse } from "next";
import { nanoid } from "nanoid";
import connectdb from "../../../helpers/mongo";
import User, { IUser } from "../../../models/User";
import Password, { IPassword } from "../../../models/Password";
import { hash } from "../../../helpers/passwordHash";

connectdb();

type response = string;

export default async (req: NextApiRequest, res: NextApiResponse<response>) => {
  const { method, body } = req;

  if (method !== "POST") {
    res.status(400).send("POST requests only");
    return;
  }

  if (!body || !body.email || !body.username || !body.password) {
    res.status(400).send("Missing arguments");
    return;
  }

  // see if email & username are already in use
  const conflictingUsers: IUser[] = await User.find({
    $or: [{ email: body.email }, { username: body.username }],
  }).limit(2);
  // the limit is 2 because in theory there can only be one account that is already using that email
  // and one that is already using that username

  if (conflictingUsers.some((user) => user.email === body.email)) {
    res.status(400).send("Email already in use");
    return;
  }

  if (conflictingUsers.some((user) => user.username === body.username)) {
    res.status(400).send("Username already in use");
    return;
  }

  const userId = "u" + nanoid(19);
  const newUser: IUser = new User({
    userId,
    email: body.email,
    emailVerified: false,
    username: body.username,
  });

  const passwordHash = await hash(body.password);
  const newPassword: IPassword = new Password({
    userId,
    hash: passwordHash,
  });

  await newUser.save();
  await newPassword.save();

  res.status(200).send("Success");
};
