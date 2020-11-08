import { AppBar, Typography, Toolbar, makeStyles, IconButton, Badge } from '@material-ui/core';
import React from 'react';
import { Bell, User } from 'react-feather';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
}));

const TopBar = (props) => {
  const { notifs } = props;
  const styles = useStyles();

  return (<AppBar position="static">
    <Toolbar>
      <Typography variant="h6" className={styles.title}>
        foo
      </Typography>
      <IconButton aria-label={`show ${notifs} new notifications`} color="inherit" className={styles.menuButton}>
        <Badge badgeContent={notifs} color="secondary">
          <Bell />
        </Badge>
      </IconButton>
      <IconButton edge="end" aria-label="account of current user" color="inherit" className={styles.menuButton}>
        <User />
      </IconButton>
    </Toolbar>
  </AppBar>);
}

export default TopBar;