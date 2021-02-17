import React from "react";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Slider,
  TableSortLabel,
  TextField,
  withStyles,
  WithStyles,
  withTheme,
  WithTheme,
} from "@material-ui/core";
import styles from "./index.css";
import { compose } from "recompose";
import { SidebarProps } from "../../../../../Template/SidebaredBase";
import { List, Problem } from "../../../../../../../../.shared";
import {
  FiCheckCircle,
  FiChevronDown,
  FiArrowDown,
  FiCircle,
  FiFilter,
  FiList,
} from "react-icons/fi";
import { HiOutlineSortDescending } from "react-icons/hi";
import Dot from "../../../Embedded/Dot";
import { CategoryColors } from "../../..";
import {
  camelToTitle,
  spacingRem,
  tupleToRGBString,
} from "../../../../../../Constants";
import Scrollbar from "react-scrollbars-custom";
import Tag from "../../../Embedded/Tag";
import { SortDirection } from "../../../../../../Constants/types";
import TagGroup from "../../../Embedded/TagGroup";

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
  listMenuAnchorEl: EventTarget | null;
}

class Filter extends React.Component<FilterProps, FilterState> {
  shouldComponentUpdate(nextProps: FilterProps, nextState: FilterState) {
    const { listMenuAnchorEl: prevAnchor, ...prev } = this.state;
    const { listMenuAnchorEl: nextAnchor, ...next } = nextState;
    return (
      JSON.stringify(this.props) !== JSON.stringify(nextProps) ||
      JSON.stringify(prev) !== JSON.stringify(next) ||
      !!prevAnchor !== !!nextAnchor
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
    listMenuAnchorEl: null,
  };

  constructor(props: FilterProps) {
    super(props);

    this.filterUsed = this.filterUsed.bind(this);
    this.filter = this.filter.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSortClick = this.onSortClick.bind(this);
    this.openListMenu = this.openListMenu.bind(this);
    this.closeListMenu = this.closeListMenu.bind(this);

    this.state = { ...this.state, difficulty: this.props.difficultyRange };
  }

  openListMenu(event: React.MouseEvent<HTMLButtonElement>) {
    this.setState({ listMenuAnchorEl: event.currentTarget });
  }

  closeListMenu() {
    this.setState({ listMenuAnchorEl: null });
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
        if (!problem.author.startsWith(author)) return false;
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
    const { filter: resetFilter, filterUsed, onChange, onSortClick } = this;
    const {
      keyword,
      author,
      category: categorySelected,
      difficulty,
      sort,
      listMenuAnchorEl,
    } = this.state;
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
              {/* we just need to match the mui styles */}
              <div className="MuiAccordionSummary-root">
                <div style={{ margin: "12px 0" }}>
                  <span className={classes.valueDescriptor}>Current:</span>
                  {currentList < 0 ? "All Problems" : lists[currentList].name}
                </div>
                <IconButton
                  color="inherit"
                  onClick={this.openListMenu}
                  aria-controls="list-select-menu"
                  aria-haspopup="true"
                  edge="end"
                >
                  <FiChevronDown />
                </IconButton>
              </div>
              <Menu
                id="list-select-menu"
                anchorEl={listMenuAnchorEl}
                keepMounted
                open={!!listMenuAnchorEl}
                onClose={this.closeListMenu}
                elevation={3}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                {lists.map((list, ind) => (
                  <MenuItem
                    key={`list-${ind}`}
                    onClick={(_) => {
                      setCurrentList(ind);
                      this.setState({ listMenuAnchorEl: null });
                    }}
                    className={
                      currentList === ind ? classes.currentList : undefined
                    }
                  >
                    {list.name}
                  </MenuItem>
                ))}
                <MenuItem
                  onClick={(_) => {
                    setCurrentList(-1);
                    this.setState({ listMenuAnchorEl: null });
                  }}
                  className={
                    currentList === -1 ? classes.currentList : undefined
                  }
                >
                  All Problems
                </MenuItem>
              </Menu>
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
              <Accordion elevation={0} className={classes.accordion}>
                <AccordionSummary
                  expandIcon={<FiChevronDown />}
                  aria-controls="keyword-filter-content"
                  id="keyword-filter-header"
                >
                  Keyword
                  {filterUsed("keyword") && filterUsedDot}
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  <TextField
                    name="keyword"
                    id="keyword-filter"
                    label="Keyword"
                    value={keyword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      e.preventDefault();
                      e.stopPropagation();

                      onChange(e.target.name, e.target.value, "keyword");
                    }}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion elevation={0} className={classes.accordion}>
                <AccordionSummary
                  expandIcon={<FiChevronDown />}
                  aria-controls="author-filter-content"
                  id="author-filter-header"
                >
                  Author
                  {filterUsed("author") && filterUsedDot}
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  <TextField
                    name="author"
                    id="author-filter"
                    label="Author"
                    value={author}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      e.preventDefault();
                      e.stopPropagation();

                      onChange(e.target.name, e.target.value, "author");
                    }}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion elevation={0} className={classes.accordion}>
                <AccordionSummary
                  expandIcon={<FiChevronDown />}
                  aria-controls="category-filter-content"
                  id="category-filter-header"
                >
                  Category {filterUsed("category") && filterUsedDot}
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  {Object.entries(categoryColors).map(([category, color]) => {
                    return (
                      <FormControlLabel
                        key={`category-filter-${category}`}
                        control={
                          <Checkbox
                            icon={<FiCircle />}
                            checkedIcon={<FiCheckCircle />}
                            name={category}
                          />
                        }
                        value={!!categorySelected[category]}
                        onChange={(
                          e: React.ChangeEvent<{}>,
                          checked: boolean
                        ) => {
                          e.stopPropagation();

                          onChange(category, checked, "category");
                        }}
                        label={
                          <>
                            {camelToTitle(category)}
                            <Dot
                              color={tupleToRGBString(color)}
                              style={{ marginLeft: "0.55rem" }}
                            />
                          </>
                        }
                      />
                    );
                  })}
                </AccordionDetails>
              </Accordion>
              <Accordion elevation={0} className={classes.accordion}>
                <AccordionSummary
                  expandIcon={<FiChevronDown />}
                  aria-controls="tag-filter-content"
                  id="tag-filter-header"
                >
                  Tag
                  {filterUsed("tag") && filterUsedDot}
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  <div>
                    {!!allTags && (
                      <TagGroup
                        text={[...allTags]} // convert from set to array
                        clickedTags={clickedTags}
                        onClickTag={onClickTag}
                        filterTag
                      />
                    )}
                  </div>
                </AccordionDetails>
              </Accordion>
              <Accordion elevation={0} className={classes.accordion}>
                <AccordionSummary
                  expandIcon={<FiChevronDown />}
                  aria-controls="difficulty-filter-content"
                  id="difficulty-filter-header"
                >
                  Difficulty
                  {filterUsed("difficulty") && filterUsedDot}
                </AccordionSummary>
                <AccordionDetails
                  className={classes.accordionDetails}
                  style={{
                    paddingLeft: spacingRem(theme, 3),
                    paddingRight: spacingRem(theme, 3),
                  }}
                >
                  <Slider
                    value={[difficulty.start, difficulty.end]}
                    onChange={(
                      e: React.ChangeEvent<{}>,
                      value: number | number[]
                    ) => {
                      e.preventDefault();
                      e.stopPropagation();

                      onChange("difficulty", value, "difficulty");
                    }}
                    min={difficultyRange.start}
                    max={difficultyRange.end}
                    valueLabelDisplay="auto"
                    aria-labelledby="difficulty-filter-header"
                    getAriaValueText={() =>
                      `lower bound d-${difficulty.start}, upper bound d-${difficulty.end}`
                    }
                  />
                </AccordionDetails>
              </Accordion>
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
