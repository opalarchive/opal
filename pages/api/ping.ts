import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "../../utils/jwt";
import { Response } from "../../utils/types";

type response = string;

export default withAuth(
  (req: NextApiRequest, res: NextApiResponse<Response<response>>) => {
    return res.status(200).send({ success: true, value: "pong!" });
  }
);
