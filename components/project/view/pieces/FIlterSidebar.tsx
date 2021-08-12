import {
  Box,
  Checkbox,
  CheckboxGroup,
  Flex,
  Input,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Dispatch, FC, SetStateAction } from "react";
import { FiArrowDown, FiArrowUp, FiFilter, FiList } from "react-icons/fi";
import { Project, SortParam } from "../../../../utils/types";
import { HiOutlineSortDescending } from "react-icons/hi";
import RangeSlider from "./RangeSlider";
import TagPanel from "./TagPanel";

// These are just the functions from useState()[1]
interface FilterSidebarProps {
  list: number;
  keywordSearch: string;
  authorSearch: string;
  categorySearch: string[];
  tagSearch: Set<string>;
  difficultyLower: number;
  difficultyUpper: number;
  sortParam: SortParam;
  sortAsc: boolean;
  setList: Dispatch<SetStateAction<number>>;
  setKeywordSearch: Dispatch<SetStateAction<string>>;
  setAuthorSearch: Dispatch<SetStateAction<string>>;
  setCategorySearch: Dispatch<SetStateAction<string[]>>;
  setTagSearch: Dispatch<SetStateAction<Set<string>>>;
  setDifficultyLower: Dispatch<SetStateAction<number>>;
  setDifficultyUpper: Dispatch<SetStateAction<number>>;
  setSortParam: Dispatch<SetStateAction<SortParam>>;
  setSortAsc: Dispatch<SetStateAction<boolean>>;
  project: Project;
}

const FilterSidebar: FC<FilterSidebarProps> = ({
  list,
  keywordSearch,
  authorSearch,
  categorySearch,
  tagSearch,
  difficultyLower,
  difficultyUpper,
  sortParam,
  sortAsc,
  setList,
  setKeywordSearch,
  setAuthorSearch,
  setCategorySearch,
  setTagSearch,
  setDifficultyLower,
  setDifficultyUpper,
  setSortParam,
  setSortAsc,
  project,
}) => {
  const allTags = useMemo(() => {
    const tags = new Set<string>();

    project.problems.forEach((prob) => {
      prob.tags.forEach((tag) => {
        tags.add(tag);
      });
    });
    return Array.from(tags);
  }, [project]);

  const onClickTag = (tag: string) =>
    setTagSearch((tags) => {
      const newTags = new Set(tags);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      return newTags;
    });

  let sortParamArray: SortParam[] = Object.values(SortParam);
  sortParamArray.splice(sortParamArray.indexOf(SortParam.INDEX), 1);
  sortParamArray = [SortParam.INDEX, ...sortParamArray];

  return (
    <Stack direction="column" spacing={4}>
      <Box bg="white" p={4}>
        <Text fontSize="xl" mb={2}>
          List&nbsp;
          <FiList
            style={{
              display: "inline-block",
              position: "relative",
              top: "-0.05rem",
            }}
          />
        </Text>
        <Select
          value={list === -1 ? "all" : `list-${list}`}
          onChange={(e) => {
            if (e.target.value === "all") {
              setList(-1);
            } else {
              setList(parseInt(e.target.value.substring(5)));
            }
          }}
        >
          <option value="all">All Problems</option>
          {project.lists.map((list, idx) => (
            <option value={`list-${idx}`} key={`list-${idx}`}>
              {list.name}
            </option>
          ))}
        </Select>
      </Box>
      <Box bg="white" p={4}>
        <Text fontSize="xl" mb={2}>
          Filter&nbsp;
          <FiFilter
            style={{
              display: "inline-block",
              position: "relative",
              top: "-0.1rem",
            }}
          />
        </Text>
        <Stack spacing={4}>
          <Box>
            <Text mb={2}>Keyword:</Text>
            <Input
              value={keywordSearch}
              onChange={(event) => setKeywordSearch(event.target.value)}
              placeholder="Keyword"
            />
          </Box>
          <Box>
            <Text mb={2}>Author:</Text>
            <Input
              value={authorSearch}
              onChange={(event) => setAuthorSearch(event.target.value)}
              placeholder="Author"
            />
          </Box>
          <Box>
            <Text mb={2}>Category:</Text>
            <CheckboxGroup
              value={categorySearch}
              onChange={(values) => setCategorySearch(values as string[])}
            >
              <Stack>
                {Object.keys(project.settings.categoryColors).map(
                  (category) => (
                    <Checkbox value={category} key={`checkbox-${category}`}>
                      {category}
                    </Checkbox>
                  )
                )}
              </Stack>
            </CheckboxGroup>
          </Box>
          <Box>
            <Text mb={2}>Category:</Text>
            <Box mb={-2}>
              {!!allTags &&
                allTags.map((tag) => (
                  <TagPanel
                    active={tagSearch.has(tag)}
                    key={tag}
                    onClick={() => onClickTag(tag)}
                  >
                    {tag}
                    {/* &nbsp;
                    <Dot
                      unfilled={!tagSearch.has(tag)}
                      color={
                        tagSearch.has(tag)
                          ? { r: 104, g: 230, b: 145 }
                          : { r: 113, g: 128, b: 150 }
                      }
                    /> */}
                  </TagPanel>
                ))}
            </Box>
          </Box>
          <Box>
            <Text mb={2}>Difficulty:</Text>
            Valid range: [{difficultyLower}, {difficultyUpper}]
            <Flex>
              <Text mr={1}>{project.settings.difficultyRange.start}</Text>
              <Box flex={1} mt={0.5} mx={2}>
                <RangeSlider
                  bottom={project.settings.difficultyRange.start}
                  top={project.settings.difficultyRange.end}
                  onChangeEnd={(lower, upper) => {
                    setDifficultyLower(lower);
                    setDifficultyUpper(upper);
                  }}
                />
              </Box>
              <Text ml={1}>{project.settings.difficultyRange.end}</Text>
            </Flex>
          </Box>
        </Stack>
      </Box>
      <Box bg="white" p={4}>
        <Text fontSize="xl" mb={2}>
          Sort&nbsp;
          <HiOutlineSortDescending
            style={{
              display: "inline-block",
              position: "relative",
              top: "-0.1rem",
            }}
          />
        </Text>
        <Stack spacing={2}>
          {sortParamArray.map((param) => (
            <Box key={param}>
              <Text display="inline-block" fontSize="lg">
                {param.slice(0, 1).toLocaleUpperCase() +
                  param.slice(1).toLocaleLowerCase()}
              </Text>
              <Box
                display="inline-block"
                position="relative"
                top="-0.1rem"
                ml={1}
                size={21}
                as={sortAsc && sortParam === param ? FiArrowDown : FiArrowUp}
                color={sortParam === param ? "gray.700" : "white"}
                _hover={{ color: sortParam === param ? "black" : "gray.300" }}
                onClick={() => {
                  setSortParam((sort) => {
                    if (sort === param) {
                      setSortAsc((asc) => !asc);
                      return sort;
                    }
                    setSortAsc(false);
                    return param;
                  });
                }}
              />
            </Box>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};
export default FilterSidebar;
