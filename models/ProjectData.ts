import mongoose from "mongoose";
import { projectRole, UUID, UserId } from "../utils/constants";

export interface IEditStatus extends mongoose.Document {
  userId: UserId;
  lastEdit: number;
  shareDate: number;
  starred: boolean;
  role: projectRole;
}

const EditStatusSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  lastEdit: { type: Number, required: true },
  shareDate: { type: Number, required: true },
  starred: { type: Boolean, required: true },
  role: { type: String, required: true },
});

export interface IProjectData extends mongoose.Document {
  uuid: UUID;
  editors: IEditStatus[];
  name: string;
  owner: UserId;
  trashed: boolean;
}

const ProjectDataSchema = new mongoose.Schema({
  uuid: { type: String, required: true },
  editors: { type: [EditStatusSchema], required: true },
  name: { type: String, required: true },
  owner: { type: String, required: true },
  trashed: { type: Boolean, required: true },
});

const ProjectData =
  mongoose.models.ProjectData ||
  mongoose.model("ProjectData", ProjectDataSchema, "ProjectData");
export default ProjectData;
