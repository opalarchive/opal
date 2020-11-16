import {
  AppBar,
  Typography,
  Toolbar,
  withStyles,
  IconButton,
  Badge,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  List,
  ListItem,
  Divider,
} from "@material-ui/core";
import React from "react";
import { Bell, User, Loader } from "react-feather";
import Loading from "../../../Loading";
import "./index.module.css";

const styles = (theme) => {
  console.log(theme);
  return ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: theme.spacing(1)
  },
  title: {
    flexGrow: 1
  },
  paper: {
    transformOrigin: "top right",
    backgroundColor: theme.palette.info.light
  },
  list: {
    width: theme.spacing(40),
    maxHeight: theme.spacing(40),
    overflow: "auto"
  },
  listItem: {
    display: "flex",
    flexDirection: "column"
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    margin: theme.spacing(1, 0)
  },
  divider: {
    margin: theme.spacing(1, 0)
  },
  centeredSpace: {
    padding: theme.spacing(1),
    textAlign: "center"
  },
  notificationDot: {
    fontSize: "4rem",
    marginLeft: "0.2em",
    color: theme.palette.primary.light
  },
  link: {
    color: theme.palette.primary.light
  }
});}

class Notifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.setOpen = this.setOpen.bind(this);
    this.notificationButton = React.createRef();
  }

  setOpen(value) {
    this.setState({ open: value });
    if (!value && Array.isArray(this.props.notifs)) {
      this.props.markNotifications(this.props.notifs.length);
    }
  }

  render() {
    let { classes, notifs, loading } = this.props;
    const { open } = this.state;
    let test = ['hi', 'bye'];

    if (loading) {
      return (
        <>
          <IconButton
            aria-label={`the notifications are still loading`}
            color="inherit"
            className={classes.menuButton}
            onClick={(_) => this.setOpen(true)}
            ref={this.notificationButton}
          >
            <Badge badgeContent={<Loader size={10}/>} color="secondary">
              <Bell />
            </Badge>
          </IconButton>
          <Popper
            id="notifications-popup"
            anchorEl={this.notificationButton.current}
            open={open}
            placement="bottom-end"
            transition
            disablePortal
            role={undefined}
          >
            {({ TransitionProps }) => (
              <ClickAwayListener
                onClickAway={() => {
                  this.setOpen(false);
                }}
              >
                <Grow in={open} {...TransitionProps}>
                  <Paper className={classes.paper}>
                    <List
                      className={`${classes.list} ${classes.centeredSpace}`}
                    >
                      <Loading hideText={true} />
                      We're loading your notifications! Hang in there.
                    </List>
                  </Paper>
                </Grow>
              </ClickAwayListener>
            )}
          </Popper>
        </>
      );
    }

    if (!Array.isArray(notifs)) {
      return (
        <>
          <IconButton
            aria-label={`an error occured when getting the number of notifications`}
            color="inherit"
            className={classes.menuButton}
            onClick={(_) => this.setOpen(true)}
            ref={this.notificationButton}
          >
            <Badge badgeContent="!" color="secondary">
              <Bell />
            </Badge>
          </IconButton>
          <Popper
            id="notifications-popup"
            anchorEl={this.notificationButton.current}
            open={open}
            placement="bottom-end"
            transition
            disablePortal
            role={undefined}
          >
            {({ TransitionProps }) => (
              <ClickAwayListener
                onClickAway={() => {
                  this.setOpen(false);
                }}
              >
                <Grow in={open} {...TransitionProps}>
                  <Paper className={classes.paper}>
                    <List className={classes.list}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          role="img"
                          aria-label="unread-dot"
                          style={{ opacity: "0" }}
                          className={classes.notificationDot}
                        >
                          ·
                        </span>
                        <ListItem
                          alignItems="flex-start"
                          className={classes.listItem}
                        >
                          <Typography gutterBottom>
                            There was an Error!
                          </Typography>
                          <Typography gutterBottom variant="body2">
                            <span>
                              There was an error, and we were unable to fetch
                              your notifications. Please reload the page to try
                              again.
                            </span>
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            We check every 15 seconds for notifications. If this
                            problem persists, email us at{" "}
                            <a href="mailto:onlineproblemarchivallocation@gmail.com">
                              onlineproblemarchivallocation@gmail.com
                            </a>{" "}
                            so we can investigate the issue.
                          </Typography>
                        </ListItem>
                      </div>
                    </List>
                  </Paper>
                </Grow>
              </ClickAwayListener>
            )}
          </Popper>
        </>
      );
    }

    let unreadNotifs = 0;
    notifs.forEach((notif) => {
      if (!notif.read) unreadNotifs++;
    });
    notifs.sort((a, b) => {
      return b.timestamp - a.timestamp;
    });

    return (
      <>
        <IconButton
          aria-label={`show ${unreadNotifs} new notifications`}
          color="inherit"
          className={classes.menuButton}
          onClick={(_) => this.setOpen(true)}
          ref={this.notificationButton}
        >
          <Badge badgeContent={unreadNotifs} color="secondary">
            <Bell />
          </Badge>
        </IconButton>
        <Popper
          id="notifications-popup"
          anchorEl={this.notificationButton.current}
          open={open}
          placement="bottom-end"
          transition
          disablePortal
          role={undefined}
        >
          {({ TransitionProps }) => (
            <ClickAwayListener
              onClickAway={() => {
                this.setOpen(false);
              }}
            >
              <Grow in={open} {...TransitionProps}>
                <Paper className={classes.paper}>
                  <List className={classes.list}>
                    {notifs.map((notif, index) => (
                      <React.Fragment key={`notif-${index}`}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span
                            role="img"
                            aria-label="unread-dot"
                            style={{ opacity: notif.read ? "0" : "1" }}
                            className={classes.notificationDot}
                          >
                            ·
                          </span>
                          <ListItem
                            alignItems="flex-start"
                            className={classes.listItem}
                            key={`notification-${index}`}
                          >
                            <Typography gutterBottom>
                              <a className={classes.link} href={notif.link}>{notif.title}</a>
                            </Typography>
                            <Typography gutterBottom variant="body2">
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: notif.content.replace(/\<a href/g, `<a class=${classes.link} href`)
                                }}
                              />
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {new Date(notif.timestamp).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric"
                                }
                              )}
                            </Typography>
                          </ListItem>
                        </div>
                        <Divider className={classes.divider} />
                      </React.Fragment>
                    ))}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span
                        role="img"
                        aria-label="unread-dot"
                        style={{ opacity: "0" }}
                        className={classes.notificationDot}
                      >
                        ·
                      </span>
                      <ListItem
                        alignItems="flex-start"
                        className={classes.listItem}
                      >
                        <Typography gutterBottom>
                          No more notifications{" "}
                          <span role="img" aria-label="party">
                            🎉
                          </span>
                        </Typography>
                        <Typography gutterBottom variant="body2">
                          There are no more notifications - you've reached the
                          end of the list!
                        </Typography>
                      </ListItem>
                    </div>
                  </List>
                </Paper>
              </Grow>
            </ClickAwayListener>
          )}
        </Popper>
      </>
    );
  }
}

class TopBar extends React.Component {
  render() {
    const { notifs, classes, markNotifications } = this.props;

    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            foo
          </Typography>
          <Notifications classes={classes} notifs={notifs} markNotifications={markNotifications}/>
          <IconButton
            edge="end"
            aria-label="account of current user"
            color="inherit"
            className={classes.menuButton}
          >
            <User />
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(TopBar);
