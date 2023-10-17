import { useRouter } from "next/router";
import { FC, useMemo } from "react";
import Compile from "../../../../components/project/view/pages/ProjectView/Compile";
import ProblemFocus from "../../../../components/project/view/pages/ProjectView/ProblemFocus";
import Problems from "../../../../components/project/view/pages/ProjectView/Problems";
import Settings from "../../../../components/project/view/pages/ProjectView/Settings";
import { UUID } from "../../../../utils/constants";
import getProjectViewProps, {
  ProjectViewPropsRaw,
} from "../../../../utils/getProjectViewProps";
import ProjectViewWrapper from "../../../../utils/ProjectViewWrapper";
import { ProjectViewPage } from "../../../../utils/types";
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

  const projectViewPage = useMemo(() => {
    if (!params) {
      return ProjectViewPage.PROBLEMS;
    }

    switch (params[0]) {
      case "problems":
        return ProjectViewPage.PROBLEMS;
      case "i":
        return ProjectViewPage.PROBLEM_FOCUS;
      case "compile":
        return ProjectViewPage.COMPILE;
      case "settings":
        return ProjectViewPage.SETTINGS;
      default:
        return ProjectViewPage.PAGE404;
    }
  }, [params]);

  const PageComponent = useMemo(() => {
    switch (ProjectViewPage[projectViewPage]) {
      case ProjectViewPage.PROBLEMS:
        return Problems;
      case ProjectViewPage.PROBLEM_FOCUS:
        return ProblemFocus;
      case ProjectViewPage.COMPILE:
        return Compile;
      case ProjectViewPage.SETTINGS:
        return Settings;
      case ProjectViewPage.PAGE404:
        return Page404;
    }
  }, [projectViewPage]);

  return (
    <ProjectViewWrapper
      projectViewPage={projectViewPage}
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
