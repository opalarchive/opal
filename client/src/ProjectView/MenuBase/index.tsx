import { withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import Scrollbar from "react-scrollbars-custom";
import styles from "./index.css";

export interface SidebarProps {
  width: number;
  height: number;
  authUser: firebase.User;
}

export interface MenuBaseProps {
  sidebarWidth: number;
  maxWidth?: number;
  right?: boolean;
  background: string;
  totalScroll?: boolean;
  sidebarProps?: object;
  Sidebar: React.ComponentType<any & SidebarProps>;
  defaultScroll?: number;
  authUser: firebase.User;
  children: JSX.Element | JSX.Element[];
}

interface MenuBaseState {
  height: number;
}

class MenuBase extends React.Component<
  MenuBaseProps & WithStyles<typeof styles>,
  MenuBaseState
> {
  private scrollSet = 0;
  private body = React.createRef<HTMLDivElement>();

  state = {
    height: 0,
  };

  constructor(props: MenuBaseProps & WithStyles<typeof styles>) {
    super(props);

    this.changeBodyHeight = this.changeBodyHeight.bind(this);
  }

  changeBodyHeight() {
    this.setState({ height: this.body.current?.clientHeight! });
  }

  componentDidMount() {
    this.changeBodyHeight();
    window.addEventListener("resize", this.changeBodyHeight);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.changeBodyHeight);
  }

  render() {
    const {
      sidebarWidth,
      maxWidth,
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

    console.log(this.state.height);

    return (
      <div
        className={classes.container}
        style={{ backgroundColor: background }}
        ref={this.body}
      >
        <Scrollbar
          noScrollX
          disableTrackYWidthCompensation
          scrollTop={this.scrollSet > 1 ? undefined : defaultScroll}
        >
          <div
            className={`${classes.container} ${classes.centered}`}
            style={{ maxWidth }}
          >
            <div
              className={classes.sidebar}
              style={{
                width: `${sidebarWidth}rem`,
                left: right ? "auto" : 0,
                right: right ? 0 : "auto",
              }}
            >
              <Sidebar
                width={sidebarWidth}
                height={this.state.height}
                authUser={authUser}
                {...sidebarProps}
              />
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
          </div>
        </Scrollbar>
      </div>
    );
  }
}

export default withStyles(styles)(MenuBase);
