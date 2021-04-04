import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import React from "react";

import {
  Client,
  ProjectRole,
  projectRole,
} from "../../../../../../../../.shared/src";

import { FiChevronDown } from "react-icons/fi";
import { toggleRole } from "../../../../../../Firebase";
import { formatTime } from "../../../../../../Constants";

const projectRoles: projectRole[] = ["OWNER", "ADMIN", "EDITOR"];

interface ManageUserProps {
  uuid: string;
  editors: Client.Editors;
  myRole: projectRole;
  authUser: firebase.User;
}

class ManageUser extends React.Component<ManageUserProps> {
  constructor(props: ManageUserProps) {
    super(props);

    this.getSortedUserList = this.getSortedUserList.bind(this);
  }

  getSortedUserList() {
    const { editors } = this.props;

    let sortedEditors: Client.Editors = {};

    [...projectRoles].forEach((role) =>
      Object.entries(editors).forEach(([username, editStatus]) => {
        if (editStatus.role === role) {
          sortedEditors[username] = editStatus;
        }
      })
    );
    return sortedEditors;
  }

  render() {
    const { uuid, authUser, myRole } = this.props;
    const sortedEditors = this.getSortedUserList();

    return (
      <Accordion>
        <AccordionSummary
          expandIcon={<FiChevronDown />}
          aria-controls={`manage-users`}
          id={`manage-users`}
        >
          <Typography>Manage Users</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={0}>
            {Object.values(sortedEditors).length !== 0 &&
              Object.entries(sortedEditors).map(
                ([username, editStatus], index) => (
                  <React.Fragment key={username}>
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<FiChevronDown />}
                          aria-controls={`${username}-details-content`}
                          id={`${username}-details-header`}
                        >
                          <Typography
                            style={{
                              flexBasis: "33.33%",
                              flexShrink: 0,
                            }}
                          >
                            {editStatus.role}
                          </Typography>
                          <Typography
                            style={{
                              flexBasis: "33.33%",
                              flexShrink: 0,
                            }}
                          >
                            {username}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <UserItem
                            uuid={uuid}
                            username={username}
                            editStatus={editStatus}
                            authUser={authUser}
                            myRole={myRole}
                          />
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  </React.Fragment>
                )
              )}
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  }
}

interface UserItemProps {
  editStatus: Client.EditStatus;
  username: string;
  uuid: string;
  authUser: firebase.User;
  myRole: projectRole;
}

interface UserItemState {
  roleMenuAnchorEl: HTMLElement | null;
  subjectNewRole: projectRole;
}

class UserItem extends React.Component<UserItemProps, UserItemState> {
  constructor(props: UserItemProps) {
    super(props);
    this.state = { ...this.state, subjectNewRole: this.props.editStatus.role };

    this.openRoleMenu = this.openRoleMenu.bind(this);
    this.closeRoleMenu = this.closeRoleMenu.bind(this);
    this.setCurrentRole = this.setCurrentRole.bind(this);
  }

  openRoleMenu(e: React.MouseEvent<HTMLButtonElement>) {
    this.setState({ roleMenuAnchorEl: e.currentTarget });
  }

  closeRoleMenu() {
    this.setState({ roleMenuAnchorEl: null });
  }

  async setCurrentRole(subjectNewRole: projectRole) {
    const subjectCurrentRole = this.props.editStatus.role;
    if (subjectCurrentRole === subjectNewRole) return;
    this.setState({ subjectNewRole });
    const result = await toggleRole(
      this.props.uuid,
      this.props.username,
      subjectNewRole,
      this.props.authUser
    );
    if (!result.success) {
      this.setState({ subjectNewRole: subjectCurrentRole });
    }
  }

  render() {
    const {
      // username,
      editStatus,
      myRole,
    } = this.props;

    return (
      <div>
        <h4>User Details</h4>
        <div>
          <b>Share Date:</b>&nbsp; {formatTime(editStatus.shareDate)} <br />
          <b>Last Edit:</b>&nbsp; {formatTime(editStatus.lastEdit)} <br />
        </div>
        <br />
        Role:&nbsp;
        {ProjectRole[myRole] === 0 ||
        ProjectRole[myRole] < ProjectRole[this.state.subjectNewRole] ? (
          <IconButton
            size="small"
            color="inherit"
            onClick={this.openRoleMenu}
            aria-controls="role-select-menu"
            aria-haspopup="true"
            edge="end"
          >
            {this.state.subjectNewRole}
          </IconButton>
        ) : (
          <>{this.state.subjectNewRole}</>
        )}
        <Menu
          id="list-select-menu"
          anchorEl={this.state.roleMenuAnchorEl}
          keepMounted
          open={!!this.state.roleMenuAnchorEl}
          onClose={this.closeRoleMenu}
          elevation={3}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {projectRoles.map((role) => (
            <MenuItem
              onClick={(_) => {
                this.setCurrentRole(role);
                this.closeRoleMenu();
              }}
              disabled={
                ProjectRole[myRole] > 0 &&
                ProjectRole[myRole] >= ProjectRole[role]
              }
            >
              {role}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

export default ManageUser;
