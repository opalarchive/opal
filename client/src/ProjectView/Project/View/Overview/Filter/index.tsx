import React from "react";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Divider,
  FormControlLabel,
  Paper,
  Slider,
  TextField,
  withStyles,
  WithStyles,
  withTheme,
  WithTheme,
} from "@material-ui/core";
import styles from "./index.css";
import { compose } from "recompose";
import { SidebarProps } from "../../../../MenuBase";
import { Problem } from "../../../../../../../.shared";
import {
  CheckCircle,
  ChevronDown,
  Circle,
  Filter as FilterIcon,
} from "react-feather";
import Dot from "../../Ornamentation/Dot";
import { CategoryColors } from "../..";
import {
  camelToTitle,
  spacingRem,
  tupleToRGBString,
} from "../../../../../Constants";
import Scrollbar from "react-scrollbars-custom";
import Tag from "../../Ornamentation/Tag";

interface FilterProps {
  setFilter: (filter: (problem: Problem) => boolean) => void;
  setSortWeight: (sortWeight: (problem: Problem) => number) => void;
  categoryColors: CategoryColors;
  difficultyRange: { start: number; end: number };
  editors: string[];
  allTags: Set<string>;
  clickedTags: {
    [tag: string]: boolean;
  };
  onClickTag: (tagText: string, callBack?: () => void) => void;
}

interface FilterState {
  keyword: string;
  author: string;
  difficultyRange: { start: number; end: number };
  category: {
    [category: string]: boolean;
  };
}

type Props = SidebarProps & FilterProps & WithStyles<typeof styles> & WithTheme;

class Filter extends React.Component<Props, FilterState> {
  state = {
    keyword: "",
    author: "",
    difficultyRange: { start: 0, end: 0 },
    category: {} as {
      [category: string]: boolean;
    },
  };

  constructor(props: Props) {
    super(props);

    this.resetFilter = this.resetFilter.bind(this);
    this.onChange = this.onChange.bind(this);
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
          this.state.difficultyRange.start !==
            this.props.difficultyRange.start ||
          this.state.difficultyRange.end !== this.props.difficultyRange.end
        );
    }
  }

  resetFilter() {
    const { keyword, author, difficultyRange } = this.state;

    this.props.setFilter((problem: Problem) => {
      if (this.filterUsed("keyword")) {
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
      if (this.filterUsed("author")) {
        if (!problem.author.startsWith(author)) return false;
      }
      if (this.filterUsed("category")) {
        if (!this.state.category[problem.category]) return false;
      }
      if (this.filterUsed("tag")) {
        console.log(problem.tags);
        let works = false;
        for (let i = 0; i < problem.tags.length; i++) {
          if (this.props.clickedTags[problem.tags[i]]) {
            works = true;
            break;
          }
        }
        if (!works) return false;
      }
      if (this.filterUsed("difficulty")) {
        if (
          difficultyRange.start >= problem.difficulty ||
          problem.difficulty >= difficultyRange.end
        )
          return false;
      }
      return true;
    });
  }

  onChange(
    name: string,
    value: any,
    type: "keyword" | "author" | "category" | "tag" | "difficulty"
  ) {
    switch (type) {
      case "keyword":
        this.setState({ keyword: value as string }, () => this.resetFilter());
        break;
      case "author":
        this.setState({ author: value as string }, () => this.resetFilter());
        break;
      case "category":
        this.setState(
          {
            category: {
              ...this.state.category,
              [name]: !this.state.category[name],
            },
          },
          () => this.resetFilter()
        );
        break;
      case "tag":
        break;
      case "difficulty":
        const difficultyArray = value as number[];
        this.setState(
          {
            difficultyRange: {
              start: difficultyArray[0],
              end: difficultyArray[1],
            },
          },
          () => this.resetFilter()
        );
        break;
    }
  }

  componentDidMount() {
    this.setState({ difficultyRange: this.props.difficultyRange });
  }

  render() {
    const {
      categoryColors,
      difficultyRange,
      editors,
      allTags,
      clickedTags,
      onClickTag,
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
                Filter
                <FilterIcon
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
                  expandIcon={<ChevronDown />}
                  aria-controls="keyword-filter-content"
                  id="keyword-filter-header"
                >
                  Keyword
                  {this.filterUsed("keyword") && filterUsedDot}
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  <TextField
                    name="keyword"
                    id="keyword-filter"
                    label="Keyword"
                    value={this.state.keyword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      e.preventDefault();

                      this.onChange(e.target.name, e.target.value, "keyword");
                    }}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion elevation={0} className={classes.accordion}>
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  aria-controls="author-filter-content"
                  id="author-filter-header"
                >
                  Author
                  {this.filterUsed("author") && filterUsedDot}
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  <TextField
                    name="author"
                    id="author-filter"
                    label="Author"
                    value={this.state.author}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      e.preventDefault();

                      this.onChange(e.target.name, e.target.value, "author");
                    }}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion elevation={0} className={classes.accordion}>
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  aria-controls="category-filter-content"
                  id="category-filter-header"
                >
                  Category {this.filterUsed("category") && filterUsedDot}
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  {Object.entries(categoryColors).map(([category, color]) => {
                    return (
                      <FormControlLabel
                        key={`category-filter-${category}`}
                        control={
                          <Checkbox
                            icon={<Circle />}
                            checkedIcon={<CheckCircle />}
                            name={category}
                          />
                        }
                        value={!!this.state.category[category]}
                        onChange={(
                          e: React.ChangeEvent<{}>,
                          checked: boolean
                        ) => {
                          this.onChange(category, checked, "category");
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
                  expandIcon={<ChevronDown />}
                  aria-controls="tag-filter-content"
                  id="tag-filter-header"
                >
                  Tag
                  {this.filterUsed("tag") && filterUsedDot}
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  <div>
                    {[...allTags].map((tag) => (
                      <Tag
                        key={tag}
                        text={tag}
                        clicked={!!clickedTags[tag]}
                        onClickTag={(tagText: string) =>
                          onClickTag(tagText, this.resetFilter)
                        }
                      />
                    ))}
                  </div>
                </AccordionDetails>
              </Accordion>
              <Accordion elevation={0} className={classes.accordion}>
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  aria-controls="difficulty-filter-content"
                  id="difficulty-filter-header"
                >
                  Difficulty
                  {this.filterUsed("difficulty") && filterUsedDot}
                </AccordionSummary>
                <AccordionDetails
                  className={classes.accordionDetails}
                  style={{
                    paddingLeft: spacingRem(theme, 3),
                    paddingRight: spacingRem(theme, 3),
                  }}
                >
                  <Slider
                    value={[
                      this.state.difficultyRange.start,
                      this.state.difficultyRange.end,
                    ]}
                    onChange={(
                      e: React.ChangeEvent<{}>,
                      value: number | number[]
                    ) => {
                      this.onChange("difficulty", value, "difficulty");
                    }}
                    min={this.props.difficultyRange.start}
                    max={this.props.difficultyRange.end}
                    valueLabelDisplay="auto"
                    aria-labelledby="difficulty-filter-header"
                    getAriaValueText={() =>
                      `lower bound d-${this.state.difficultyRange.start}, upper bound d-${this.state.difficultyRange.end}`
                    }
                  />
                </AccordionDetails>
              </Accordion>
            </Paper>
          </div>
        </Scrollbar>
      </div>
    );
  }
}

export default compose<Props, SidebarProps & FilterProps>(
  withStyles(styles),
  withTheme
)(Filter);
