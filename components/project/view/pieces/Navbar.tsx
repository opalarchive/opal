import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { UUID } from "../../../../utils/constants";

interface NavbarProps {
  projectName: string;
  uuid: UUID;
}

const Navbar: React.FC<NavbarProps> = ({ projectName, uuid }) => {
  return (
    <Box p={4} borderBottom="1px" borderColor="gray.200">
      <Flex>
        <Text fontSize="lg">Project: {projectName}</Text>
        <Box flexGrow={1} />
        <Flex direction="column" pr={4}>
          <Box flexGrow={1} />
          <Stack direction="row" spacing={4}>
            <Link href={`/project/view/${uuid}/problems`}>Problems</Link>
            <Link href={`/project/view/${uuid}/compile`}>Compile</Link>
            <Link href={`/project/view/${uuid}/settings`}>Settings</Link>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};
export default Navbar;
