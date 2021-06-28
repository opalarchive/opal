import getProjectViewProps from "../../../utils/getProjectViewProps";
import withProjectViewFC from "../../../utils/withProjectViewFC";

const ProjectView = withProjectViewFC(({ fbUser, project, projectEdit }) => {
  return (
    <div>
      Successfully connected to firebase
      <br />
      I'm lazy; here's some raw JSON: {JSON.stringify(project)}.
    </div>
  );
});

export const getServerSideProps = getProjectViewProps;
export default ProjectView;
