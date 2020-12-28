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
  WithStyles,
} from "@material-ui/core";
import React from "react";
import { FiBell, FiUser } from "react-icons/fi";
import { Notification } from "../../../../.shared";
import { Result } from "../../Constants/types";
import Loading from "../../Loading";
import styles from "./index.css";

interface NotificationsProps extends WithStyles<typeof styles> {
  notifs: Result<Notification[]>;
  loading: boolean;
  markNotifications: (number: number) => Promise<void>;
}

interface NotificationsState {
  open: boolean;
}

class Notifications extends React.Component<
  NotificationsProps,
  NotificationsState
> {
  state = {
    open: false,
  };

  private notificationButton = React.createRef<HTMLButtonElement>();

  constructor(props: NotificationsProps) {
    super(props);

    this.setOpen = this.setOpen.bind(this);
  }

  setOpen(value: boolean) {
    this.setState({ open: value });
    if (!value && this.props.notifs.success) {
      this.props.markNotifications(this.props.notifs.value.length);
    }
  }

  render() {
    let { classes, notifs, loading } = this.props;
    const { open } = this.state;

    const notificationBox = (
      read: boolean,
      Title: JSX.Element | string,
      Body: JSX.Element | string,
      Caption?: JSX.Element | string
    ): JSX.Element => {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            role="img"
            aria-label="unread-dot"
            style={{ opacity: read ? "0" : "1" }}
            className={classes.notificationDot}
          >
            ·
          </span>
          <ListItem alignItems="flex-start" className={classes.listItem}>
            <Typography gutterBottom>{Title}</Typography>
            <Typography gutterBottom variant="body2">
              {Body}
            </Typography>
            {!!Caption && (
              <Typography variant="caption" color="textSecondary">
                {Caption}
              </Typography>
            )}
          </ListItem>
        </div>
      );
    };

    let ariaLabel = "";
    let icon: JSX.Element | string | undefined = undefined;
    let popOut = <div />;

    if (loading) {
      ariaLabel = "the notifications are still loading";
      popOut = (
        <>
          <Loading background="" hideText={true} />
          We're loading your notifications! Hang in there.
        </>
      );
    } else if (!notifs.success) {
      ariaLabel = "an error occured when getting the number of notifications";
      icon = "!";
      popOut = notificationBox(
        false,
        "There was an Error!",
        <span>
          There was an error, and we were unable to fetch your notifications.
          Please reload the page to try again.
        </span>,
        <>
          We check every 15 seconds for notifications. If this problem persists,
          email us at{" "}
          <a
            className={classes.link}
            href="mailto:onlineproblemarchivallocation@gmail.com"
          >
            onlineproblemarchivallocation@gmail.com
          </a>{" "}
          so we can investigate the issue.
        </>
      );
    } else {
      let unreadNotifs = 0;
      if (notifs.success) {
        notifs.value.forEach((notif: Notification) => {
          if (!notif.read) unreadNotifs++;
        });
        notifs.value.sort((a, b) => {
          return b.timestamp - a.timestamp;
        });
      }
      ariaLabel = `show ${unreadNotifs} new notifications`;
      if (unreadNotifs > 0) {
        icon = `${unreadNotifs}`;
      }
      popOut = (
        <>
          {notifs.value.map((notif, index) => (
            <React.Fragment key={`notif-${index}`}>
              {notificationBox(
                notif.read,
                <a className={classes.link} href={notif.link}>
                  {notif.title}
                </a>,
                <span
                  dangerouslySetInnerHTML={{
                    __html: notif.content.replace(
                      /\<a href/g,
                      `<a class=${classes.link} href`
                    ),
                  }}
                />,
                new Date(notif.timestamp).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              )}
              <Divider className={classes.divider} />
            </React.Fragment>
          ))}
          {notificationBox(
            false,
            <>
              No more notifications{" "}
              <span role="img" aria-label="party">
                🎉
              </span>
            </>,
            "There are no more notifications - you've reached the end of the list!"
          )}
        </>
      );
    }

    return (
      <>
        <IconButton
          aria-label={ariaLabel}
          color="inherit"
          className={classes.menuButton}
          onClick={(_) => this.setOpen(true)}
          ref={this.notificationButton}
        >
          <Badge badgeContent={icon} color="secondary">
            <FiBell />
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
                  <List className={classes.list}>{popOut}</List>
                </Paper>
              </Grow>
            </ClickAwayListener>
          )}
        </Popper>
      </>
    );
  }
}

type TopBarProps = NotificationsProps & { title: string };

class TopBar extends React.Component<TopBarProps> {
  render() {
    const { notifs, loading, markNotifications, title, classes } = this.props;

    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          <Notifications
            classes={classes}
            loading={loading}
            notifs={notifs}
            markNotifications={markNotifications}
          />
          <IconButton
            edge="end"
            aria-label="account of current user"
            color="inherit"
            className={classes.menuButton}
          >
            <FiUser />
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(TopBar);
