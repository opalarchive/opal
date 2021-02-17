/*  */
import React from "react";
import styles from "./index.css";
import { CategoryColors } from "../../..";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  Slider,
  TextField,
  Theme,
  WithStyles,
} from "@material-ui/core";
import { FiCheckCircle, FiChevronDown, FiCircle } from "react-icons/fi";
import {
  camelToTitle,
  spacingRem,
  tupleToRGBString,
} from "../../../../../../Constants";
import Dot from "../../../Embedded/Dot";
import TagGroup from "../../../Embedded/TagGroup";

interface AccordionProps extends WithStyles<typeof styles> {
  filterUsedDot: JSX.Element;
  filterUsed: (
    type: "keyword" | "author" | "category" | "tag" | "difficulty"
  ) => boolean;
  onChange: (
    name: string,
    value: any,
    type: "keyword" | "author" | "category" | "tag" | "difficulty"
  ) => void;
}

export class KeywordAccordion extends React.PureComponent<
  AccordionProps & { keyword: string }
> {
  render() {
    const {
      keyword,
      filterUsedDot,
      filterUsed,
      onChange,
      classes,
    } = this.props;
    return (
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
    );
  }
}

export class AuthorAccordion extends React.PureComponent<
  AccordionProps & { author: string }
> {
  render() {
    const { author, filterUsedDot, filterUsed, onChange, classes } = this.props;
    return (
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
    );
  }
}

export class CategoryAccordion extends React.PureComponent<
  AccordionProps & {
    categorySelected: { [category: string]: boolean };
    categoryColors: CategoryColors;
  }
> {
  render() {
    const {
      categorySelected,
      categoryColors,
      filterUsedDot,
      filterUsed,
      onChange,
      classes,
    } = this.props;
    return (
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
                onChange={(e: React.ChangeEvent<{}>, checked: boolean) => {
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
    );
  }
}

export class TagAccordion extends React.PureComponent<
  AccordionProps & {
    allTags: Set<string>;
    clickedTags: {
      [tag: string]: boolean;
    };
    onClickTag: (tagText: string) => void;
  }
> {
  render() {
    const {
      allTags,
      clickedTags,
      onClickTag,
      filterUsedDot,
      filterUsed,
      classes,
    } = this.props;
    return (
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
    );
  }
}

export class DifficultyAccordion extends React.PureComponent<
  AccordionProps & {
    difficulty: {
      start: number;
      end: number;
    };
    difficultyRange: {
      start: number;
      end: number;
    };
    theme: Theme;
  }
> {
  render() {
    const {
      difficulty,
      difficultyRange,
      filterUsedDot,
      filterUsed,
      onChange,
      classes,
      theme,
    } = this.props;
    return (
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
          className={`${classes.accordionDetails} ${classes.slider}`}
        >
          <Slider
            value={[difficulty.start, difficulty.end]}
            onChange={(e: React.ChangeEvent<{}>, value: number | number[]) => {
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
    );
  }
}
