import {
  withStyles,
  WithStyles,
  TextField,
  Button,
  Paper,
} from "@material-ui/core";
import React from "react";
import { ViewSectionProps } from "../..";

import { listNameMaxLength } from "../../../../../../../.shared/src";
import { newList } from "../../../../../Constants/types";
import detailsStyles from "../../Pages/Details/index.css";
import { FiChevronLeft, FiPlus } from "react-icons/fi";
import { compose } from "recompose";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import * as ROUTES from "../../../../../Constants/routes";
import styles from "./index.css";

interface NewListProps extends ViewSectionProps {
  newList: newList;
}

interface NewListState {
  name: string;
  nameError: string;
}

class NewList extends React.Component<
  NewListProps & WithStyles<typeof styles> & RouteComponentProps<any>,
  NewListState
> {
  state = {
    name: "",
    nameError: "",
  };

  constructor(
    props: NewListProps & WithStyles<typeof styles> & RouteComponentProps<any>
  ) {
    super(props);

    this.newList = this.newList.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  newList() {
    const { uuid, project } = this.props;
    var { name } = this.state;

    let nameError = "";

    if (name.length === 0) {
      nameError = "The name cannot be empty";
    }

    if (!!nameError) {
      this.setState({ nameError });
    } else {
      this.props.newList({
        name,
        problems: [],
      });
      this.props.history.push(
        ROUTES.PROJECT_LIST.replace(":uuid", uuid).replace(
          ":list",
          `${project.lists.length - 1}`
        )
      );
    }
  }

  onChange(field: string, value: string | number) {
    switch (field) {
      case "name":
        if (typeof value != "string") {
          break;
        }

        this.setState({ name: value.substring(0, listNameMaxLength) });

        break;
      default:
        break;
    }
  }

  render() {
    const {
      // bodyHeight,
      // project,
      // categoryColors,
      // difficultyColors,
      // problemProps,
      // uuid,
      // tryProblemAction,
      // authUser,
      classes,
    } = this.props;
    const { name, nameError } = this.state;

    return (
      <>
        <Paper elevation={3} className={classes.root}>
          <div className={classes.body}>
            <TextField
              fullWidth
              value={name}
              id="name"
              label="Name"
              error={!!nameError}
              helperText={nameError}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                this.onChange("name", e.target.value)
              }
            />
          </div>
        </Paper>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => this.newList()}
        >
          <FiPlus />
          &nbsp;Add Problem
        </Button>
      </>
    );
  }
}

const StyledNewProblem = compose<
  NewListProps & WithStyles<typeof styles> & RouteComponentProps<any>,
  NewListProps
>(
  withStyles(styles),
  withRouter
)(NewList);

const NewProblemWrapper: React.FC<
  NewListProps & WithStyles<typeof detailsStyles>
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
