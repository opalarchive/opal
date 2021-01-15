import { withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import Scrollbar from "react-scrollbars-custom";
import { ScrollState } from "react-scrollbars-custom/dist/types/types";
import Navbar from "../Project/View/Navbar";
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
  Header?: React.ComponentType<any>;
  defaultScroll?: number;
  authUser: firebase.User;
  children: JSX.Element | JSX.Element[];
}

interface MenuBaseState {
  bodyHeight: number;
  headerHeight: number;
  scroll: number;
}

class MenuBase extends React.Component<
  MenuBaseProps & WithStyles<typeof styles>,
  MenuBaseState
> {
  private scrollSet = 0;
  private body = React.createRef<HTMLDivElement>();
  private header = React.createRef<HTMLDivElement>();

  state = {
    bodyHeight: 0,
    headerHeight: 0,
    scroll: 0,
  };

  constructor(props: MenuBaseProps & WithStyles<typeof styles>) {
    super(props);

    this.changeBodyHeight = this.changeBodyHeight.bind(this);
    this.setScroll = this.setScroll.bind(this);
  }

  changeBodyHeight() {
    this.setState({
      bodyHeight: this.body.current?.clientHeight!,
      headerHeight: !!this.props.Header
        ? this.header.current?.clientHeight!
        : 0,
    });
  }

  setScroll(scrollValues: ScrollState, prevScrollState: ScrollState) {
    this.setState({ scroll: scrollValues.scrollTop });
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
      Header,
      defaultScroll,
      authUser,
      children,
      classes,
    } = this.props;

    if (defaultScroll !== undefined) {
      this.scrollSet = this.scrollSet + 1;
    }

    const scrollPastHeader = this.state.scroll >= this.state.headerHeight;
    const viewableWindowHeight = scrollPastHeader
      ? this.state.bodyHeight
      : this.state.bodyHeight - this.state.headerHeight + this.state.scroll;

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
          onScroll={
            this.setScroll as ((
              event: React.UIEvent<HTMLDivElement, UIEvent>
            ) => void) &
              ((
                scrollValues: ScrollState,
                prevScrollState: ScrollState
              ) => void)
          } // bodge cast to get around what I assume is a typo in @types/react or react-scrollbars-custom
          // jsx has a default onScroll prop while the custom scrollbar has a custom onScroll prop
          // with different function parameters, but the type of onScroll is given as
          // (event: React.UIEvent<HTMLDivElement, UIEvent>) => void) & ((scrollValues: ScrollState, prevScrollState: ScrollState) => void
          // which is clearly impossible since a function cannot have 2 different numbers of required parameters
        >
          <div
            className={`${classes.container} ${classes.centered}`}
            style={{ maxWidth }}
          >
            {!!Header && <Header uuid={"3"} forwardedRef={this.header} />}
            <div
              className={classes.sidebar}
              style={{
                width: `${sidebarWidth}rem`,
                height: viewableWindowHeight,
                left: right ? "auto" : 0,
                right: right ? 0 : "auto",
              }}
            >
              <div
                className={classes.sidebarWrapper}
                style={
                  scrollPastHeader
                    ? {
                        position: "fixed",
                        transform: `translateY(-${this.state.headerHeight}px)`,
                      }
                    : {} // basically position: sticky but with ref because sticky doesn't work for some reason
                }
              >
                <Sidebar
                  width={sidebarWidth}
                  height={viewableWindowHeight}
                  authUser={authUser}
                  {...sidebarProps}
                />
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
          </div>
        </Scrollbar>
      </div>
    );
  }
}

export default withStyles(styles)(MenuBase);
