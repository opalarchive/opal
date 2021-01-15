import React from "react";

import * as ROUTES from "../../../Constants/routes";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import {
  FiStar,
  FiHardDrive,
  FiUsers,
  FiClock,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import { newProject } from "../../../Firebase";
import styles from "./index.css";
import { compose } from "recompose";

interface SidebarBaseProps {
  width: number;
  height: number;
  authUser: firebase.User;
}

interface SidebarProps
  extends SidebarBaseProps,
    WithStyles<typeof styles>,
    RouteComponentProps<{}> {}

class Sidebar extends React.Component<SidebarProps> {
  render() {
    const { width, height, authUser, classes, location, history } = this.props;

    const navlink = (
      Icon: React.ElementType,
      name: string,
      yOffset: string,
      url: string,
      urlAlias?: string
    ) => {
      if (!urlAlias) urlAlias = url;

      // return location === url || location === urlAlias ?
      //   <Link className={`${classes.item} ${classes.link} ${classes.active}`} onClick={(event) => event.preventDefault()} to='#'>
      //     <Icon strokeWidth="1.5" size="1.2rem" style={{ position: "relative", top: `${yOffset}rem` }} /><span className={classes.linkname}>{name}</span>
      //   </Link>
      //   :
      //   <Link className={`${classes.item} ${classes.link}`} to={url}>
      //     <Icon strokeWidth="1.5" size="1.2rem" style={{ position: "relative", top: `${yOffset}rem` }} /><span className={classes.linkname}>{name}</span>
      //   </Link>;

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

    const onClickNewProject = async () => {
      const newProjectUUID = await newProject(authUser);

      if (newProjectUUID.success) {
        history.push(
          ROUTES.PROJECT_VIEW.replace(":uuid", newProjectUUID.value)
        );
      }
    };

    return (
      <div className={classes.root} style={{ width: `${width}rem`, height }}>
        <List component="nav" aria-label="project selection">
          <ListItem className={`${classes.item} ${classes.buttonWrapper}`}>
            <Button
              className={classes.button}
              variant="contained"
              color="secondary"
              style={{ borderRadius: 1000 }}
              onClick={() => onClickNewProject()}
            >
              <FiPlus
                strokeWidth="1.5"
                style={{
                  position: "relative",
                  top: "-0.05rem",
                  marginRight: "0.5rem",
                }}
              />
              <span>New Project</span>
            </Button>
          </ListItem>

          {navlink(
            FiStar,
            "Priority",
            "0.3",
            ROUTES.SELECTION_PRIORITY,
            ROUTES.PROJECT
          )}
          {navlink(
            FiHardDrive,
            "My Projects",
            "0.225",
            ROUTES.SELECTION_MY_PROJECTS
          )}
          {navlink(
            FiUsers,
            "Shared with Me",
            "0.3",
            ROUTES.SELECTION_SHARED_WITH_ME
          )}
          {navlink(FiClock, "Recent", "0.31", ROUTES.SELECTION_RECENT)}
          {navlink(FiTrash2, "Trash", "0.33", ROUTES.SELECTION_TRASH)}
        </List>
      </div>
    );
  }
}

export default compose<SidebarProps, SidebarBaseProps>(
  withStyles(styles),
  withRouter
)(Sidebar);
