import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, IconButton, Menu, MenuItem, Typography, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { ViewSectionProps } from "../..";

import { Client, ProjectRole, projectRole, Server } from "../../../../../../../.shared";
import styles from "./index.css";
import { problemFunctions, problemProps } from "../../../../../Constants/types";
import SidebaredBase from "../../../../Template/SidebaredBase";

import * as ROUTES from "../../../../../Constants/routes";
import { FiChevronDown } from "react-icons/fi";
import { toggleRole } from "../../../../../Firebase";
import { formatTime } from "../../../../../Constants";

const projectRoles: projectRole[] = ["OWNER", "ADMIN", "EDITOR"];

interface SettingsProps extends ViewSectionProps {
  editors: Client.Editors;
}

class Settings extends React.Component<
  SettingsProps & WithStyles<typeof styles>
> {
  constructor(props: SettingsProps & WithStyles<typeof styles>) {
    super(props);

    this.getSortedUserList = this.getSortedUserList.bind(this);
  }

  getSortedUserList() {
    const { editors } = this.props;

    let sortedEditors: any[] = []; //since Object.entries has arrays with elements being different types, ill just do this

    const editorsWithRoles = Object.entries(
      editors
    ).map(([username, editStatus]) => [username, editStatus, editStatus.role]);

    [...projectRoles].forEach((role) =>
      editorsWithRoles.forEach(([username, editStatus, userRole]) => {
        if (userRole === role) {
          sortedEditors.push([username, editStatus]);
        }
      })
    );
    return Object.fromEntries(sortedEditors);
  }

  render() {
    const {
      uuid,
      project,
      fixedSidebar,
      categoryColors,
      difficultyColors,
      authUser,
      classes,
      myRole,
    } = this.props;
    const sortedEditors = this.getSortedUserList();

    return (
      <div className={classes.root}>
        <Box p={{ xs: 2, sm: 3, md: 4 }}>
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
        </Box>
      </div>
    );
  }
}

export default compose<
  SettingsProps & WithStyles<typeof styles>,
  SettingsProps
>(
  withStyles(styles),
)(Settings);

interface UserItemProps {
  editStatus: Server.EditStatus;
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
    const result = await toggleRole(this.props.uuid, this.props.username, subjectNewRole, this.props.authUser);
    if (!result.success) {
      this.setState({ subjectNewRole: subjectCurrentRole });
    }
  }

  render() {
    const { username, editStatus, myRole } = this.props;

    return (
      <div className="p-2 position-relative">
        <h4 className="mt-0 mb-1">User Details</h4>
        <div style={{ marginBottom: "0" }}>
          <b>Share Date:</b>&nbsp; {formatTime(editStatus.shareDate)} <br />
          <b>Last Edit:</b>&nbsp; {formatTime(editStatus.lastEdit)} <br />
        </div>
        <br />
        Role:&nbsp;
        {ProjectRole[myRole] == 0 || ProjectRole[myRole] < ProjectRole[this.state.subjectNewRole] ? (
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
              disabled={ProjectRole[myRole] > 0 && ProjectRole[myRole] >= ProjectRole[role]}
            >
              {role}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}