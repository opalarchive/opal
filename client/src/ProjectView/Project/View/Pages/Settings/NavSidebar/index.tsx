import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import React from "react";
import { FiCircle, FiUsers } from "react-icons/fi";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import Scrollbar from "react-scrollbars-custom";
import { SidebarProps } from "../../../../../Template/SidebaredBase";
import styles from "./index.css";

import * as ROUTES from "../../../../../../Constants/routes";
import { compose } from "recompose";

interface NavSidebarPropsBase {
  uuid: string;
}

type NavSidebarProps = NavSidebarPropsBase &
  SidebarProps &
  RouteComponentProps &
  WithStyles<typeof styles>;

class NavSidebar extends React.Component<NavSidebarProps> {
  render() {
    const { width, uuid, location, classes } = this.props;

    const navlink = (
      Icon: React.ElementType,
      name: string,
      yOffset: string,
      url: string,
      urlAlias?: string
    ) => {
      if (!urlAlias) urlAlias = url;

      const isSamePage =
        location.pathname === url || location.pathname === urlAlias;

      return (
        <ListItem
          button
          className={`${classes.item}`}
          selected={isSamePage}
          component={Link}
          to={url}
          onClick={
            isSamePage
              ? (event: React.MouseEvent<HTMLAnchorElement>) =>
                  event.preventDefault()
              : undefined
          }
        >
          <ListItemIcon className={classes.itemIcon}>
            <Icon
              strokeWidth="1.5"
              size="1.4rem"
              style={{ position: "relative", top: `${yOffset}rem` }}
            />
          </ListItemIcon>
          <ListItemText primary={name} className={classes.itemText} />
        </ListItem>
      );
    };

    return (
      <div className={classes.root} style={{ width: `${width}rem` }}>
        <Scrollbar>
          <div className={classes.wrapper}>
            <List component="nav" aria-label="project selection">
              {navlink(
                FiUsers,
                "Manage Users",
                "0.3",
                ROUTES.PROJECT_USERS.replace(":uuid", uuid),
                ROUTES.PROJECT_SETTINGS.replace(":uuid", uuid)
              )}
              {navlink(
                FiCircle,
                "Problem Types",
                "0.225",
                ROUTES.PROJECT_TYPES.replace(":uuid", uuid)
              )}
            </List>
          </div>
        </Scrollbar>
      </div>
    );
  }
}

export default compose<NavSidebarProps, NavSidebarPropsBase & SidebarProps>(
  withStyles(styles),
  withRouter
)(NavSidebar);
