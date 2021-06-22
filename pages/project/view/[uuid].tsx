import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Configure from "../../../components/project/view/Configure";
import ProjectGateway from "../../../components/project/view/ProjectGateway";
import ProjectConfig, {
  ConfigData,
  getConfigData,
  IProjectConfig,
} from "../../../models/ProjectConfig";
import ProjectData, { IProjectData } from "../../../models/ProjectData";
import User, { IUser, UserData } from "../../../models/User";
import { isUUID, ProjectRole, UserId } from "../../../utils/constants";
import { useAuth } from "../../../utils/jwt";
import { post } from "../../../utils/restClient";

interface ProjectViewProps {
  user: UserData | null;
  emailVerified: boolean;
  exists?: boolean;
  name?: string;
  owner?: UserId;
  projectConfig?: ConfigData;
}

const sendEmailVerify = () => {
  post(`sendEmailVerify`);
};

const ProjectView: React.FC<ProjectViewProps> = ({
  user,
  emailVerified,
  exists,
  name,
  owner,
  projectConfig,
}) => {
  const router = useRouter();
  const { uuid } = router.query;

  if (!user) {
    return <div>Not logged in.</div>;
  }
  if (!emailVerified) {
    return (
      <div>
        Email unverified. Click here to resend verification email:{" "}
        <button onClick={sendEmailVerify}>Resend</button>
      </div>
    );
  }

  if (!exists || !isUUID(uuid)) {
    return <div>Project not found.</div>;
  }

  // if it exists, but there is no data sent, then you don't have access to it
  if (!name || !owner) {
    return <div>You don't have access to this project.</div>;
  }

  return (
    <div>
      This is project {name} with id {uuid}.
      <br />
      <br />
      {projectConfig ? (
        <ProjectGateway projectConfig={projectConfig} />
      ) : (
        <Configure uuid={uuid} user={user} owner={owner} />
      )}
    </div>
  );
};

export default ProjectView;

export const getServerSideProps: GetServerSideProps<ProjectViewProps> = async ({
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
