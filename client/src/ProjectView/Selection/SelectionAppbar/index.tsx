import React from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import Notifications, {
  NotificationsProps,
} from "../../Template/Notifications";
import { FiUser } from "react-icons/fi";

type SelectionAppbarProps = NotificationsProps & { title: string };

const SelectionAppbar: React.FC<SelectionAppbarProps> = ({
  notifs,
  notifsLoading,
  markNotifications,
  title,
}) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Notifications
          notifsLoading={notifsLoading}
          notifs={notifs}
          markNotifications={markNotifications}
        />
        <IconButton
          edge="end"
          aria-label="account of current user"
          color="inherit"
        >
          <FiUser />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default SelectionAppbar;
