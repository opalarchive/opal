import { withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import styles from "./index.css";

export interface SidebarProps {
  width: number;
  height: number;
  authUser: firebase.User;
}

interface SidebaredBaseProps extends WithStyles<typeof styles> {
  sidebarWidth: number;
  right?: boolean;
  Sidebar?: React.ComponentType<any & SidebarProps>;
  sidebarProps?: object;
  stickySidebar?: boolean;
  height: number;
  authUser: firebase.User;
}

class SidebaredBase extends React.Component<SidebaredBaseProps> {
  render() {
    const {
      sidebarWidth,
      right,
      Sidebar,
      sidebarProps,
      stickySidebar,
      height,
      authUser,
      classes,
      children,
    } = this.props;

    return (
      <>
        <div
          className={classes.sidebar}
          style={{
            width: `${sidebarWidth}rem`,
            height,
            left: right ? "auto" : 0,
            right: right ? 0 : "auto",
          }}
        >
          <div
            className={classes.sidebarWrapper}
            style={
              stickySidebar
                ? {
                    position: "fixed",
                  }
                : {} // basically position: sticky but with ref because sticky doesn't work for some reason
            }
          >
            {!!Sidebar && (
              <Sidebar
                width={sidebarWidth}
                height={height}
                authUser={authUser}
                {...sidebarProps}
              />
            )}
          </div>
        </div>
        <div
          className={classes.inner}
          style={{
            marginLeft: !!right ? 0 : `${sidebarWidth}rem`,
            marginRight: !!right ? `${sidebarWidth}rem` : 0,
          }}
        >
          {children}
        </div>
      </>
    );
  }
}

export default withStyles(styles)(SidebaredBase);
