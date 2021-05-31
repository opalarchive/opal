import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "../../helpers/jwt";
import { Response } from "../../helpers/types";

type response = string;

export default withAuth(
  (req: NextApiRequest, res: NextApiResponse<Response<response>>) => {
    return res.status(200).send({ success: true, value: "pong!" });
  }
);
