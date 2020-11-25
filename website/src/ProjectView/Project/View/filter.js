import React from 'react';

import { makeStyles, Paper } from '@material-ui/core';

const useStyles = width => makeStyles((theme) => ({
  root: {
    display: "inline-block",
    position: "absolute",
    right: 0,
    width: `${width}rem`,
    height: '100%',
  }
}));

const Filter = (props) => {
  const styles = useStyles(props.width)();

  return (
    <Paper square elevation={2} className={styles.root}>
      add stuff
    </Paper>
  );
}


export default Filter;
