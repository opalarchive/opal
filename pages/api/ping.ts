import type { NextApiRequest, NextApiResponse } from "next";
import { useAuth } from "../../utils/jwt";
import { Response } from "../../utils/types";

type response = string;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Response<response>>
) => {
  const user = await useAuth(req, res);

  if (!user) {
    return res.status(401).send({ success: false, value: "Not logged in" });
  }
  return res.status(200).send({ success: true, value: "pong!" });
};
