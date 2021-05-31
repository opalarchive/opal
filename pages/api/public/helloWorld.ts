import type { NextApiRequest, NextApiResponse } from "next";
import { Response } from "../../../helpers/types";

type response = string;

export default (
  req: NextApiRequest,
  res: NextApiResponse<Response<response>>
) => {
  res.status(200).send({ success: true, value: "Hello world!" });
};
