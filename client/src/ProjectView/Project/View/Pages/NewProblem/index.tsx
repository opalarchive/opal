import {
  withStyles,
  WithStyles,
  TextField,
  Slider,
  Button,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import React from "react";
import { ViewSectionProps } from "../..";

import {
  DifficultyRange,
  problemTextMaxLength,
  problemTitleMaxLength,
  Votes,
} from "../../../../../../../.shared";
import {
  newProblem,
  problemProps,
  problemFunctions,
} from "../../../../../Constants/types";
import problemContainerStyles from "../../Embedded/Problem/index.css";
import detailsStyles from "../../Pages/Details/index.css";
import { FiChevronLeft, FiPlus } from "react-icons/fi";
import { compose } from "recompose";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import * as ROUTES from "../../../../../Constants/routes";
import { getDifficultyColor } from "../../../../../Constants/index";
import Dot from "../../Embedded/Dot";

interface NewProblemProps extends ViewSectionProps {
  difficultyRange: DifficultyRange;
  problemProps: problemProps;
  problemFunctions: problemFunctions;
  newProblem: newProblem;
}

interface NewProblemState {
  title: string;
  text: string;
  category: string;
  difficulty: number;
  titleError: string;
  textError: string;
  categoryError: string;
}

class NewProblem extends React.Component<
  NewProblemProps &
    WithStyles<typeof problemContainerStyles> &
    RouteComponentProps<any>,
  NewProblemState
> {
  state = {
    title: "",
    text: "",
    category: "",
    difficulty: 0,
    titleError: "",
    textError: "",
    categoryError: "",
  };

  constructor(
    props: NewProblemProps &
      WithStyles<typeof problemContainerStyles> &
      RouteComponentProps
  ) {
    super(props);

    this.state = {
      ...this.state,
      category: Object.keys(props.categoryColors)[0],
      difficulty: props.difficultyRange.start,
    };

    this.newProblem = this.newProblem.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  newProblem() {
    const uid = this.props.authUser.uid;
    const { uuid, project } = this.props;
    var { title, text, category, difficulty } = this.state;

    let titleError = "",
      textError = "",
      categoryError = "";

    if (title.length === 0) {
      titleError = "The title cannot be empty";
    }
    if (text.length === 0) {
      textError = "The problem text cannot be empty";
    }
    if (category.length === 0) {
      categoryError = "The category cannot be empty";
    }

    if (!!titleError || !!textError || !!categoryError) {
      this.setState({ titleError, textError, categoryError });
    } else {
      this.props.newProblem({
        author: uid,
        title,
        text,
        category,
        difficulty,
        replies: [],
        votes: {} as Votes,
        tags: [],
      });
      this.props.history.push(
        ROUTES.PROJECT_PROBLEM.replace(":uuid", uuid).replace(
          ":ind",
          `${project.problems.length - 1}`
        )
      );
    }
  }

  onChange(field: string, value: string | number) {
    switch (field) {
      case "title":
        if (typeof value != "string") {
          break;
        }

        this.setState({ title: value.substring(0, problemTitleMaxLength) });

        break;
      case "text":
        if (typeof value != "string") {
          break;
        }

        this.setState({ text: value.substring(0, problemTextMaxLength) });

        break;
      case "category":
        if (typeof value != "string") {
          break;
        }

        this.setState({ category: value });

        break;
      case "difficulty":
        if (typeof value != "number") {
          break;
        }

        this.setState({ difficulty: value });

        break;
      default:
        break;
    }
  }

  render() {
    const {
      // bodyHeight,
      project,
      categoryColors,
      difficultyColors,
      // editors,
      // problemProps,
      // uuid,
      // tryProblemAction,
      authUser,
      classes,
    } = this.props;
    const { titleError, textError, categoryError } = this.state;

    return (
      <>
        <div>
          <Paper elevation={3} className={classes.root}>
            <div className={classes.left}>
              <div className={classes.leftIndex}>
                #{project.problems.length + 1}
              </div>
            </div>
            <div className={classes.body}>
              <div className={classes.bodyTitle}>
                <TextField
                  fullWidth
                  value={this.state.title}
                  id="title"
                  label="Title"
                  error={!!titleError}
                  helperText={titleError}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    this.onChange("title", e.target.value)
                  }
                />
              </div>
              <div className={classes.bodyAuthor}>
                Proposed by {!!authUser.displayName && authUser.displayName}
              </div>
              <div className={classes.bodyText}>
                <TextField
                  fullWidth
                  variant="filled"
                  value={this.state.text}
                  id="text"
                  multiline
                  label="Text"
                  error={!!textError}
                  helperText={textError}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    this.onChange("text", e.target.value)
                  }
                />
              </div>
              <div className={classes.bodyFiller} />
            </div>
            <div className={classes.right}>
              {/* extra padding */}
              <div
                className={`${classes.rightCategory} ${classes.rightDifficulty}`}
              >
                <Dot
                  color={categoryColors[this.state.category]}
                  style={{ top: "0.48rem", margin: "0 0.7rem 0 0.2rem" }}
                />
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    id="category"
                    label="Category"
                    fullWidth
                    value={this.state.category}
                    error={!!categoryError}
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                      this.onChange("category", e.target.value as string)
                    }
                  >
                    {Object.keys(categoryColors).map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className={classes.rightDifficulty}>
                <Dot
                  color={getDifficultyColor(
                    difficultyColors,
                    this.state.difficulty
                  )}
                  style={{ top: "0.48rem", margin: "0 0.7rem 0 0.2rem" }}
                />
                <FormControl fullWidth>
                  {/* copy mui styles here to make category and difficulty selectors consistent */}
                  <InputLabel className="MuiInputLabel-shrink">
                    Difficulty
                  </InputLabel>
                  <Slider
                    className="MuiInput-fullWidth MuiInputBase-formControl MuiInput-formControl"
                    value={this.state.difficulty}
                    onChange={(
                      e: React.ChangeEvent<{}>,
                      value: number | number[]
                    ) => {
                      e.preventDefault();
                      e.stopPropagation();

                      if (typeof value !== "number") {
                        value = value[0];
                      }

                      this.onChange("difficulty", value);
                    }}
                    valueLabelDisplay="auto"
                    aria-labelledby="difficulty-header"
                    getAriaValueText={() => `d-${this.state.difficulty}`}
                  />
                </FormControl>
              </div>
              <div className={classes.rightFiller} />
            </div>
          </Paper>
        </div>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => this.newProblem()}
        >
          <FiPlus />
          &nbsp;Add Problem
        </Button>
      </>
    );
  }
}

const StyledNewProblem = compose<
  NewProblemProps &
    WithStyles<typeof problemContainerStyles> &
    RouteComponentProps<any>,
  NewProblemProps
>(
  withStyles(problemContainerStyles),
  withRouter
)(NewProblem);

const NewProblemWrapper: React.FC<
  NewProblemProps & WithStyles<typeof detailsStyles>
> = ({ classes, ...rest }) => {
  return (
    <div className={classes.root}>
      <div className={classes.top}>
        <Link
          className={classes.topLink}
          to={ROUTES.PROJECT_VIEW.replace(":uuid", rest.uuid)}
        >
          <FiChevronLeft className={classes.topIcon} />
          Back
        </Link>
        <div className={classes.topFiller} />
      </div>
      <StyledNewProblem {...rest} />
    </div>
  );
};

export default withStyles(detailsStyles)(NewProblemWrapper);
