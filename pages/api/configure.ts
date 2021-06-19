import type { NextApiRequest, NextApiResponse } from "next";
import ProjectConfig, { isConfigData } from "../../models/ProjectConfig";
import ProjectData, { IProjectData } from "../../models/ProjectData";
import { isUUID } from "../../utils/constants";
import { useAuth } from "../../utils/jwt";
import { hash } from "../../utils/passwordHash";
import { Response } from "../../utils/types";
import { validateString } from "../../utils/bodyValidate";

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

  if (
    !body ||
    !body.config ||
    !isConfigData(body.config) ||
    !validateString(body, ["uuid"]) ||
    !isUUID(body.uuid)
  ) {
    return res
      .status(400)
      .send({ success: false, value: "Invalid arguments." });
  }

  const user = await useAuth(req, res);

  if (!user) {
    return res.status(401).send({ success: false, value: "Not logged in" });
  }

  const projectData: IProjectData = await ProjectData.findOne({
    uuid: body.uuid,
  });

  if (!projectData) {
    return res.status(404).send({
      success: false,
      value: "Project not found",
    });
  }

  if (user.userId !== projectData.owner) {
    return res.status(403).send({
      success: false,
      value: "Unauthorized. You are not the owner of this project!",
    });
  }

  const projectConfig = new ProjectConfig({
    uuid: body.uuid,
    ...body.config,
  });

  await projectConfig.save();

  return res.status(201).send({ success: true, value: "Success" });
};
