import { useRouter } from "next/router";
import { FC, useMemo } from "react";
import Compile from "../../../../components/project/view/pages/ProjectView/Compile";
import Problems from "../../../../components/project/view/pages/ProjectView/Problems";
import Settings from "../../../../components/project/view/pages/ProjectView/Settings";
import { UUID } from "../../../../utils/constants";
import getProjectViewProps, {
  ProjectViewPropsRaw,
} from "../../../../utils/getProjectViewProps";
import ProjectViewWrapper from "../../../../utils/ProjectViewWrapper";
import Page404 from "../../../404";

const ProjectView: FC<ProjectViewPropsRaw> = ({
  user,
  emailVerified,
  exists,
  name,
  owner,
  projectConfig,
}) => {
  const router = useRouter();
  const { uuid, params } = router.query;

  const PageComponent = useMemo(() => {
    if (!params) {
      return Problems;
    }

    switch (params[0]) {
      case "problems":
        return Problems;
      case "compile":
        return Compile;
      case "settings":
        return Settings;
      default:
        return Page404;
    }
  }, [params]);

  return (
    <ProjectViewWrapper
      Component={PageComponent}
      uuid={uuid as UUID}
      user={user}
      emailVerified={emailVerified}
      exists={exists}
      name={name}
      owner={owner}
      projectConfig={projectConfig}
    />
  );
};

export const getServerSideProps = getProjectViewProps;
export default ProjectView;
