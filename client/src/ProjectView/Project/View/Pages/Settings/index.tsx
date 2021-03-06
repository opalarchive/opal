import React from "react";
import { withStyles, WithStyles } from "@material-ui/core";
import { ViewSectionProps } from "../..";
import { Client } from "../../../../../../../.shared";
import styles from "./index.css";
import { Route, Switch } from "react-router-dom";
import ManageUser from "./ManageUser";

import * as ROUTES from "../../../../../Constants/routes";
import Types from "./Types";
import NavSidebar from "./NavSidebar";
import SidebaredBase from "../../../../Template/SidebaredBase";

interface SettingsProps extends ViewSectionProps, WithStyles<typeof styles> {
  editors: Client.Editors;
}

class Settings extends React.Component<SettingsProps> {
  render() {
    const {
      uuid,
      bodyHeight,
      fixedSidebar,
      editors,
      myRole,
      authUser,
      classes,
    } = this.props;
    return (
      <SidebaredBase
        sidebarWidth={18}
        Sidebar={NavSidebar}
        sidebarProps={{
          uuid,
        }}
        height={bodyHeight}
        fixedSidebar={fixedSidebar}
        authUser={authUser}
      >
        <div className={classes.root}>
          <Switch>
            <Route
              exact
              path={[ROUTES.PROJECT_SETTINGS, ROUTES.PROJECT_USERS]}
              render={(_) => (
                <ManageUser
                  uuid={uuid}
                  editors={editors}
                  myRole={myRole}
                  authUser={authUser}
                />
              )}
            />
            <Route
              exact
              path={ROUTES.PROJECT_TYPES}
              render={(_) => <Types />}
            />
          </Switch>
        </div>
      </SidebaredBase>
    );
  }
}
export default withStyles(styles)(Settings);
