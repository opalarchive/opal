import { FC, memo, useEffect } from "react";
import { Box, Flex, Stack, Text, VStack } from "@chakra-ui/layout";
import {
  CategoryColors,
  DifficultyColors,
  Problem,
  ReplyType,
} from "../../../../utils/types";
import {
  FiArrowUp,
  FiArrowDown,
  FiMessageSquare,
  FiAlignLeft,
  FiX,
  FiPlus,
} from "react-icons/fi";
import { UserData } from "../../../../models/User";
import Dot from "./Dot";
import { getDifficultyColor, timeElapsed } from "../../../../utils/pretty";
import styles from "../../../../styles/problem.module.css";
import TagPanel from "./TagPanel";
import { BsArrowReturnRight, BsReply } from "react-icons/bs";

interface ProblemProps {
  user: UserData;
  idx: number;
  problem: Problem;
  categoryColors: CategoryColors;
  difficultyColors: DifficultyColors;
  projectEdit: (path: string, value: object | string | number) => void;
}

const ProblemPanel: FC<ProblemProps> = ({
  user,
  idx,
  problem,
  categoryColors,
  difficultyColors,
  projectEdit,
}) => {
  const problemVoteScore = !!problem.votes
    ? Object.values(problem.votes).reduce<number>((a, b) => a + b, 0)
    : 0;
  const categoryColor = categoryColors[problem.category];
  const difficultyColor = getDifficultyColor(
    difficultyColors,
    problem.difficulty
  );

  let comments = 0,
    solutions = 0;
  if (!!problem.replies) {
    problem.replies.forEach((reply) => {
      switch (ReplyType[reply.type]) {
        case ReplyType.COMMENT:
          comments++;
          break;
        case ReplyType.SOLUTION:
          solutions++;
          break;
      }
    });
  }

  return (
    <Box w="100%" p={4} borderWidth="1px" bgColor="white">
      <Flex>
        <Box minWidth={8} maxWidth={16}>
          <VStack spacing={4}>
            <Text fontSize="xl">#{idx + 1}</Text>
            <VStack spacing={0}>
              <Text
                color={
                  !!problem.votes && problem.votes[user.userId] === 1
                    ? "blue.400"
                    : "black"
                }
                onClick={() => {
                  projectEdit(
                    `problems/${idx}/votes/${user.userId}`,
                    problem.votes[user.userId] === 1 ? 0 : 1
                  );
                }}
              >
                <FiArrowUp size="1.2rem" />
              </Text>
              <Text fontSize="lg">{problemVoteScore}</Text>
              <Text
                color={
                  !!problem.votes && problem.votes[user.userId] === -1
                    ? "blue.400"
                    : "black"
                }
                onClick={() => {
                  projectEdit(
                    `problems/${idx}/votes/${user.userId}`,
                    problem.votes[user.userId] === -1 ? 0 : -1
                  );
                }}
              >
                <FiArrowDown size="1.2rem" />
              </Text>
            </VStack>
          </VStack>
        </Box>
        <Flex
          flex={1}
          direction="column"
          mx={4}
          minWidth="30rem"
          overflow="hidden"
        >
          <Text fontSize="xl">{problem.title}</Text>
          <Box>
            <Box display={["block", "block", "inline-block"]}>
              <Text display="inline-block" fontSize="sm">
                By
              </Text>
              <Text
                ml={1}
                display="inline-block"
                color="gray.700"
                fontSize="sm"
              >
                {problem.author}
              </Text>
            </Box>
            <Box display={["none", "none", "inline"]}> &bull; </Box>
            <Box display={["block", "block", "inline-block"]}>
              <Text display="inline-block" color="gray.700" fontSize="sm">
                Last edited {timeElapsed(problem.lastEdit)}
              </Text>
            </Box>
          </Box>
          <Text overflowWrap="anywhere">{problem.text}</Text>
          <Box flex={1} />
          <Flex mt={2}>
            <Text>Tags:&nbsp;</Text>

            <Box mb={-2}>
              {!!problem.tags &&
                problem.tags.map((tag) => (
                  <TagPanel key={tag}>
                    {tag}&nbsp;
                    <FiX />
                  </TagPanel>
                ))}
              <TagPanel
                style={{ paddingLeft: "0.3125rem", paddingRight: "0.3125rem" }}
              >
                <FiPlus />
              </TagPanel>
            </Box>
          </Flex>
        </Flex>
        <Box minWidth={32} maxWidth={48}>
          <Stack dir="column" spacing={4}>
            <Stack dir="column" spacing={1}>
              <Box>
                <Dot color={categoryColor} style={{ marginRight: "0.25rem" }} />
                &nbsp;
                {problem.category}
              </Box>
              <Box>
                <Dot
                  color={difficultyColor}
                  style={{ marginRight: "0.25rem" }}
                />
                &nbsp;d-{problem.difficulty}
              </Box>
            </Stack>
            <Stack dir="column" spacing={1}>
              <Box>
                <Box display="inline-block">
                  <FiMessageSquare className={styles.rightIcon} />
                </Box>
                <Box display="inline-block" color="gray.700">
                  <Text>{comments}</Text>
                </Box>
                &nbsp;comment{comments !== 1 && "s"}
              </Box>
              <Box>
                <Box display="inline-block">
                  <FiAlignLeft className={styles.rightIcon} />
                </Box>
                <Box display="inline-block" color="gray.700">
                  <Text>{solutions}</Text>
                </Box>
                &nbsp;solution{solutions !== 1 && "s"}
              </Box>
            </Stack>
            <Box>
              <Box display="inline-block">
                <BsArrowReturnRight className={styles.rightIcon} />
              </Box>
              Reply
            </Box>
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};

export default memo(ProblemPanel);
