import {
  Paper,
  Tab,
  TabProps,
  Tabs,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import styles, { tabStyles } from "./index.css";

import * as ROUTES from "../../../../Constants/routes";
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
        <Paper elevation={3}>
          <Tabs value={currentSection} aria-label="project navigation tabs">
            {sectionNames.map((name, index) => {
              return (
                <StyledTab
                  key={`${name}-tab`}
                  url={sectionLinks[index].replace(":uuid", uuid)}
                  label={name}
                />
              ); // mui passes weird props to this that jsx doesn't like on a tags, so we destroy them here (also to style)
            })}
          </Tabs>
        </Paper>
      </div>
    );
  }
}

export default compose<
  NavbarProps & RouteComponentProps & WithStyles<typeof styles>,
  NavbarProps
>(
  withStyles(styles),
  withRouter
)(Navbar);
