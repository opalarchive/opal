import React from 'react';
import styles from './index.module.css';

import * as ROUTES from '../../../Constants/routes';
import { Link } from "react-router-dom";
import { Star, HardDrive, Users, Clock, Trash2, Plus } from 'react-feather';
import { Tooltip, IconButton, Fab, Button } from '@material-ui/core';

function navlink(location, Icon, name, url, urlAlias, yOffset) {
  if (!urlAlias) urlAlias = url;

  return location == url || location == urlAlias ?
    <Link className={`${styles.item} ${styles.link} ${styles.active}`} onClick={(event) => event.preventDefault()} to='#'>
      <Icon strokeWidth="1.5" size="1.2rem" style={{ position: "relative", top: `${yOffset}rem` }} /><span className={styles.linkname}>{name}</span>
    </Link>
    :
    <Link className={`${styles.item} ${styles.link}`} to={url}>
      <Icon strokeWidth="1.5" size="1.2rem" style={{ position: "relative", top: `${yOffset}rem` }} /><span className={styles.linkname}>{name}</span>
    </Link>;
}

class Sidebar extends React.Component {
  render() {
    const location = window.location.pathname;
    return (
      <div className={`${styles.sidebar} float`} style={{ width: `${this.props.width}rem` }}>
        <div className={styles.item}>
          <Button variant="contained" color="secondary" style={{ borderRadius: 1000 }} href={ROUTES.PROJECT_NEW}>
            <Plus strokeWidth="1.5" style={{ position: "relative", top: "-0.07rem" }} /> <span className={styles.linkname}>New Project</span>
          </Button>
        </div>

        {navlink(location, Star, 'Priority', ROUTES.PROJECT_PRIORITY, ROUTES.PROJECT, "-0.15")}
        {navlink(location, HardDrive, 'My Projects', ROUTES.PROJECT_MY_PROJECTS, null, "-0.1")}
        {navlink(location, Users, 'Shared with Me', ROUTES.PROJECT_SHARED_WITH_ME, null, "-0.15")}
        {navlink(location, Clock, 'Recent', ROUTES.PROJECT_RECENT, null, "-0.125")}
        {navlink(location, Trash2, 'Trash', ROUTES.PROJECT_TRASH, null, "-0.15")}
      </div>
    );
  }
}

export default Sidebar;
