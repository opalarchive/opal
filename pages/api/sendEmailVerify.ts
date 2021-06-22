import type { NextApiRequest, NextApiResponse } from "next";
import { sendEmailVerify } from "../../utils/email";
import { useAuth } from "../../utils/jwt";
import connectdb from "../../utils/mongo";
import { Response } from "../../utils/types";

connectdb();

type response = string;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Response<response>>
) => {
  const { method } = req;

  if (method !== "POST") {
    return res
      .status(400)
      .send({ success: false, value: "POST requests only" });
  }

  const user = await useAuth(req, res);

  if (!user) {
    return res.status(401).send({ success: false, value: "Not logged in" });
  }
  const sendEmail = await sendEmailVerify(user);

  if (sendEmail.success) {
    return res.status(201).send(sendEmail);
  }
  return res.status(400).send(sendEmail);
};
