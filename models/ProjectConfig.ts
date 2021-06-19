import mongoose from "mongoose";
import { validateString } from "../utils/bodyValidate";
import { UUID } from "../utils/constants";

const configKeys: (keyof ConfigData)[] = [
  "apiKey",
  "authDomain",
  "databaseURL",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];

export interface ConfigData {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const isConfigData = (obj: object): obj is ConfigData => {
  if (Object.keys(obj).length !== configKeys.length) {
    return false;
  }

  return validateString(obj, configKeys);
};

// take only these props from an object with these props and possibly more
export const getConfigData = (config: object & ConfigData): ConfigData => {
  return Object.fromEntries(
    configKeys.map((key) => [key, config[key]])
  ) as unknown as ConfigData;
};

export interface IProjectConfig extends mongoose.Document, ConfigData {
  uuid: UUID;
}

const ProjectConfigSchema = new mongoose.Schema({
  uuid: { type: String, required: true },
  apiKey: { type: String, required: true },
  authDomain: { type: String, required: true },
  databaseURL: { type: String, required: true },
  projectId: { type: String, required: true },
  storageBucket: { type: String, required: true },
  messagingSenderId: { type: String, required: true },
  appId: { type: String, required: true },
});

const ProjectConfig =
  mongoose.models.ProjectConfig ||
  mongoose.model("ProjectConfig", ProjectConfigSchema, "ProjectConfig");
export default ProjectConfig;
