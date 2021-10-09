import { FC, useState } from "react";
import { ProjectViewProps } from "../../../../../utils/getProjectViewProps";

import ProblemPanel from "../../pieces/ProblemPanel";
import { Box, Flex, Stack } from "@chakra-ui/react";
import { SortParam } from "../../../../../utils/types";
import { useMemo } from "react";
import FilterSidebar from "../../bars/FilterSidebar";

const Problems: FC<ProjectViewProps> = ({
  user,
  fbUser,
  project,
  projectEdit,
}) => {
  const [list, setList] = useState(-1);
  const [keywordSearch, setKeywordSearch] = useState("");
  const [authorSearch, setAuthorSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState(new Set<string>());
  const [difficultyLower, setDifficultyLower] = useState(
    project.settings.difficultyRange.start
  );
  const [difficultyUpper, setDifficultyUpper] = useState(
    project.settings.difficultyRange.end
  );

  const [sortParam, setSortParam] = useState<SortParam>(SortParam.INDEX);
  // Sort direction, true if ascending, false if descending
  const [sortAsc, setSortAsc] = useState(true);

  // List of problems indices that are valid
  // We use memo here because we shouldn't need to regenerate this list if we don't change the filtering parameters
  const filteredProblemIdx = useMemo(() => {
    const validCategories = new Set(categorySearch);

    return new Set(
      (list >= 0 && list < project.lists.length
        ? project.lists[list].problems
        : project.problems.map((_, idx) => idx)
      ).filter((idx) => {
        const prob = project.problems[idx];
        if (
          keywordSearch.length > 0 &&
          !prob.text
            .toLocaleUpperCase()
            .includes(keywordSearch.toLocaleUpperCase()) &&
          !prob.title
            .toLocaleUpperCase()
            .includes(keywordSearch.toLocaleUpperCase())
        ) {
          return false;
        }
        if (
          authorSearch.length > 0 &&
          !prob.author
            .toLocaleUpperCase()
            .includes(authorSearch.toLocaleUpperCase())
        ) {
          return false;
        }
        if (categorySearch.length > 0 && !validCategories.has(prob.category)) {
          return false;
        }
        if (
          tagSearch.size > 0 &&
          !prob.tags.some((tag) => tagSearch.has(tag))
        ) {
          return false;
        }
        if (
          prob.difficulty < difficultyLower ||
          prob.difficulty > difficultyUpper
        ) {
          return false;
        }
        return true;
      })
    );
  }, [
    project,
    list,
    keywordSearch,
    authorSearch,
    categorySearch,
    tagSearch,
    difficultyLower,
    difficultyUpper,
  ]);

  // All problem indices sorted
  const sortedProblemIdx = useMemo(() => {
    const votes = project.problems.map((prob) =>
      Object.values(prob.votes).reduce<number>((t, v) => t + v, 0)
    );
    const customSortParamComp = (i: number, j: number): number => {
      switch (sortParam) {
        case SortParam.DIFFICULTY:
          return (
            project.problems[i].difficulty - project.problems[j].difficulty
          );
        case SortParam.VOTES:
          return votes[i] - votes[j];
        default:
          return 0;
      }
    };
    return project.problems
      .map((_, idx) => idx)
      .sort((i, j) => {
        const comp = customSortParamComp(i, j);
        return (comp === 0 ? i - j : comp) * (sortAsc ? 1 : -1);
      });
  }, [project, sortParam, sortAsc]);

  const problemIdx = sortedProblemIdx.filter((idx) =>
    filteredProblemIdx.has(idx)
  );

  return (
    <Flex p={4} bgColor="gray.50" minHeight="100%">
      <Box minWidth={48} maxWidth={72}>
        <FilterSidebar
          list={list}
          keywordSearch={keywordSearch}
          authorSearch={authorSearch}
          categorySearch={categorySearch}
          tagSearch={tagSearch}
          difficultyLower={difficultyLower}
          difficultyUpper={difficultyUpper}
          sortParam={sortParam}
          sortAsc={sortAsc}
          setList={setList}
          setKeywordSearch={setKeywordSearch}
          setAuthorSearch={setAuthorSearch}
          setCategorySearch={setCategorySearch}
          setTagSearch={setTagSearch}
          setDifficultyLower={setDifficultyLower}
          setDifficultyUpper={setDifficultyUpper}
          setSortParam={setSortParam}
          setSortAsc={setSortAsc}
          project={project}
        />
      </Box>
      <Stack spacing={4} ml={4} flex={1}>
        {problemIdx.map((idx) => (
          <ProblemPanel
            key={`problem-${idx}`}
            user={user}
            idx={idx}
            problem={project.problems[idx]}
            categoryColors={project.settings.categoryColors}
            difficultyColors={project.settings.difficultyColors}
          />
        ))}
      </Stack>
    </Flex>
  );
};

export default Problems;
