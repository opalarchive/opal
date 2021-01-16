import {
  Paper,
  Tab,
  TabProps,
  Tabs,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import styles, { tabStyles } from "./index.css";

interface NavbarProps {
  uuid: string;
  currentSection: number;
  tabNames: string[];
  tabLinks: string[];
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

class Navbar extends React.Component<NavbarProps & WithStyles<typeof styles>> {
  componentDidMount() {
    console.log("sad");
  }

  render() {
    const {
      uuid,
      currentSection,
      tabNames,
      tabLinks,
      classes,
      forwardedRef,
    } = this.props;

    return (
      <div className={classes.root} ref={forwardedRef}>
        <Paper elevation={3}>
          <Tabs value={currentSection} aria-label="project navigation tabs">
            {tabNames.map((name, index) => {
              return (
                <StyledTab
                  key={`${name}-tab`}
                  url={tabLinks[index].replace(":uuid", uuid)}
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

export default withStyles(styles)(Navbar);
