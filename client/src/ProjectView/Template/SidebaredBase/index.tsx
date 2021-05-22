import { makeStyles } from "@material-ui/core";
import React from "react";
import styles from "./index.css";

const useStyles = makeStyles(styles);

export interface SidebarProps {
  width: number;
  authUser: firebase.User;
}

interface SidebaredBaseProps {
  sidebarWidth: number;
  right?: boolean;
  Sidebar?: React.ComponentType<any & SidebarProps>;
  sidebarProps?: object;
  fixedSidebar?: boolean;
  sidebarYOffset?: number;
  height?: number;
  authUser: firebase.User;
}

const SidebaredBase: React.FC<SidebaredBaseProps> = ({
  sidebarWidth,
  right,
  Sidebar,
  sidebarProps,
  fixedSidebar,
  sidebarYOffset,
  height,
  authUser,
  children,
}) => {
  const classes = useStyles();

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
            height: !!height ? height : "100%",
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
};

export default SidebaredBase;
