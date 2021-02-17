import React from "react";

import {
  Divider,
  Paper,
  TableSortLabel,
  withStyles,
  WithStyles,
  withTheme,
  WithTheme,
} from "@material-ui/core";
import styles from "./index.css";
import { compose } from "recompose";
import { SidebarProps } from "../../../../../Template/SidebaredBase";
import { List, Problem } from "../../../../../../../../.shared";
import { FiArrowDown, FiFilter, FiList } from "react-icons/fi";
import { HiOutlineSortDescending } from "react-icons/hi";
import Dot from "../../../Embedded/Dot";
import { CategoryColors } from "../../..";
import Scrollbar from "react-scrollbars-custom";
import { SortDirection } from "../../../../../../Constants/types";
import ListSelect from "../../../Embedded/ListSelect";
import {
  KeywordAccordion,
  AuthorAccordion,
  CategoryAccordion,
  TagAccordion,
  DifficultyAccordion,
} from "./accordions";

interface FilterPropsBase {
  setFilter: (filter: (problem: Problem) => boolean) => void;
  setSortWeight: (
    sortWeight: (problem: Problem) => { p: number; s: number }
  ) => void;
  difficultyRange: {
    start: number;
    end: number;
  };
  categoryColors: CategoryColors;
  editors: string[];
  allTags: Set<string>;
  clickedTags: {
    [tag: string]: boolean;
  };
  onClickTag: (tagText: string) => void;
  lists: List[];
  currentList: number;
  setCurrentList: (list: number) => void;
}

type FilterProps = SidebarProps &
  FilterPropsBase &
  WithStyles<typeof styles> &
  WithTheme;

interface FilterState {
  keyword: string;
  author: string;
  difficulty: { start: number; end: number };
  category: {
    [category: string]: boolean;
  };
  sort: {
    dataPoint: "ind" | "difficulty" | "votes";
    direction: SortDirection;
  };
}

class Filter extends React.Component<FilterProps, FilterState> {
  shouldComponentUpdate(nextProps: FilterProps, nextState: FilterState) {
    return (
      JSON.stringify(this.props) !== JSON.stringify(nextProps) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    );
  }

  state = {
    keyword: "",
    author: "",
    difficulty: { start: 0, end: 0 },
    category: {} as {
      [category: string]: boolean;
    },
    sort: {
      dataPoint: "ind",
      direction: "desc",
    } as {
      dataPoint: "ind" | "difficulty" | "votes";
      direction: SortDirection;
    },
  };

  constructor(props: FilterProps) {
    super(props);

    this.filterUsed = this.filterUsed.bind(this);
    this.filter = this.filter.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSortClick = this.onSortClick.bind(this);

    this.state = { ...this.state, difficulty: this.props.difficultyRange };
  }

  filterUsed(
    type: "keyword" | "author" | "category" | "tag" | "difficulty"
  ): boolean {
    switch (type) {
      case "keyword":
        return this.state.keyword !== "";
      case "author":
        return this.state.author !== "";
      case "category":
        return !Object.values(this.state.category).reduce(
          (a, b) => a && !b,
          true
        ); // just cant all be false/undefined
      case "tag":
        return !Object.values(this.props.clickedTags).reduce(
          (a, b) => a && !b,
          true
        );
      case "difficulty":
        return (
          this.state.difficulty.start !== this.props.difficultyRange.start ||
          this.state.difficulty.end !== this.props.difficultyRange.end
        );
    }
  }

  filter() {
    const { keyword, author, category, difficulty } = this.state;
    const { clickedTags, setFilter } = this.props;
    const { filterUsed } = this;

    setFilter((problem: Problem) => {
      if (filterUsed("keyword")) {
        if (
          !problem.text
            .toLocaleLowerCase()
            .includes(keyword.toLocaleLowerCase()) &&
          !problem.title
            .toLocaleLowerCase()
            .includes(keyword.toLocaleLowerCase())
        ) {
          return false;
        }
      }
      if (filterUsed("author")) {
        if (
          !problem.author
            .toLocaleLowerCase()
            .startsWith(author.toLocaleLowerCase())
        )
          return false;
      }
      if (filterUsed("category")) {
        if (!category[problem.category]) return false;
      }
      if (filterUsed("tag")) {
        let works = false;
        for (let i = 0; i < problem.tags.length; i++) {
          if (clickedTags[problem.tags[i]]) {
            works = true;
            break;
          }
        }
        if (!works) return false;
      }
      if (filterUsed("difficulty")) {
        console.log(difficulty.start, problem.difficulty, difficulty.end);
        if (
          difficulty.start > problem.difficulty ||
          problem.difficulty > difficulty.end
        )
          return false;
      }
      return true;
    });
  }

  sort() {
    const { dataPoint, direction } = this.state.sort;
    const { setSortWeight } = this.props;
    const sign = direction === "asc" ? 1 : -1;

    setSortWeight((problem: Problem) => {
      let magnitude = 0;
      switch (dataPoint) {
        case "ind":
          magnitude = problem.ind;
          break;
        case "difficulty":
          magnitude = problem.difficulty;
          break;
        case "votes":
          magnitude =
            Object.values(problem.votes).length === 0
              ? 0
              : (Object.values(problem.votes) as number[]).reduce(
                  (a, b) => a + b
                );
          break;
      }
      return { p: sign * magnitude, s: sign * problem.ind };
    });
  }

  onChange(
    name: string,
    value: any,
    type: "keyword" | "author" | "category" | "tag" | "difficulty"
  ) {
    switch (type) {
      case "keyword":
        this.setState({ keyword: value as string });
        break;
      case "author":
        this.setState({ author: value as string });
        break;
      case "category":
        console.log(this.state.category[name]);
        this.setState({
          category: {
            ...this.state.category,
            [name]: !this.state.category[name],
          },
        });
        break;
      case "tag":
        break;
      case "difficulty":
        const difficultyArray = value as number[];
        this.setState({
          difficulty: {
            start: difficultyArray[0],
            end: difficultyArray[1],
          },
        });
        break;
    }
  }

  onSortClick(
    event: React.MouseEvent<HTMLButtonElement>,
    dataPoint: "ind" | "difficulty" | "votes"
  ) {
    let sort = { dataPoint: dataPoint, direction: "asc" as SortDirection };
    if (dataPoint === this.state.sort.dataPoint) {
      sort = {
        dataPoint,
        direction: this.state.sort.direction === "asc" ? "desc" : "asc",
      };
    }
    this.setState({ sort });
  }

  componentDidMount() {
    this.sort(); // nothing should be filtered out at the beginning, but the problems will not be sorted
  }

  componentDidUpdate() {
    this.filter();
    this.sort();
  }

  render() {
    const { filterUsed, onChange, onSortClick } = this;
    const { keyword, author, category, difficulty, sort } = this.state;
    const {
      difficultyRange,
      categoryColors,
      allTags,
      clickedTags,
      onClickTag,
      lists,
      currentList,
      setCurrentList,
      classes,
      width,
      theme,
    } = this.props;

    const filterUsedDot = (
      <Dot style={{ top: "0.5rem", marginLeft: "0.35rem" }} />
    );

    return (
      <div className={classes.root} style={{ width: `${width}rem` }}>
        <Scrollbar>
          <div className={classes.wrapper}>
            <Paper elevation={3} className={classes.paper}>
              <div className={classes.title}>
                List
                <FiList
                  style={{
                    position: "relative",
                    top: "0.25rem",
                    marginLeft: "0.4rem",
                  }}
                />
                <Divider className={classes.divider} />
              </div>
              <ListSelect
                currentList={currentList}
                listNames={lists.map((list) => list.name)}
                setCurrentList={setCurrentList}
              />
            </Paper>
            <Paper elevation={3} className={classes.paper}>
              <div className={classes.title}>
                Filter
                <FiFilter
                  style={{
                    position: "relative",
                    top: "0.3rem",
                    marginLeft: "0.4rem",
                  }}
                />
                <Divider className={classes.divider} />
              </div>
              <KeywordAccordion
                keyword={keyword}
                filterUsedDot={filterUsedDot}
                filterUsed={filterUsed}
                onChange={onChange}
                classes={classes}
              />
              <AuthorAccordion
                author={author}
                filterUsedDot={filterUsedDot}
                filterUsed={filterUsed}
                onChange={onChange}
                classes={classes}
              />
              <CategoryAccordion
                categorySelected={category}
                categoryColors={categoryColors}
                filterUsedDot={filterUsedDot}
                filterUsed={filterUsed}
                onChange={onChange}
                classes={classes}
              />
              <TagAccordion
                allTags={allTags}
                clickedTags={clickedTags}
                onClickTag={onClickTag}
                filterUsedDot={filterUsedDot}
                filterUsed={filterUsed}
                onChange={onChange}
                classes={classes}
              />
              <DifficultyAccordion
                difficulty={difficulty}
                difficultyRange={difficultyRange}
                filterUsedDot={filterUsedDot}
                filterUsed={filterUsed}
                onChange={onChange}
                classes={classes}
                theme={theme}
              />
            </Paper>
            <Paper elevation={3} className={classes.paper}>
              <div className={classes.title}>
                Sort
                <HiOutlineSortDescending
                  style={{
                    position: "relative",
                    top: "0.15rem",
                    marginLeft: "0.4rem",
                  }}
                />
                <Divider className={classes.divider} />
              </div>
              <div className={classes.sort}>
                Index
                <TableSortLabel
                  active={sort.dataPoint === "ind"}
                  direction={sort.direction}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    onSortClick(e, "ind")
                  }
                  IconComponent={FiArrowDown}
                />
              </div>
              <div className={classes.sort}>
                Difficulty
                <TableSortLabel
                  active={sort.dataPoint === "difficulty"}
                  direction={sort.direction}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    onSortClick(e, "difficulty")
                  }
                  IconComponent={FiArrowDown}
                />
              </div>
              <div className={classes.sort}>
                Votes
                <TableSortLabel
                  active={sort.dataPoint === "votes"}
                  direction={sort.direction}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    onSortClick(e, "votes")
                  }
                  IconComponent={FiArrowDown}
                />
              </div>
            </Paper>
          </div>
        </Scrollbar>
      </div>
    );
  }
}

export default compose<FilterProps, SidebarProps & FilterPropsBase>(
  withStyles(styles),
  withTheme
)(Filter);
