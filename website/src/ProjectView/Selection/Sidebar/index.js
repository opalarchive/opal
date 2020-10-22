import React from 'react';
import styles from './index.module.css';

import * as ROUTES from '../../../Constants/routes';
import { Link } from "react-router-dom";
import { Star, HardDrive, Users, Clock, Trash2 } from 'react-feather';

function navlink(location, Icon, name, url, urlAlias) {
  if (!urlAlias) urlAlias = url;

  return location == url || location == urlAlias ?
    <Link className={`${styles.link} ${styles.active}`} onClick={(event) => event.preventDefault()}>
      <Icon strokeWidth="1.5" size="1rem" style={{ position: "relative", top: "-2px" }} /><span className={styles.linkname}>{name}</span>
    </Link>
    : 
    <Link className={`${styles.link}`} to={url}>
      <Icon strokeWidth="1.5" size="1rem" style={{ position: "relative", top: "-2px" }} /><span className={styles.linkname}>{name}</span>
    </Link>;
}

class Sidebar extends React.Component {
  render() {
    const location = window.location.pathname;
    console.log(location);
    return (
      <div className={`${styles.sidebar} float`} style={{ width: `${this.props.width}rem` }}>
        {navlink(location, Star, 'Priority', ROUTES.PROJECT_PRIORITY, ROUTES.PROJECT)}
        {navlink(location, HardDrive, 'My Projects', ROUTES.PROJECT_MY_PROJECTS, null)}
        {navlink(location, Users, 'Shared with Me', ROUTES.PROJECT_SHARED_WITH_ME, null)}
        {navlink(location, Clock, 'Recent', ROUTES.PROJECT_RECENT, null)}
        {navlink(location, Trash2, 'Trash', ROUTES.PROJECT_TRASH, null)}
      </div>
    );
  }
}

export default Sidebar;
