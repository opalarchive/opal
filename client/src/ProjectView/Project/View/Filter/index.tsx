import React from "react";

import { makeStyles, Paper, withStyles, WithStyles } from "@material-ui/core";
import generateStyles from "./index.css";

const blankStyles = generateStyles(0);

interface FilterProps {
  width: number;
  authUser: firebase.User;
}

const FilterBase: React.FC<FilterProps & WithStyles<typeof blankStyles>> = ({
  classes,
  width,
  authUser,
}) => {
  return (
    <Paper square elevation={2} className={classes.root}>
      add stuff
    </Paper>
  );
};

const Filter: React.FC<FilterProps> = (props) => {
  const StyledFilter = withStyles(generateStyles(props.width))(FilterBase);
  return <StyledFilter {...props} />;
};

export default Filter;
