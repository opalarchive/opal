import React from "react";
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Paper,
  Tab,
  TabProps,
  Tabs,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import Notifications, {
  NotificationsProps,
} from "../../Template/Notifications";
import { FiUser } from "react-icons/fi";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import styles, { tabContainerStyles, tabStyles } from "./index.css";

import * as ROUTES from "../../../Constants/routes";
import { compose } from "recompose";

const sectionNames = ["Overview", "Compile", "Settings"];
const sectionLinks = [
  ROUTES.PROJECT_OVERVIEW,
  ROUTES.PROJECT_COMPILE,
  ROUTES.PROJECT_SETTINGS,
];

const prefixes = {
  [ROUTES.PROJECT_OVERVIEW]: 0,
  [ROUTES.PROJECT_PROBLEM.substring(
    0,
    ROUTES.PROJECT_PROBLEM.indexOf(":ind")
  )]: 0,
  [ROUTES.PROJECT_COMPILE]: 1,
  [ROUTES.PROJECT_SETTINGS]: 2,
} as { [url: string]: number };

const getCurrent = (path: string, uuid: string) => {
  for (let i = 0; i < Object.keys(prefixes).length; i++) {
    if (path.startsWith(Object.keys(prefixes)[i].replace(":uuid", uuid))) {
      return prefixes[Object.keys(prefixes)[i]];
    }
  }
  return 0;
};

interface NavbarProps {
  uuid: string;
  forwardedRef?: React.RefObject<HTMLDivElement>;
}

const TabContainer: React.FC<any> = (props) => (
  <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />
);

const StyledTabContainer = withStyles(tabContainerStyles)(TabContainer);

interface LinkTabProps {
  url: string;
}

const LinkTab: React.FC<
  LinkTabProps & TabProps & WithStyles<typeof styles>
> = ({ url, ...rest }) => (
  <Link
    to={url}
    style={{
      textDecoration: "none",
      color: "inherit",
      outline: "none",
    }}
  >
    <Tab disableRipple {...rest} />
  </Link>
);

const StyledTab = withStyles(tabStyles)(LinkTab);

class Navbar extends React.PureComponent<
  NavbarProps & RouteComponentProps & WithStyles<typeof styles>
> {
  render() {
    const { uuid, classes, location, forwardedRef } = this.props;

    const currentSection = getCurrent(location.pathname, uuid);

    return (
      <div className={classes.root} ref={forwardedRef}>
        <StyledTabContainer
          value={currentSection}
          aria-label="project navigation tabs"
        >
          {sectionNames.map((name, index) => {
            return (
              <StyledTab
                key={`${name}-tab`}
                url={sectionLinks[index].replace(":uuid", uuid)}
                label={name}
              />
            ); // mui passes weird props to this that jsx doesn't like on a tags, so we destroy them here (also to style)
          })}
        </StyledTabContainer>
      </div>
    );
  }
}

const StyledNavbar = compose<
  NavbarProps & RouteComponentProps & WithStyles<typeof styles>,
  NavbarProps
>(
  withStyles(styles),
  withRouter
)(Navbar);

type ProjectAppbarProps = NotificationsProps & { title: string };

class ProjectAppbar extends React.Component<ProjectAppbarProps> {
  render() {
    const { notifs, notifsLoading, markNotifications, title } = this.props;

    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <StyledNavbar uuid="e29edbeb-e10e-474d-9c5d-860d479ed198" />
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
  }
}

export default ProjectAppbar;
