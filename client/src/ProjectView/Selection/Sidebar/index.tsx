import React from "react";

import * as ROUTES from "../../../Constants/routes";
import { Link, useHistory, useLocation } from "react-router-dom";
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
  makeStyles,
} from "@material-ui/core";
import { newProject } from "../../../Firebase";
import styles, { navLinkStyles } from "./index.css";
import { SidebarProps as SidebarPropsBase } from "../../Template/SidebaredBase";

interface SidebarProps extends SidebarPropsBase {}

interface NavLinkProps {
  Icon: React.ElementType;
  name: string;
  yOffset: string;
  url: string;
  urlAlias?: string;
  currentUrlPath: string;
}

const NavLink: React.FC<NavLinkProps> = ({
  Icon,
  name,
  yOffset,
  url,
  urlAlias,
  currentUrlPath,
}) => {
  const classes = makeStyles(navLinkStyles)();

  if (!urlAlias) urlAlias = url;

  // return currentUrlPath === url || currentUrlPath === urlAlias ?
  //   <Link className={`${classes.item} ${classes.link} ${classes.active}`} onClick={(event) => event.preventDefault()} to='#'>
  //     <Icon strokeWidth="1.5" size="1.2rem" style={{ position: "relative", top: `${yOffset}rem` }} /><span className={classes.linkname}>{name}</span>
  //   </Link>
  //   :
  //   <Link className={`${classes.item} ${classes.link}`} to={url}>
  //     <Icon strokeWidth="1.5" size="1.2rem" style={{ position: "relative", top: `${yOffset}rem` }} /><span className={classes.linkname}>{name}</span>
  //   </Link>;

  const isSamePage = currentUrlPath === url || currentUrlPath === urlAlias;

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

const Sidebar: React.FC<SidebarProps> = ({ width, authUser }) => {
  const location = useLocation();
  const history = useHistory();
  const classes = makeStyles(styles)();

  const onClickNewProject = async () => {
    const newProjectUUID = await newProject(authUser);

    if (newProjectUUID.success) {
      history.push(ROUTES.PROJECT_VIEW.replace(":uuid", newProjectUUID.value));
    }
  };

  return (
    <div className={classes.root} style={{ width: `${width}rem` }}>
      <List component="nav" aria-label="project selection">
        <ListItem className={`${classes.item} ${classes.buttonWrapper}`}>
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            style={{ borderRadius: 1000 }}
            onClick={onClickNewProject}
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

        <NavLink
          Icon={FiStar}
          name="Priority"
          yOffset="0.3"
          url={ROUTES.SELECTION_PRIORITY}
          urlAlias={ROUTES.PROJECT}
          currentUrlPath={location.pathname}
        />
        <NavLink
          Icon={FiHardDrive}
          name="My Projects"
          yOffset="0.225"
          url={ROUTES.SELECTION_MY_PROJECTS}
          currentUrlPath={location.pathname}
        />
        <NavLink
          Icon={FiUsers}
          name="Shared with Me"
          yOffset="0.3"
          url={ROUTES.SELECTION_SHARED_WITH_ME}
          currentUrlPath={location.pathname}
        />
        <NavLink
          Icon={FiClock}
          name="Recent"
          yOffset="0.31"
          url={ROUTES.SELECTION_RECENT}
          currentUrlPath={location.pathname}
        />
        <NavLink
          Icon={FiTrash2}
          name="Trash"
          yOffset="0.33"
          url={ROUTES.SELECTION_TRASH}
          currentUrlPath={location.pathname}
        />
      </List>
    </div>
  );
};

export default Sidebar;
