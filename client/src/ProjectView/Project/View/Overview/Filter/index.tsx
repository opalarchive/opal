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
  keyword: string;
  author: string;
  difficulty: {
    start: number;
    end: number;
  };
  difficultyRange: {
    start: number;
    end: number;
  };
  category: {
    [category: string]: boolean;
  };
  categoryColors: CategoryColors;
  editors: string[];
  allTags: Set<string>;
  clickedTags: {
    [tag: string]: boolean;
  };
  resetFilter: () => void;
  filterUsed: (
    type: "keyword" | "author" | "category" | "tag" | "difficulty"
  ) => boolean;
  onChange: (
    name: string,
    value: any,
    type: "keyword" | "author" | "category" | "tag" | "difficulty"
  ) => void;
  onClickTag: (tagText: string, callBack?: () => void) => void;
}

type Props = SidebarProps & FilterProps & WithStyles<typeof styles> & WithTheme;

class Filter extends React.Component<Props> {
  render() {
    const {
      keyword,
      author,
      category: categorySelected,
      difficulty,
      difficultyRange,
      categoryColors,
      allTags,
      clickedTags,
      resetFilter,
      filterUsed,
      onChange,
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

                      onChange(e.target.name, e.target.value, "keyword");
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

                      onChange(e.target.name, e.target.value, "author");
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
                  Category {filterUsed("category") && filterUsedDot}
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
                        value={!!categorySelected[category]}
                        onChange={(
                          e: React.ChangeEvent<{}>,
                          checked: boolean
                        ) => {
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
                  expandIcon={<ChevronDown />}
                  aria-controls="tag-filter-content"
                  id="tag-filter-header"
                >
                  Tag
                  {filterUsed("tag") && filterUsedDot}
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  <div className={classes.tagContainer}>
                    {[...allTags].map((tag) => (
                      <Tag
                        key={tag}
                        text={tag}
                        clicked={!!clickedTags[tag]}
                        onClickTag={(tagText: string) =>
                          onClickTag(tagText, resetFilter)
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
