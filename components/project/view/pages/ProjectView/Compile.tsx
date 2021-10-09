import {
  Box,
  Divider,
  Flex,
  ListItem,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/layout";
import { useRouter } from "next/router";
import { FC, useState, useEffect } from "react";
import { ProjectViewProps } from "../../../../../utils/getProjectViewProps";
import { getDifficultyColor, lowerBound } from "../../../../../utils/pretty";
import { getMean, getMedianSlow, getStDev } from "../../../../../utils/stats";
import CompileSidebar from "../../bars/CompileSidebar";
import Dot from "../../pieces/Dot";
import { HiOutlineViewList } from "react-icons/hi";
import { AiOutlineEdit, AiOutlineSwap } from "react-icons/ai";
import ProblemDraggable from "../../pieces/ProblemDraggable";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

const Compile: FC<ProjectViewProps> = ({ uuid, project, projectEdit }) => {
  const router = useRouter();
  const list =
    typeof router.query.list === "string"
      ? parseInt(router.query.list) - 1
      : -1;

  // In the future we might want to memo these, but for right now it should only rerender when
  // project and list change, which should both change the selected problems and their stats
  const selectedProblems =
    list === -1
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

  // problem ordering
  const [notIncluded, setNotIncluded] = useState<number[]>([]);
  const [order, setOrder] = useState<number[]>([]);

  useEffect(() => {
    if (list === -1) {
      setNotIncluded([]);
      setOrder(Array.from(Array(project.problems.length).keys()));
    } else {
      const included = new Set(project.lists[list].problems);
      setNotIncluded(
        Array.from(Array(project.problems.length).keys()).filter(
          (idx) => !included.has(idx)
        )
      );
      setOrder(project.lists[list].problems);
    }
  }, [list]);

  const onDragEnd = (result: DropResult) => {
    if (list === -1) return; // should be impossible, but just as a precaution
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const sourceInd = result.source.index;
    const destInd = result.destination.index;
    console.log(result);
    if (result.source.droppableId === result.destination.droppableId) {
      if (result.source.droppableId === "included") {
        setOrder((oldOrder) => {
          let newOrder = Array.from(oldOrder);
          const [movedProblem] = newOrder.splice(sourceInd, 1);
          newOrder.splice(destInd, 0, movedProblem);

          projectEdit(`lists/${list}/problems`, newOrder);
          return newOrder;
        });
      } else if (result.source.droppableId === "not-included") {
        // delete later
        setNotIncluded((oldNotIncluded) => {
          let newNotIncluded = Array.from(oldNotIncluded);
          const [movedProblem] = newNotIncluded.splice(sourceInd, 1);
          newNotIncluded.splice(destInd, 0, movedProblem);

          return newNotIncluded;
        });
      }
    } else {
      setOrder((oldOrder) => {
        let newOrder = Array.from(oldOrder);
        setNotIncluded((oldNotIncluded) => {
          let newNotIncluded = Array.from(oldNotIncluded);

          // included -> not included, i.e. removing a problem
          if (result.source.droppableId === "included") {
            const [movedProblem] = newOrder.splice(sourceInd, 1);

            // binary search so they not included array stays sorted
            const trueDestInd = lowerBound(newNotIncluded, movedProblem);
            newNotIncluded.splice(trueDestInd, 0, movedProblem);

            // not included -> included, i.e. adding a problem
          } else if (result.source.droppableId === "not-included") {
            const [movedProblem] = newNotIncluded.splice(sourceInd, 1);
            newOrder.splice(destInd, 0, movedProblem);
          }

          return newNotIncluded;
        });

        projectEdit(`lists/${list}/problems`, newOrder);
        return newOrder;
      });
    }
  };

  return (
    <Flex p={4} bgColor="gray.50" minHeight="100%">
      <Box minWidth={48} maxWidth={72}>
        <CompileSidebar uuid={uuid} project={project} />
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
          {selectedProblems.length === 0 ? (
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
        {selectedProblems.length > 0 && (
          <>
            {/* Problem selection and ordering */}
            <Flex
              w="100%"
              p={4}
              borderWidth="1px"
              bgColor="white"
              direction="column"
            >
              <Text fontSize="xl" mb={2}>
                Problems&nbsp;
                <AiOutlineEdit
                  style={{
                    display: "inline-block",
                    position: "relative",
                    top: "-0.1rem",
                  }}
                />
              </Text>
              {list === -1 ? (
                order.map((probIdx) => (
                  <ProblemDraggable
                    key={probIdx}
                    idx={probIdx}
                    problem={project.problems[probIdx]}
                    categoryColors={project.settings.categoryColors}
                    difficultyColors={project.settings.difficultyColors}
                  />
                ))
              ) : (
                <Flex flexGrow={1}>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Box flexGrow={1} flexBasis={0}>
                      <Text fontSize="lg" mb={2}>
                        Not Included Problems
                      </Text>
                      <Droppable droppableId="not-included">
                        {(provided, snapshot) => (
                          <Stack
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {notIncluded.map(
                              (probIdx, index) =>
                                project.problems[probIdx] && ( // workaround for error when the order updates after the first render directly after the current list changes
                                  <Draggable
                                    key={probIdx}
                                    draggableId={"" + probIdx}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <ProblemDraggable
                                        refInner={provided.innerRef}
                                        draggableProps={provided.draggableProps}
                                        handleProps={provided.dragHandleProps}
                                        idx={probIdx}
                                        problem={project.problems[probIdx]}
                                        categoryColors={
                                          project.settings.categoryColors
                                        }
                                        difficultyColors={
                                          project.settings.difficultyColors
                                        }
                                        style={{
                                          ...provided.draggableProps.style,
                                        }}
                                      />
                                    )}
                                  </Draggable>
                                )
                            )}
                            {provided.placeholder}
                          </Stack>
                        )}
                      </Droppable>
                    </Box>
                    <Flex direction="column">
                      <Divider flexGrow={1} orientation="vertical" mx={6} />
                      <Box p={2} color="gray.700">
                        <AiOutlineSwap size="2rem" />
                      </Box>
                      <Divider flexGrow={1} orientation="vertical" mx={6} />
                    </Flex>
                    <Box flexGrow={1} flexBasis={0}>
                      <Text fontSize="lg" mb={2}>
                        Included Problems
                      </Text>
                      <Droppable droppableId="included">
                        {(provided, snapshot) => (
                          <Stack
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {order.map(
                              (probIdx, index) =>
                                project.problems[probIdx] && ( // workaround for error when the order updates after the first render directly after the current list changes
                                  <Draggable
                                    key={probIdx}
                                    draggableId={"" + probIdx}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <ProblemDraggable
                                        refInner={provided.innerRef}
                                        draggableProps={provided.draggableProps}
                                        handleProps={provided.dragHandleProps}
                                        idx={probIdx}
                                        problem={project.problems[probIdx]}
                                        categoryColors={
                                          project.settings.categoryColors
                                        }
                                        difficultyColors={
                                          project.settings.difficultyColors
                                        }
                                        style={{
                                          ...provided.draggableProps.style,
                                        }}
                                      />
                                    )}
                                  </Draggable>
                                )
                            )}
                            {provided.placeholder}
                          </Stack>
                        )}
                      </Droppable>
                    </Box>
                  </DragDropContext>
                </Flex>
              )}
            </Flex>
          </>
        )}
      </Stack>
    </Flex>
  );
};

export default Compile;
