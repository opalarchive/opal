import { withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import Scrollbar from "react-scrollbars-custom";
import styles from "./index.css";

export interface SidebarProps {
  width: number;
  authUser: firebase.User;
}

export interface MenuBaseProps {
  width: number;
  right?: boolean;
  background: string;
  totalScroll?: boolean;
  sidebarProps?: object;
  Sidebar: React.ComponentType<any>;
  defaultScroll?: number;
  authUser: firebase.User;
  children: JSX.Element | JSX.Element[];
}

class MenuBase extends React.Component<
  MenuBaseProps & WithStyles<typeof styles>
> {
  private scrollSet = 0;

  render() {
    const {
      width,
      right,
      background,
      sidebarProps,
      Sidebar,
      defaultScroll,
      authUser,
      children,
      classes,
    } = this.props;

    if (defaultScroll !== undefined) {
      this.scrollSet = this.scrollSet + 1;
    }

    return (
      <div className={classes.root} style={{ backgroundColor: background }}>
        <Sidebar width={width} authUser={authUser} {...sidebarProps} />
        <div
          className={classes.inner}
          style={{
            marginLeft: !!right ? 0 : `${width}rem`,
            marginRight: !!right ? `${width}rem` : 0,
          }}
        >
          <Scrollbar
            noScrollX
            scrollTop={this.scrollSet > 1 ? undefined : defaultScroll}
          >
            <div
              style={{
                padding: "1rem",
              }}
            >
              {children}
            </div>
          </Scrollbar>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(MenuBase);
