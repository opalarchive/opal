import getProjectViewProps from "../../../utils/getProjectViewProps";
import withProjectViewFC from "../../../utils/withProjectViewFC";
import ProblemBox from "../../../components/project/view/pieces/ProblemPanel";
import { VStack } from "@chakra-ui/layout";

const ProjectView = withProjectViewFC(
  ({ user, fbUser, project, projectEdit }) => {
    return (
      <div>
        Successfully connected to firebase
        <br />
        I'm lazy; here's some raw JSON:
        <VStack p={4} spacing={4} bgColor="gray.50">
          {project.problems.map((p, idx) => (
            <ProblemBox
              key={`problem-${idx}`}
              user={user}
              idx={idx}
              problem={p}
              categoryColors={project.settings.categoryColors}
              difficultyColors={project.settings.difficultyColors}
            />
          ))}
        </VStack>
      </div>
    );
  }
);

export const getServerSideProps = getProjectViewProps;
export default ProjectView;
