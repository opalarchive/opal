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
  Divider
} from "@material-ui/core";
import React from "react";
import { Bell, User, Loader } from "react-feather";
import Loading from "../../../Loading";

const styles = (theme) => ({
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
    backgroundColor: "#ADD8E6"
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
  }
});

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
  }

  render() {
    let { classes, notifs, loading } = this.props;
    const { open } = this.state;

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
            <Badge badgeContent=<Loader size={10}/> color="secondary">
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
                    <List className={`${classes.list} ${classes.centeredSpace}`}>
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
                        <ListItem
                          alignItems="flex-start"
                          className={classes.listItem}
                        >
                          <Typography gutterBottom>
                            There was an Error!
                          </Typography>
                          <Typography gutterBottom variant="body2">
                            <span>
                              There was an error, and we were unable to fetch your
                              notifications. Please reload the page to try again.
                            </span>
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            We check every 15 seconds for notifications. If this problem persists, email us at <a href="mailto:onlineproblemarchivallocation@gmail.com">onlineproblemarchivallocation@gmail.com</a> so we can investigate the issue.
                          </Typography>
                        </ListItem>
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
    notifs.forEach(notif => {
      if (!notif.read) unreadNotifs ++;
    });

    notifs[1] = notifs[0];

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
                    {notifs.map((notif, index) =>
                      <>
                      <ListItem
                        alignItems="flex-start"
                        className={classes.listItem}
                        key={`notification-${index}`}
                      >
                        <Typography gutterBottom>
                          <a href={notif.link}>{notif.title}</a>
                        </Typography>
                        <Typography gutterBottom variant="body2">
                          <span dangerouslySetInnerHTML={{ __html: notif.content}} />
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(notif.timestamp).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Typography>
                      </ListItem>
                      {index < notifs.length - 1 ? (
                        <Divider className={classes.divider} />
                      ) : null}
                      </>
                    )}
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
    const { notifs, classes } = this.props;

    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            foo
          </Typography>
          <Notifications classes={classes} notifs={notifs} />
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
