import { Box, Divider, Flex, Stack, Text } from "@chakra-ui/layout";
import { ChangeEvent, FC, memo, useCallback, useEffect, useState } from "react";
import { ProjectViewProps } from "../../../../../utils/getProjectViewProps";
import SettingsNavbar from "../../bars/SettingsNavbar";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { hexColor, isHexColor, Project } from "../../../../../utils/types";
import { BiCategoryAlt } from "react-icons/bi";
import { useRouter } from "next/router";

import stylesSelect from "../../../../../styles/sidebarSelect.module.css";
import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";

interface AppearanceProps {
  uuid: string;
  project: Project;
  projectEdit: (path: string, value: object | string | number) => void;
}

const Appearance: FC<AppearanceProps> = ({ uuid, project, projectEdit }) => {
  const categoryColors = project.settings.categoryColors;

  const [currentCategory, setCurrentCategory] = useState(
    Object.keys(categoryColors)[0]
  );
  const [currentColor, setCurrentColor] = useState<hexColor>(
    Object.values(categoryColors)[0]
  );
  const [currentInputColor, setCurrentInputColor] = useState(
    Object.values(categoryColors)[0]
  );

  const changeCategory = (category: string) => {
    setCurrentCategory(category);
    setCurrentColor(categoryColors[category]);
    setCurrentInputColor(categoryColors[category]);
  };

  const onSaveChange = () => {
    const newCategoryColors = { ...categoryColors };
    newCategoryColors[currentCategory] = currentColor;
    projectEdit(`settings/categoryColors`, newCategoryColors);
  };

  const onSetCurrentColorSafe = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let curValue = e.target.value;

      curValue = curValue.toLowerCase();
      curValue = (curValue.match(/[a-f0-9]/g) ?? []).slice(0, 6).join("");

      setCurrentInputColor("#" + curValue);
      if (isHexColor("#" + curValue)) {
        setCurrentColor("#" + curValue);
      }
    },
    []
  );

  return (
    <Stack spacing={4} ml={4} flex={1}>
      <Flex w="100%" p={4} borderWidth="1px" bgColor="white" direction="column">
        <Text fontSize="xl" mb={2}>
          Categories&nbsp;
          <BiCategoryAlt
            style={{
              display: "inline-block",
              position: "relative",
              top: "-0.15rem",
            }}
          />
        </Text>
        <Flex>
          {/* {Object.entries(tempCategoryColors).map(([category, color]) => (
    <div>
      {category}{" "}
      <ColorBox
        color={color}
        onChange={(newColor: hexColor) =>
          onChangeCategoryColor(category, newColor.slice(1))
        }
      />
    </div>
  ))} */}
          <Stack direction="column" minWidth={32} spacing={0.5}>
            {Object.entries(categoryColors).map(([category, color]) => (
              <div
                key={category}
                className={`${stylesSelect.link} ${
                  category === currentCategory
                    ? stylesSelect.linkCurrent
                    : stylesSelect.linkOther
                }`}
                onClick={() => changeCategory(category)}
              >
                {category}
              </div>
            ))}
          </Stack>
          <Divider orientation="vertical" ml={4} mr={6} />
          <Stack sx={{ width: "12.5rem" }} spacing={4}>
            <Flex>
              <Box
                height={10}
                width={10}
                mr={4}
                sx={{
                  bg: currentColor,
                  borderRadius: "0.25rem",
                  borderColor: "gray.500",
                  borderWidth: "1px",
                }}
              />
              <Input
                width={0}
                flexGrow={1}
                value={currentInputColor}
                onChange={onSetCurrentColorSafe}
              />
            </Flex>
            <HexColorPicker
              color={currentColor}
              onChange={(color) => {
                setCurrentColor(color);
                setCurrentInputColor(color);
              }}
            />

            {categoryColors[currentCategory] !== currentColor && (
              <Flex>
                <Box flexGrow={1} />
                <Button
                  onClick={() =>
                    setCurrentColor(categoryColors[currentCategory])
                  }
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button onClick={onSaveChange} colorScheme="blue" ml={2}>
                  Save
                </Button>
              </Flex>
            )}
          </Stack>
        </Flex>
      </Flex>
    </Stack>
  );
};

const Settings: FC<ProjectViewProps> = ({
  uuid,
  user,
  fbUser,
  project,
  projectEdit,
}) => {
  const router = useRouter();
  const { params } = router.query;

  const subpage = (params as string[])[1]; // params will always be ['settings', subpage, ...] since the url starts with /project/view/[uuid]/settings/[subpage]...

  return (
    <Flex p={4} bgColor="gray.50" minHeight="100%">
      <Box minWidth={48} maxWidth={72}>
        <SettingsNavbar uuid={uuid} />
      </Box>
      <Appearance uuid={uuid} project={project} projectEdit={projectEdit} />
    </Flex>
  );
};

export default Settings;
