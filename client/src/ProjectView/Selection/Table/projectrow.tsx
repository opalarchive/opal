import React, { useState } from "react";

import * as ROUTES from "../../../Constants/routes";

import {
  TableRow,
  TableCell,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import {
  FiUserPlus,
  FiTrash2,
  FiEdit,
  FiStar,
  FiCornerLeftUp,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { rowStyles, dataPointDisplay, IfDisplay } from "./constants";
import { Client, projectAction } from "../../../../../.shared/src";
import { ProjectDataPoint } from "../../../Constants/types";

const getInitialActions = (proj: Client.ProjectPublic, username: string) => {
  let share = false,
    deleteProject = false,
    changeName = false,
    restore = false,
    star = false;

  if (proj.owner === username) {
    if (!proj.trashed) {
      share = star = changeName = deleteProject = true;
    } else {
      restore = star = true;
    }
  } else {
    star = true;
  }

  return {
    SHARE: share,
    DELETE: deleteProject,
    CHANGE_NAME: changeName,
    RESTORE: restore,
    STAR: star,
    UNSHARE: false,
    PROMOTE: false,
    DEMOTE: false,
    MAKE_OWNER: false,
  };
};

interface ProjectRowProps {
  uuid: string;
  index: number;
  data: ProjectDataPoint[];
  proj: Client.ProjectPublic;
  selected: boolean;
  onRowClick: (
    event: React.MouseEvent<HTMLTableRowElement>,
    uuid: string
  ) => void;
  username: string;
  showModal: (type: projectAction, activeProjectUUID: string) => void;
  name: string;
}

const ProjectRow: React.FC<ProjectRowProps> = ({
  uuid,
  index,
  data,
  proj,
  selected,
  onRowClick,
  username,
  showModal,
  name,
}) => {
  const classes = makeStyles(rowStyles)();

  const [contextShowing, setContextShowing] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const actions = getInitialActions(proj, username);

  const displayContextMenu = (event: React.MouseEvent<HTMLTableRowElement>) => {
    event.preventDefault();
    if (contextShowing) {
      closeContextMenu();
      return;
    }

    setContextShowing(true);
    setMouseX(event.clientX + 2);
    setMouseY(event.clientY + 4);
  };

  const closeContextMenu = (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (!!event) event.preventDefault();

    setContextShowing(false);
    setMouseX(0);
    setMouseY(0);
  };

  const closeContextShowModal = (
    event: React.MouseEvent<HTMLLIElement>,
    type: projectAction,
    uuid: string
  ) => {
    event.preventDefault();

    closeContextMenu();
    showModal(type, uuid);
  };

  const { SHARE, DELETE: DELETE_PROJECT, CHANGE_NAME, RESTORE, STAR } = actions;

  const labelId = `project-table-checkbox-${index}`;
  const actionData = [
    {
      display: "Share",
      icon: <FiUserPlus size="1.4rem" />,
      event: "SHARE",
      condition: SHARE,
    },
    {
      display: "Delete",
      icon: <FiTrash2 size="1.4rem" />,
      event: "DELETE",
      condition: DELETE_PROJECT,
    },
    {
      display: "Change Name",
      icon: <FiEdit size="1.4rem" />,
      event: "CHANGE_NAME",
      condition: CHANGE_NAME,
    },
    {
      display: "Restore",
      icon: <FiCornerLeftUp size="1.4rem" />,
      event: "RESTORE",
      condition: RESTORE,
    },
    {
      display: "Star",
      icon: proj.starred ? (
        <FiStar color="#FFD700" fill="#FFD700" size="1.4rem" />
      ) : (
        <FiStar size="1.4rem" />
      ),
      event: "STAR",
      condition: STAR,
    },
  ] as {
    display: string;
    icon: JSX.Element;
    event: projectAction;
    condition: boolean;
  }[];

  return (
    <>
      <TableRow
        hover
        onClick={(event: React.MouseEvent<HTMLTableRowElement>) =>
          !contextShowing && onRowClick(event, uuid)
        }
        role="checkbox"
        aria-checked={selected}
        selected={selected}
        key={uuid}
        tabIndex={-1}
        onContextMenu={displayContextMenu}
      >
        <Menu
          className="project-row-context-menu"
          keepMounted
          open={contextShowing}
          onClose={(
            event: React.MouseEvent<HTMLButtonElement>,
            reason: "backdropClick" | "escapeKeyDown"
          ) => closeContextMenu(event)}
          anchorReference="anchorPosition"
          anchorPosition={
            mouseY !== null && mouseX !== null
              ? { top: mouseY, left: mouseX }
              : undefined
          }
        >
          {actionData.map((action) => (
            <IfDisplay
              condition={action.condition}
              key={`${uuid}-contextmenu-${action.display}`}
            >
              <MenuItem
                aria-label={action.display}
                onClick={(event: React.MouseEvent<HTMLLIElement>) =>
                  closeContextShowModal(event, action.event, uuid)
                }
              >
                <ListItemIcon>{action.icon}</ListItemIcon>
                <ListItemText primary={action.display} />
              </MenuItem>
            </IfDisplay>
          ))}
        </Menu>
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
              padding="none"
              key={`${uuid}-${dataPoint}`}
            >
              <Link
                className={classes.link}
                to={ROUTES.PROJECT_VIEW.replace(":uuid", uuid)}
              >
                {dataPointDisplay(proj, dataPoint, username, classes)}
              </Link>
            </TableCell>
          ) : (
            <TableCell align="right" key={`${uuid}-${dataPoint}`}>
              {dataPointDisplay(proj, dataPoint, username, classes)}
            </TableCell>
          )
        )}
      </TableRow>
    </>
  );
};

export default ProjectRow;
