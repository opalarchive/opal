import {
  Box,
  Divider,
  Flex,
  ListItem,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/layout";
import { FC, useMemo, useState } from "react";
import { HiOutlineViewList } from "react-icons/hi";
import { ProjectViewProps } from "../../../../../utils/getProjectViewProps";
import { getDifficultyColor } from "../../../../../utils/pretty";
import { getMean, getMedianSlow, getStDev } from "../../../../../utils/stats";
import CompileSidebar from "../../pieces/CompileSidebar";
import Dot from "../../pieces/Dot";

const Compile: FC<ProjectViewProps> = ({
  user,
  fbUser,
  project,
  projectEdit,
}) => {
  const [list, setList] = useState(-1);

  // In the future we might want to memo these, but for right now it should only rerender when
  // project and list change, which should both change the selected problems and their stats
  const selectedProblems =
    list == -1
      ? project.problems
      : project.lists[list].problems.map((idx) => project.problems[idx]);

  const categoryStats = (() => {
    const stats: Record<string, number> = Object.fromEntries(
      Object.keys(project.settings.categoryColors).map((category) => [
        category,
        0,
      ])
    );

    for (let i = 0; i < selectedProblems.length; i++) {
      stats[selectedProblems[i].category]++;
    }
    return stats;
  })();

  const difficultyList = selectedProblems.map((prob) => prob.difficulty);

  const difficultyStats: Record<string, { value: number; dot: boolean }> = {
    Average: { value: getMean(difficultyList), dot: true },
    Median: { value: getMedianSlow(difficultyList), dot: true },
    "Standard Deviation": { value: getStDev(difficultyList), dot: false },
  };

  return (
    <Flex p={4} bgColor="gray.50" minHeight="100%">
      <Box minWidth={48} maxWidth={72}>
        <CompileSidebar list={list} setList={setList} project={project} />
      </Box>
      <Stack spacing={4} ml={4} flex={1}>
        <Flex
          w="100%"
          p={4}
          borderWidth="1px"
          bgColor="white"
          direction="column"
        >
          <Text fontSize="xl" mb={2}>
            Details&nbsp;
            <HiOutlineViewList
              style={{
                display: "inline-block",
                position: "relative",
                top: "-0.1rem",
              }}
            />
          </Text>
          {selectedProblems.length == 0 ? (
            <>No problems found.</>
          ) : (
            <Flex flexGrow={1}>
              <Box flexGrow={1} flexBasis={0}>
                {selectedProblems.length} problem
                {selectedProblems.length != 1 && "s"}:
                <UnorderedList spacing={1} mt={1} ml={8}>
                  {Object.entries(project.settings.categoryColors).map(
                    ([category, color]) =>
                      !!categoryStats[category] && (
                        <ListItem key={category}>
                          {categoryStats[category]}&nbsp;{category}
                          &nbsp;
                          <Dot color={color} />
                        </ListItem>
                      )
                  )}
                </UnorderedList>
              </Box>
              <Divider orientation="vertical" mx={2} />
              <Box flexGrow={1} flexBasis={0}>
                Difficulty:
                <UnorderedList spacing={1} mt={1} ml={8}>
                  {Object.entries(difficultyStats).map(
                    ([dataPoint, { value, dot }]) => (
                      <ListItem key={dataPoint}>
                        {dataPoint}:&nbsp;
                        {Math.round(value * 10) / 10}
                        {dot && (
                          <>
                            &nbsp;
                            <Dot
                              color={getDifficultyColor(
                                project.settings.difficultyColors,
                                value
                              )}
                            />
                          </>
                        )}
                      </ListItem>
                    )
                  )}
                </UnorderedList>
              </Box>
            </Flex>
          )}
        </Flex>
      </Stack>
    </Flex>
  );
};

export default Compile;
