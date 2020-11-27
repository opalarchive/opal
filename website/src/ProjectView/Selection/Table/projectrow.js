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
import { withStyles } from '@material-ui/core/styles';

import { UserPlus, Trash2, Edit, Star, CornerLeftUp } from "react-feather";
import { Link } from "react-router-dom";
import { rowStyles, dataPointDisplay, IfDisplay } from "./constants";

class ProjectRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contextShowing: false,
      mouseX: 0,
      mouseY: 0,
      actions: {
        star: false,
        share: false,
        edit: false,
        deleteProject: false,
        restore: false,
        deleteForever: false
      }
    };
    this.displayContextMenu = this.displayContextMenu.bind(this);
    this.closeContextMenu = this.closeContextMenu.bind(this);
    this.closeContextShowModal = this.closeContextShowModal.bind(this);
  }

  componentDidMount() {
    const { proj, username } = this.props;
    let share = false, star = false, edit = false, deleteProject = false, restore = false, deleteForever = false;

    if (proj.owner === username) {
      if (!proj.trashed)
        share = star = edit = deleteProject = true;
      else
        restore = deleteForever = star = true;
    }
    else
      star = true;
    this.setState({actions: {share, star, edit, deleteProject, restore, deleteForever}});
  }

  displayContextMenu(event) {
    event.preventDefault();
    if (this.state.contextShowing) {
      this.closeContextMenu({preventDefault: _ => {}});
      return;
    }

    this.setState({contextShowing: true, mouseX: event.clientX + 2, mouseY: event.clientY + 4});
  }

  closeContextMenu(event) {
    event.preventDefault();

    this.setState({contextShowing: false, mouseX: 0, mouseY: 0});
  }

  closeContextShowModal(event, type, id) {
    event.preventDefault();

    this.closeContextMenu({preventDefault: _ => {}});
    this.props.showModal({stopPropagation: _ => {}}, type, id);
  }

  render() {
    const { uuid, index, data, proj, selected, onRowClick, username, classes } = this.props;
    const { contextShowing, mouseX, mouseY } = this.state;
    const { star, share, edit, deleteProject, restore, deleteForever } = this.state.actions;

    const labelId = `project-table-checkbox-${index}`;
    const actions = [
      { display: "Share", icon: <UserPlus />, event: "share", condition: share },
      { display: "Delete", icon: <Trash2 />, event: "delete", condition: deleteProject },
      { display: "Change Name", icon: <Edit />, event: "change-name", condition: edit },
      { display: "Restore", icon: <CornerLeftUp />, event: "restore", condition: restore },
      { display: "Delete Forever", icon: <Trash2 />, event: "delete-forever", condition: deleteForever },
      { display: "Star", icon: proj.starred ? <Star color='#FFD700' fill='#FFD700' /> : <Star />, event: "star", condition: star },
    ];

    return (
      <>
      <TableRow
        hover
        onClick={(event) => !this.state.contextShowing && onRowClick(event, uuid)}
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
        onClose={this.closeContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          mouseY !== null && mouseX !== null
            ? { top: mouseY, left: mouseX }
            : undefined
        }
      >
        {actions.map(action => (
          <IfDisplay condition={action.condition} key={`${uuid}-contextmenu-${action.display}`}>
            <MenuItem aria-label={action.display} onClick={(event) => this.closeContextShowModal(event, action.event, uuid)}>
              <ListItemIcon>
                {action.icon}
              </ListItemIcon>
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
                uuid={labelId}
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
