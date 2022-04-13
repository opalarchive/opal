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
import {
  exportBody,
  JSONTemplate,
  Template,
  YAMLTemplate,
} from "../../../../../utils/exportData";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { Radio, RadioGroup } from "@chakra-ui/radio";
import { Button } from "@chakra-ui/button";
import { Textarea } from "@chakra-ui/textarea";

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

  // exporting to json, yaml, or custom
  const [templateType, setTemplateType] = useState<"JSON" | "YAML" | "Custom">(
    "JSON"
  );
  const [customTemplate, setCustomTemplate] = useState<Template>({
    body: "",
    problem: "",
    reply: "",
    tag: "",
    escape: false,
  });

  const template: Template =
    templateType === "JSON"
      ? JSONTemplate
      : templateType === "YAML"
      ? YAMLTemplate
      : customTemplate;

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
                top: "0.225rem",
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
              <Divider orientation="vertical" mx={4} />
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
                top: "0.15rem",
              }}
            />
          </Text>
          {list === -1 ? (
            <Stack>
              {order.map((probIdx) => (
                <ProblemDraggable
                  key={probIdx}
                  idx={probIdx}
                  problem={project.problems[probIdx]}
                  categoryColors={project.settings.categoryColors}
                  difficultyColors={project.settings.difficultyColors}
                />
              ))}
            </Stack>
          ) : (
            <Flex flexGrow={1}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Box flexGrow={1} flexBasis={0}>
                  <Text fontSize="lg" mb={2}>
                    Not Included Problems
                  </Text>
                  {notIncluded.length === 0 &&
                    "Empty for now. No problem has been left unadded."}
                  <Droppable droppableId="not-included">
                    {(provided, snapshot) => (
                      <Stack
                        height="100%"
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
                  {order.length === 0 &&
                    "Empty for now. Try dragging a problem in."}
                  <Droppable droppableId="included">
                    {(provided, snapshot) => (
                      <Stack
                        height="100%"
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
        {/* Exporting */}
        <Flex
          w="100%"
          p={4}
          borderWidth="1px"
          bgColor="white"
          direction="column"
        >
          <Text fontSize="xl" mb={2}>
            Export&nbsp;
            <BsBoxArrowUpRight
              style={{
                display: "inline-block",
                position: "relative",
                top: "0.05rem",
              }}
            />
          </Text>
          {order.length == 0 ? (
            <Box>No problems to export.</Box>
          ) : (
            <Flex flexGrow={1}>
              <RadioGroup
                onChange={(nextVal) =>
                  setTemplateType(nextVal as "JSON" | "YAML" | "Custom")
                }
                value={templateType}
              >
                <Stack>
                  <Radio value="JSON">JSON</Radio>
                  <Radio value="YAML">YAML</Radio>
                  <Radio value="Custom">Custom</Radio>
                </Stack>
              </RadioGroup>
              <Divider orientation="vertical" mx={4} />
              <Box flexGrow={1}>
                <Stack>
                  <Box>
                    <Text fontSize="lg" mb={1}>
                      Body
                    </Text>
                    <Box bg="gray.100" w="100%" p={1}>
                      {templateType === "Custom" ? (
                        <pre>
                          <Textarea
                            p={0}
                            value={customTemplate.body}
                            onChange={(e) => {
                              const t = e.target as HTMLElement;
                              t.style.height = "5px";
                              t.style.height = `calc(max(${t.scrollHeight}px, 2.75rem))`;
                              setCustomTemplate((oldTemplate) => {
                                let newTemplate = { ...oldTemplate };
                                newTemplate.body = e.target.value;
                                return newTemplate;
                              });
                            }}
                            resize="none"
                            style={{
                              border: "none",
                              boxShadow: "none",
                              overflow: "hidden",
                              minHeight: 0,
                            }}
                          />
                        </pre>
                      ) : (
                        <pre>{template.body}</pre>
                      )}
                    </Box>
                  </Box>
                  <Box>
                    <Text fontSize="lg" mb={1}>
                      Problem
                    </Text>
                    <Box bg="gray.100" p={1}>
                      {templateType === "Custom" ? (
                        <pre>
                          <Textarea
                            p={0}
                            value={customTemplate.problem}
                            onChange={(e) => {
                              const t = e.target as HTMLElement;
                              t.style.height = "5px";
                              t.style.height = `calc(max(${t.scrollHeight}px, 2.75rem))`;
                              setCustomTemplate((oldTemplate) => {
                                let newTemplate = { ...oldTemplate };
                                newTemplate.problem = e.target.value;
                                return newTemplate;
                              });
                            }}
                            resize="none"
                            style={{
                              border: "none",
                              boxShadow: "none",
                              overflow: "hidden",
                              minHeight: 0,
                            }}
                          />
                        </pre>
                      ) : (
                        <pre>{template.problem}</pre>
                      )}
                    </Box>
                  </Box>
                  <Box>
                    <Text fontSize="lg" mb={1}>
                      Reply
                    </Text>
                    <Box bg="gray.100" p={1}>
                      {templateType === "Custom" ? (
                        <pre>
                          <Textarea
                            p={0}
                            value={customTemplate.reply}
                            onChange={(e) => {
                              const t = e.target as HTMLElement;
                              t.style.height = "5px";
                              t.style.height = `calc(max(${t.scrollHeight}px, 2.75rem))`;
                              setCustomTemplate((oldTemplate) => {
                                let newTemplate = { ...oldTemplate };
                                newTemplate.reply = e.target.value;
                                return newTemplate;
                              });
                            }}
                            resize="none"
                            style={{
                              border: "none",
                              boxShadow: "none",
                              overflow: "hidden",
                              minHeight: 0,
                            }}
                          />
                        </pre>
                      ) : (
                        <pre>{template.reply}</pre>
                      )}
                    </Box>
                  </Box>
                  <Box>
                    <Text fontSize="lg" mb={1}>
                      Tag
                    </Text>
                    <Box bg="gray.100" p={1}>
                      {templateType === "Custom" ? (
                        <pre>
                          <Textarea
                            p={0}
                            value={customTemplate.tag}
                            onChange={(e) => {
                              const t = e.target as HTMLElement;
                              t.style.height = "5px";
                              t.style.height = `calc(max(${t.scrollHeight}px, 2.75rem))`;
                              setCustomTemplate((oldTemplate) => {
                                let newTemplate = { ...oldTemplate };
                                newTemplate.tag = e.target.value;
                                return newTemplate;
                              });
                            }}
                            resize="none"
                            style={{
                              border: "none",
                              boxShadow: "none",
                              overflow: "hidden",
                              minHeight: 0,
                            }}
                          />
                        </pre>
                      ) : (
                        <pre>{template.tag}</pre>
                      )}
                    </Box>
                  </Box>
                </Stack>
                <Flex mt={4}>
                  <Box flexGrow={1} />
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        exportBody(
                          template,
                          order.map((idx) => project.problems[idx])
                        )
                      );
                    }}
                  >
                    Copy Export &nbsp; <BsBoxArrowUpRight />
                  </Button>
                </Flex>
              </Box>
            </Flex>
          )}
        </Flex>
      </Stack>
    </Flex>
  );
};

export default Compile;
