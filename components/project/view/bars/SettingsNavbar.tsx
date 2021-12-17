import { Box, Stack } from "@chakra-ui/react";
import Link from "next/link";
import { FC } from "react";
import { UUID } from "../../../../utils/constants";
import stylesSelect from "../../../../styles/sidebarSelect.module.css";

interface SettingsNavbarProps {
  uuid: UUID;
}

const SettingsNavbar: FC<SettingsNavbarProps> = ({ uuid }) => {
  return (
    <Stack direction="column" spacing={4}>
      <Box bg="white" borderWidth="1px" px={2} py={3}>
        {/* <Text fontSize="xl" mb={2}>
          List&nbsp;
          <FiList
            style={{
              display: "inline-block",
              position: "relative",
              top: "-0.05rem",
            }}
          />
        </Text> */}
        <Link href={`/project/view/${uuid}/settings/appearance`}>
          <Box className={`${stylesSelect.link} ${stylesSelect.linkOther}`}>
            Appearance
          </Box>
        </Link>
      </Box>
    </Stack>
  );
};
export default SettingsNavbar;
