import firebase from "firebase/app";
import { GetServerSideProps } from "next";
import ProjectConfig, {
  ConfigData,
  getConfigData,
  IProjectConfig,
} from "../models/ProjectConfig";
import ProjectData, { IProjectData } from "../models/ProjectData";
import User, { IUser, UserData } from "../models/User";
import { isUUID, UserId } from "../utils/constants";
import { useAuth } from "../utils/jwt";
import { Project, ProjectRole } from "./types";

export interface ProjectViewPropsRaw {
  user: UserData | null;
  emailVerified: boolean;
  exists?: boolean;
  name?: string;
  owner?: UserId;
  projectConfig?: ConfigData;
}

export interface ProjectViewProps {
  user: UserData;
  emailVerified: boolean;
  name: string;
  owner: UserId;
  projectConfig: ConfigData;
  fbUser: firebase.User;
  project: Project;
  projectEdit: (path: string, value: object | string | number) => void;
}

const getProjectViewProps: GetServerSideProps<ProjectViewPropsRaw> = async ({
  params,
  res,
  req,
}) => {
  const user = await useAuth(req, res);
  let emailVerified = false;

  if (!params || !user) {
    return { props: { user: null, emailVerified } };
  }

  const userDoc: IUser = await User.findOne({ userId: user.userId });
  emailVerified = userDoc.emailVerified;

  // uuid isn't valid (i.e. project doesn't exist)
  if (!isUUID(params.uuid)) {
    return { props: { user, emailVerified } };
  }

  const projectData: IProjectData = await ProjectData.findOne({
    uuid: params.uuid,
  });

  const projectConfig: IProjectConfig = await ProjectConfig.findOne({
    uuid: params.uuid,
  });

  // project doesn't exist
  if (!projectData) {
    return { props: { user, emailVerified } };
  }

  if (
    !projectData.editors.some(
      (editor) =>
        editor.userId === user.userId &&
        ProjectRole[editor.role] !== ProjectRole.REMOVED
    )
  ) {
    // either not in the project, or has been removed
    // hence, it exists, but we don't send any data
    return { props: { user, emailVerified, exists: true } };
  }

  return {
    props: {
      user,
      emailVerified,
      exists: true,
      name: projectData.name,
      owner: projectData.owner,
      ...(!!projectConfig
        ? { projectConfig: getConfigData(projectConfig) }
        : {}),
    },
  };
};

export default getProjectViewProps;
