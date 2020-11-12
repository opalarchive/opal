import React from 'react';
import { Typography, Tooltip, IconButton, Toolbar } from '@material-ui/core';
import { Filter, Trash2 } from 'react-feather';
import { toolbarStyles } from './constants';

export default function ProjectToolbar(props) {
  const { selected } = props;
  const numSelected = selected.length;
  const styles = toolbarStyles();

  return (
    <Toolbar className={`${styles.root} ${numSelected > 0 ? styles.highlight : ""}`}>
      {numSelected > 0 ? (
        <Typography className={styles.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
          <Typography className={styles.title} variant="h6" id="tableTitle" component="div">
            {props.name}
          </Typography>
        )}

      {numSelected > 0 ? (
        <>
          <Tooltip title="Delete">
            <IconButton aria-label="delete">
              <Trash2 />
            </IconButton>
          </Tooltip>
        </>
      ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="filter list">
              <Filter />
            </IconButton>
          </Tooltip>
        )}
    </Toolbar>
  );
}
