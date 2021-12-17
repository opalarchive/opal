import { Box, Select, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FC } from "react";
import { FiList } from "react-icons/fi";
import { UUID } from "../../../../utils/constants";
import { Project } from "../../../../utils/types";

interface CompileSidebarProps {
  uuid: UUID;
  project: Project;
}

const CompileSidebar: FC<CompileSidebarProps> = ({ uuid, project }) => {
  const router = useRouter();
  const list =
    typeof router.query.list === "string"
      ? parseInt(router.query.list) - 1
      : -1;

  return (
    <Stack direction="column" spacing={4}>
      <Box bg="white" borderWidth="1px" p={4}>
        <Text fontSize="xl" mb={2}>
          List&nbsp;
          <FiList
            style={{
              display: "inline-block",
              position: "relative",
              top: "-0.05rem",
            }}
          />
        </Text>
        <Select
          value={list === -1 ? "all" : `list-${list}`}
          onChange={(e) => {
            const newList = e.target.value;
            if (newList === "all") {
              router.push(`/project/view/${uuid}/compile`, undefined, {
                shallow: true,
              });
            } else {
              router.push(
                `/project/view/${uuid}/compile?list=${
                  parseInt(newList.substring(5)) + 1
                }`,
                undefined,
                {
                  shallow: true,
                }
              );
            }
          }}
        >
          <option value="all">All Problems</option>
          {project.lists.map((list, idx) => (
            <option value={`list-${idx}`} key={`list-${idx}`}>
              {list.name}
            </option>
          ))}
        </Select>
      </Box>
    </Stack>
  );
};
export default CompileSidebar;
