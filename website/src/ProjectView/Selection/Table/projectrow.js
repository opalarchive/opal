import React from 'react';

import * as ROUTES from "../../../Constants/routes";

import { TableRow, TableCell, Checkbox, Tooltip, IconButton } from "@material-ui/core";
import { UserPlus, Trash2, Edit } from "react-feather";
import { Link } from "react-router-dom";
import { rowStyles, getDataPoint, formatData } from './constants';

export default function ProjectRow (props) {
  const styles = rowStyles();
  const { id, index, data, proj, selected, onRowClick, username } = props;

  const labelId = `project-table-checkbox-${index}`;

  return (
    <TableRow
      hover
      onClick={(event) => onRowClick(event, id)}
      role="checkbox"
      aria-checked={selected}
      selected={selected}
      key={id}
      tabIndex={-1}
    >
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          inputProps={{ "aria-labelledby": labelId }}
        />
      </TableCell>
      {data.map((dataPoint, index) =>
        index === 0 ? (
          <TableCell
            component="th"
            scope="row"
            id={labelId}
            padding="none"
            key={`${id}-${dataPoint}`}
          >
            <Link
              className={styles.link}
              to={ROUTES.PROJECT_VIEW.replace(":id", id)}
            >
              {formatData(getDataPoint(proj, dataPoint, username))}
            </Link>
          </TableCell>
        ) : (
          <TableCell align="right" key={`${id}-${dataPoint}`}>
            {formatData(getDataPoint(proj, dataPoint, username))}
          </TableCell>
        )
      )}

      <TableCell>
        <Tooltip title="Share">
          <IconButton
            aria-label="share"
            onClick={(event) => props.showModal(event, "share", props.id)}
          >
            <UserPlus />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={(event) => props.showModal(event, "delete", props.id)}>
            <Trash2 />
          </IconButton>
        </Tooltip>
        <Tooltip title="Change Name">
          <IconButton aria-label="change-name" onClick={(event) => props.showModal(event, "change-name", props.id)}>
            <Edit />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};
