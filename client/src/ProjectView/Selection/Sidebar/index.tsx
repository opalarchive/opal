import React from "react";

import * as ROUTES from "../../../Constants/routes";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Star, HardDrive, Users, Clock, Trash2, Plus } from "react-feather";
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
import generateStyles from "./index.css";
import { compose } from "recompose";

interface SidebarProps {
  authUser: firebase.User;
}

const blankStyles = generateStyles(0);

interface SidebarBaseProps
  extends SidebarProps,
    WithStyles<typeof blankStyles>,
    RouteComponentProps<{}> {}

class SidebarBase extends React.Component<SidebarBaseProps> {
  render() {
    const { authUser, classes, location, history } = this.props;

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
      <Paper square elevation={2} className={classes.root}>
        <List component="nav" aria-label="project selection">
          <ListItem className={`${classes.item} ${classes.buttonWrapper}`}>
            <Button
              className={classes.button}
              variant="contained"
              color="secondary"
              style={{ borderRadius: 1000 }}
              onClick={() => onClickNewProject()}
            >
              <Plus
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
            Star,
            "Priority",
            "0.3",
            ROUTES.PROJECT_PRIORITY,
            ROUTES.PROJECT
          )}
          {navlink(
            HardDrive,
            "My Projects",
            "0.225",
            ROUTES.PROJECT_MY_PROJECTS
          )}
          {navlink(
            Users,
            "Shared with Me",
            "0.3",
            ROUTES.PROJECT_SHARED_WITH_ME
          )}
          {navlink(Clock, "Recent", "0.31", ROUTES.PROJECT_RECENT)}
          {navlink(Trash2, "Trash", "0.33", ROUTES.PROJECT_TRASH)}
        </List>
      </Paper>
    );
  }
}

const Sidebar: React.FC<SidebarProps & { width: number }> = ({
  width,
  ...rest
}) => {
  const FixedWidthSidebar = compose<SidebarBaseProps, any>(
    withRouter,
    withStyles(generateStyles(width))
  )(SidebarBase);

  return <FixedWidthSidebar {...rest} />;
};

export default Sidebar;
