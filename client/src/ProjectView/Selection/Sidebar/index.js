import React from 'react';

import * as ROUTES from '../../../Constants/routes';
import { Link, withRouter } from "react-router-dom";
import { Star, HardDrive, Users, Clock, Trash2, Plus } from 'react-feather';
import { Button, List, ListItem, ListItemIcon, ListItemText, makeStyles, Paper } from '@material-ui/core';
import { newProject } from '../../../Firebase';

const useStyles = width => makeStyles((theme) => ({
  root: {
    display: "inline-block",
    position: "absolute",
    width: `${width}rem`,
    height: '100%',
  },
  buttonWrapper: {
    paddingBottom: theme.spacing(2),
  },
  button: {
    width: "100%",
    textAlign: "center"
  },
  item: {
    display: "block",
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
  },
  itemIcon: {
    minWidth: 0,
  },
  itemText: {
    display: "inline-block",
    margin: `0 0 0 ${theme.spacing(2)}px`,
    fontSize: "100px !important",
  }
}));

function navlink(location, styles, Icon, name, url, urlAlias, yOffset) {
  if (!urlAlias) urlAlias = url;

  // return location === url || location === urlAlias ?
  //   <Link className={`${styles.item} ${styles.link} ${styles.active}`} onClick={(event) => event.preventDefault()} to='#'>
  //     <Icon strokeWidth="1.5" size="1.2rem" style={{ position: "relative", top: `${yOffset}rem` }} /><span className={styles.linkname}>{name}</span>
  //   </Link>
  //   :
  //   <Link className={`${styles.item} ${styles.link}`} to={url}>
  //     <Icon strokeWidth="1.5" size="1.2rem" style={{ position: "relative", top: `${yOffset}rem` }} /><span className={styles.linkname}>{name}</span>
  //   </Link>;

  const isSamePage = location === url || location === urlAlias;

  return (
    <ListItem
      button
      className={`${styles.item}`}
      selected={isSamePage}
      component={Link}
      to={url}
      onClick={isSamePage ? ((event) => event.preventDefault()) : null}
    >
      <ListItemIcon className={styles.itemIcon}>
        <Icon strokeWidth="1.5" size="1.4rem" style={{ position: "relative", top: `${yOffset}rem` }} />
      </ListItemIcon>
      <ListItemText primary={name} className={styles.itemText} />
    </ListItem>
  );
}

const onClickNewProject = async (uid, history) => {
  const newProjectUUID = await newProject(uid);

  history.push(ROUTES.PROJECT_VIEW.replace(':id', newProjectUUID));
}

const Sidebar = (props) => {
  const styles = useStyles(props.width)();
  const location = props.location.pathname;

  return (
    <Paper square elevation={2} className={styles.root}>
      <List component="nav" aria-label="project selection">
        <ListItem className={`${styles.item} ${styles.buttonWrapper}`}>
          <Button className={styles.button} variant="contained" color="secondary" style={{ borderRadius: 1000 }} onClick={() => onClickNewProject(props.authUser.uid, props.history)}>
            <Plus strokeWidth="1.5" style={{ position: "relative", top: "-0.05rem", marginRight: "0.5rem" }} />
            <span className={styles.linkname}>New Project</span>
          </Button>
        </ListItem>
        

        {navlink(location, styles, Star, 'Priority', ROUTES.PROJECT_PRIORITY, ROUTES.PROJECT, "0.3")}
        {navlink(location, styles, HardDrive, 'My Projects', ROUTES.PROJECT_MY_PROJECTS, null, "0.225")}
        {navlink(location, styles, Users, 'Shared with Me', ROUTES.PROJECT_SHARED_WITH_ME, null, "0.3")}
        {navlink(location, styles, Clock, 'Recent', ROUTES.PROJECT_RECENT, null, "0.31")}
        {navlink(location, styles, Trash2, 'Trash', ROUTES.PROJECT_TRASH, null, "0.33")}
      </List>
    </Paper>
  );
}


export default withRouter(Sidebar);
