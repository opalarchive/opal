import React from "react";
import {
  Typography,
  Tooltip,
  IconButton,
  Toolbar,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import { FiFilter, FiTrash2 } from "react-icons/fi";
import { toolbarStyles } from "./constants";
import { projectAction } from "../../../../../.shared/src";

interface ProjectToolbarProps extends WithStyles<typeof toolbarStyles> {
  selected: string[];
  name: string;
  showModal: (type: projectAction) => void;
}

const ProjectToolbar: React.FC<ProjectToolbarProps> = ({
  selected,
  name,
  showModal,
  classes,
}) => {
  const numSelected = selected.length;

  return (
    <Toolbar
      className={`${classes.root} ${numSelected > 0 ? classes.highlight : ""}`}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {name}
        </Typography>
      )}

      {numSelected > 0 ? (
        <>
          <Tooltip title="Delete">
            <IconButton aria-label="delete">
              <FiTrash2 />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FiFilter />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default withStyles(toolbarStyles)(ProjectToolbar);
