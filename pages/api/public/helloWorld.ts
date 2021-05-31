import type { NextApiRequest, NextApiResponse } from "next";

type response = string;

export default (req: NextApiRequest, res: NextApiResponse<response>) => {
  res.status(200).send("Hello world!");
};
