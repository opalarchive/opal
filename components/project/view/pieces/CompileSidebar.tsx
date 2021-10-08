import { Box, Select, Stack, Text } from "@chakra-ui/react";
import { Dispatch, FC, SetStateAction } from "react";
import { FiList } from "react-icons/fi";
import { Project } from "../../../../utils/types";

interface CompileSidebarProps {
  list: number;
  // These are just the functions from useState()[1]
  setList: Dispatch<SetStateAction<number>>;
  project: Project;
}

const CompileSidebar: FC<CompileSidebarProps> = ({
  list,
  setList,
  project,
}) => {
  return (
    <Stack direction="column" spacing={4}>
      <Box bg="white" p={4}>
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
            if (e.target.value === "all") {
              setList(-1);
            } else {
              setList(parseInt(e.target.value.substring(5)));
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
