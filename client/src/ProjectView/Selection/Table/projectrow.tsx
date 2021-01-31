import React from "react";

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
import { WithStyles, withStyles } from "@material-ui/core/styles";

import {
  FiUserPlus,
  FiTrash2,
  FiEdit,
  FiStar,
  FiCornerLeftUp,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { rowStyles, dataPointDisplay, IfDisplay } from "./constants";
import { Client, projectAction } from "../../../../../.shared";
import { ProjectDataPoint } from "../../../Constants/types";

interface ProjectRowProps extends WithStyles<typeof rowStyles> {
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
  showModal: (type: projectAction, activeProject: string) => void;
  name: string;
}

interface ProjectRowState {
  contextShowing: boolean;
  mouseX: number;
  mouseY: number;
  actions: {
    [action in projectAction]: boolean;
  };
}

class ProjectRow extends React.Component<ProjectRowProps, ProjectRowState> {
  state = {
    contextShowing: false,
    mouseX: 0,
    mouseY: 0,
    actions: {
      SHARE: false,
      DELETE: false,
      CHANGE_NAME: false,
      RESTORE: false,
      STAR: false,
      UNSHARE: false,
      PROMOTE: false,
      DEMOTE: false,
    },
  };

  constructor(props: ProjectRowProps) {
    super(props);
    this.displayContextMenu = this.displayContextMenu.bind(this);
    this.closeContextMenu = this.closeContextMenu.bind(this);
    this.closeContextShowModal = this.closeContextShowModal.bind(this);
  }

  componentDidMount() {
    const { proj, username } = this.props;
    let share = false,
      deleteProject = false,
      changeName = false,
      restore = false,
      star = false;

    if (proj.owner === username) {
      if (!proj.trashed) share = star = changeName = deleteProject = true;
      else restore = star = true;
    } else star = true;
    this.setState({
      actions: {
        SHARE: share,
        DELETE: deleteProject,
        CHANGE_NAME: changeName,
        RESTORE: restore,
        STAR: star,
        UNSHARE: false,
        PROMOTE: false,
        DEMOTE: false,
      },
    });
  }

  displayContextMenu(event: React.MouseEvent<HTMLTableRowElement>) {
    event.preventDefault();
    if (this.state.contextShowing) {
      this.closeContextMenu();
      return;
    }

    this.setState({
      contextShowing: true,
      mouseX: event.clientX + 2,
      mouseY: event.clientY + 4,
    });
  }

  closeContextMenu(event?: React.MouseEvent<HTMLButtonElement>) {
    if (!!event) event.preventDefault();

    this.setState({ contextShowing: false, mouseX: 0, mouseY: 0 });
  }

  closeContextShowModal(
    event: React.MouseEvent<HTMLLIElement>,
    type: projectAction,
    uuid: string
  ) {
    event.preventDefault();

    this.closeContextMenu();
    this.props.showModal(type, uuid);
  }

  render() {
    const {
      uuid,
      index,
      data,
      proj,
      selected,
      onRowClick,
      username,
      classes,
    } = this.props;
    const { contextShowing, mouseX, mouseY } = this.state;
    const {
      SHARE,
      DELETE: DELETE_PROJECT,
      CHANGE_NAME,
      RESTORE,
      STAR,
    } = this.state.actions;

    const labelId = `project-table-checkbox-${index}`;
    const actions = [
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
            !this.state.contextShowing && onRowClick(event, uuid)
          }
          role="checkbox"
          aria-checked={selected}
          selected={selected}
          key={uuid}
          tabIndex={-1}
          onContextMenu={this.displayContextMenu}
        >
          <Menu
            className="project-row-context-menu"
            keepMounted
            open={contextShowing}
            onClose={(
              event: React.MouseEvent<HTMLButtonElement>,
              reason: "backdropClick" | "escapeKeyDown"
            ) => this.closeContextMenu(event)}
            anchorReference="anchorPosition"
            anchorPosition={
              mouseY !== null && mouseX !== null
                ? { top: mouseY, left: mouseX }
                : undefined
            }
          >
            {actions.map((action) => (
              <IfDisplay
                condition={action.condition}
                key={`${uuid}-contextmenu-${action.display}`}
              >
                <MenuItem
                  aria-label={action.display}
                  onClick={(event: React.MouseEvent<HTMLLIElement>) =>
                    this.closeContextShowModal(event, action.event, uuid)
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
  }
}

export default withStyles(rowStyles)(ProjectRow);
