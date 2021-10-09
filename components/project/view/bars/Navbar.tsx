import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { UUID } from "../../../../utils/constants";
import { ProjectViewPage } from "../../../../utils/types";

import styles from "../../../../styles/navbar.module.css";

interface NavbarProps {
  projectViewPage: ProjectViewPage;
  projectName: string;
  uuid: UUID;
}

const Navbar: React.FC<NavbarProps> = ({
  projectViewPage,
  projectName,
  uuid,
}) => {
  return (
    <Box borderBottom="1px" borderColor="gray.200">
      <Flex>
        <Text fontSize="lg" p={4}>
          Project: {projectName}
        </Text>
        <Box flexGrow={1} />
        <Flex direction="column" pr={8}>
          <Box flexGrow={1} />
          <Flex direction="row">
            <Box
              className={
                ProjectViewPage[projectViewPage] === ProjectViewPage.PROBLEMS
                  ? `${styles.linkActive} ${styles.link}`
                  : styles.link
              }
            >
              <Link href={`/project/view/${uuid}/problems`}>Problems</Link>
            </Box>
            <Box
              className={
                ProjectViewPage[projectViewPage] === ProjectViewPage.COMPILE
                  ? `${styles.linkActive} ${styles.link}`
                  : styles.link
              }
            >
              <Link href={`/project/view/${uuid}/compile`}>Compile</Link>
            </Box>
            <Box
              className={
                ProjectViewPage[projectViewPage] === ProjectViewPage.SETTINGS
                  ? `${styles.linkActive} ${styles.link}`
                  : styles.link
              }
            >
              <Link href={`/project/view/${uuid}/settings`}>Settings</Link>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};
export default Navbar;
