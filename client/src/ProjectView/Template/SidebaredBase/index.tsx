import { withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import styles from "./index.css";

export interface SidebarProps {
  width: number;
  authUser: firebase.User;
}

interface SidebaredBaseProps extends WithStyles<typeof styles> {
  sidebarWidth: number;
  right?: boolean;
  Sidebar?: React.ComponentType<any & SidebarProps>;
  sidebarProps?: object;
  fixedSidebar?: boolean;
  sidebarYOffset?: number;
  authUser: firebase.User;
}

// const relevantProps: (keyof SidebaredBaseProps)[] = [
//   "sidebarWidth",
//   "right",
//   "sidebarProps",
//   "fixedSidebar",
//   "sidebarYOffset",
//   "height",
// ];

class SidebaredBase extends React.Component<SidebaredBaseProps> {
  // shouldComponentUpdate(nextProps: SidebaredBaseProps) {
  //   for (let i = 0; i < relevantProps.length; i++) {
  //     if (
  //       JSON.stringify(nextProps[relevantProps[i]]) !==
  //       JSON.stringify(this.props[relevantProps[i]])
  //     ) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  render() {
    const {
      sidebarWidth,
      right,
      Sidebar,
      sidebarProps,
      fixedSidebar,
      sidebarYOffset,
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
            left: right ? "auto" : 0,
            right: right ? 0 : "auto",
          }}
        >
          <div
            className={classes.sidebarWrapper}
            style={{
              transform: `translateY(${sidebarYOffset}px)`,
              position: fixedSidebar ? "fixed" : "static",
            }}
          >
            {!!Sidebar && (
              <Sidebar
                width={sidebarWidth}
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
