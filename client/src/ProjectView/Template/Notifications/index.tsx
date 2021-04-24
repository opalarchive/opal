import {
  Typography,
  IconButton,
  Badge,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  List,
  ListItem,
  Divider,
  makeStyles,
} from "@material-ui/core";
import React, { useState } from "react";
import { FiBell } from "react-icons/fi";
import { Notification } from "../../../../../.shared/src";
import { Result } from "../../../Constants/types";
import Loading from "../../../Loading";
import styles, { notifBoxStyles } from "./index.css";

interface NotificationBoxProps {
  read?: boolean;
  Title: JSX.Element | string;
  Body: JSX.Element | string;
  Caption?: JSX.Element | string;
}

/**
 * A box that contains the details for one notification
 * Gets stacked together to create the list
 */
const NotificationBox: React.FC<NotificationBoxProps> = ({
  read,
  Title,
  Body,
  Caption,
}) => {
  const classes = makeStyles(notifBoxStyles)();

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span
        role="img"
        aria-label="unread-dot"
        style={{ opacity: !!read ? "0" : "1" }}
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

export interface NotificationsProps {
  notifs: Result<Notification[]>;
  notifsLoading: boolean;
  markNotifications: (number: number) => Promise<void>;
}

const Notifications: React.FC<NotificationsProps> = ({
  notifs,
  notifsLoading,
  markNotifications,
}) => {
  const classes = makeStyles(styles)();

  const [dialogOpen, setDialogOpen] = useState(false);
  const notificationButton = React.createRef<HTMLButtonElement>();

  // when the notifications dialog is open, set all the notifications to read
  const onDialogOpen = () => {
    if (notifs.success) markNotifications(notifs.value.length);
  };

  let ariaLabel = "";
  let icon: JSX.Element | string | undefined = undefined;
  let popOut = <div />;

  if (notifsLoading) {
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
    popOut = (
      <NotificationBox
        Title="There was an error!"
        Body={
          <span>
            There was an error, and we were unable to fetch your notifications.
            Please reload the page to try again.
          </span>
        }
        Caption={
          <>
            We check every 15 seconds for notifications. If this problem
            persists, email us at{" "}
            <a
              className={classes.link}
              href="mailto:onlineproblemarchivallocation@gmail.com"
            >
              onlineproblemarchivallocation@gmail.com
            </a>{" "}
            so we can investigate the issue.
          </>
        }
      />
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
            <NotificationBox
              read={notif.read}
              Title={
                <a className={classes.link} href={notif.link}>
                  {notif.title}
                </a>
              }
              Body={
                <span
                  dangerouslySetInnerHTML={{
                    __html: notif.content.replace(
                      /<a href/g,
                      `<a class=${classes.link} href`
                    ),
                  }}
                />
              }
              Caption={new Date(notif.timestamp).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
            <Divider className={classes.divider} />
          </React.Fragment>
        ))}
        <NotificationBox
          Title={
            <>
              No more notifications{" "}
              <span role="img" aria-label="party">
                🎉
              </span>
            </>
          }
          Body="There are no more notifications - you've reached the end of the list!"
        />
      </>
    );
  }

  return (
    <>
      <IconButton
        aria-label={ariaLabel}
        color="inherit"
        className={classes.menuButton}
        onClick={() => {
          setDialogOpen(true);
          onDialogOpen();
        }}
        ref={notificationButton}
      >
        <Badge badgeContent={icon} color="secondary">
          <FiBell />
        </Badge>
      </IconButton>
      <Popper
        id="notifications-popup"
        anchorEl={notificationButton.current}
        open={dialogOpen}
        placement="bottom-end"
        transition
        disablePortal
        role={undefined}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={() => setDialogOpen(false)}>
            <Grow in={dialogOpen} {...TransitionProps}>
              <Paper className={classes.paper}>
                <List className={classes.list}>{popOut}</List>
              </Paper>
            </Grow>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default Notifications;
