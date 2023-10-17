import { FC, useState } from "react";
import { ProjectViewProps } from "../../../../../utils/getProjectViewProps";

import ProblemPanel from "../../pieces/ProblemPanel";
import { Box, Flex, Stack } from "@chakra-ui/react";
import { SortParam } from "../../../../../utils/types";
import { useMemo } from "react";
import FilterSidebar from "../../bars/FilterSidebar";

const ProblemFocus: FC<ProjectViewProps> = ({
  user,
  fbUser,
  project,
  projectEdit,
}) => {
  return (
    <Flex p={4} bgColor="gray.50" minHeight="100%">
      <Box minWidth={48} maxWidth={72}>
        side
      </Box>
      <Box ml={4}>meirl</Box>
    </Flex>
  );
};

export default ProblemFocus;
