import type { NextApiRequest, NextApiResponse } from "next";
import { Response } from "../../utils/types";

type response = string;

export default (
  req: NextApiRequest,
  res: NextApiResponse<Response<response>>
) => {
  return res.status(200).send({ success: true, value: "Hello world!" });
};
