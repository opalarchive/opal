import { FC, memo } from "react";
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from "react-beautiful-dnd";
import { GrDrag } from "react-icons/gr";
import { FiLock } from "react-icons/fi";
import {
  CategoryColors,
  DifficultyColors,
  Problem,
} from "../../../../utils/types";
import { Box, Flex } from "@chakra-ui/layout";
import Dot from "./Dot";
import { getDifficultyColor } from "../../../../utils/pretty";
import styles from "../../../../styles/problem-draggable.module.css";

interface ProblemDraggableProps {
  refInner?: React.Ref<HTMLDivElement>;
  draggableProps?: DraggableProvidedDraggableProps;
  handleProps?: DraggableProvidedDragHandleProps;
  idx: number;
  problem: Problem;
  categoryColors: CategoryColors;
  difficultyColors: DifficultyColors;
  style?: React.CSSProperties;
}

const ProblemDraggable: FC<ProblemDraggableProps> = ({
  refInner,
  draggableProps,
  handleProps,
  idx,
  problem,
  categoryColors,
  difficultyColors,
  style,
}) => {
  return (
    <Box
      w="100%"
      borderWidth="1px"
      bgColor="white"
      rounded="md"
      {...(!!draggableProps ? draggableProps : {})}
      style={{ ...style }}
      ref={refInner}
    >
      <Flex py={2}>
        {!!handleProps ? (
          <Box {...handleProps}>
            <GrDrag
              size="1.8rem"
              style={{ display: "block" }}
              className={styles.dragSelector}
            />
          </Box>
        ) : (
          <Box p="0.2rem 0.1rem 0.4rem 0.4rem">
            <FiLock size="1.2rem" style={{ display: "block" }} />
          </Box>
        )}
        <Box minWidth={16} pl={2}>
          #{idx + 1}
        </Box>
        <Box>{problem.title}</Box>
        <Box flexGrow={1} />
        <Box minWidth={36}>
          <Dot color={categoryColors[problem.category]} />
          &nbsp;{problem.category}
        </Box>
        <Box minWidth={16}>
          <Dot
            color={getDifficultyColor(difficultyColors, problem.difficulty)}
          />
          &nbsp;d-{problem.difficulty}
        </Box>
      </Flex>
    </Box>
  );
};

export default memo(ProblemDraggable);
