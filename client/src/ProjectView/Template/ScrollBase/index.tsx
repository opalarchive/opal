import { withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import Scrollbar from "react-scrollbars-custom";
import { ScrollState } from "react-scrollbars-custom/dist/types/types";
import styles from "./index.css";

export interface ScrollBaseProps {
  maxWidth?: number;
  background: string;
  customScrollTop?: number;
  onScrollTopChange?: (scrollTop: number) => void;
}
// const relevantProps: (keyof ScrollBaseProps)[] = [
//   "maxWidth",
//   "background",
//   "customScrollTop",
// ];

class ScrollBase extends React.Component<
  ScrollBaseProps & WithStyles<typeof styles>
> {
  // shouldComponentUpdate(nextProps: ScrollBaseProps) {
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

  constructor(props: ScrollBaseProps & WithStyles<typeof styles>) {
    super(props);

    this.setScroll = this.setScroll.bind(this);
  }

  setScroll(scrollValues: ScrollState, prevScrollState: ScrollState) {
    !!this.props.onScrollTopChange &&
      this.props.onScrollTopChange(scrollValues.scrollTop);
  }

  render() {
    const {
      maxWidth,
      background,
      customScrollTop,
      children,
      classes,
    } = this.props;

    // bodge cast to get around what I assume is a typo in @types/react or react-scrollbars-custom
    // jsx has a default onScroll prop while the custom scrollbar has a custom onScroll prop
    // with different function parameters, but the type of onScroll is given as
    // (event: React.UIEvent<HTMLDivElement, UIEvent>) => void) & ((scrollValues: ScrollState, prevScrollState: ScrollState) => void
    // which is clearly impossible since a function cannot have 2 different numbers of required parameters
    const onScroll = this.setScroll as ((
      event: React.UIEvent<HTMLDivElement, UIEvent>
    ) => void) &
      ((scrollValues: ScrollState, prevScrollState: ScrollState) => void);

    return (
      <div
        className={classes.container}
        style={{ backgroundColor: background }}
      >
        <Scrollbar
          noScrollX
          disableTrackYWidthCompensation
          scrollTop={customScrollTop}
          onScroll={onScroll}
        >
          <div
            className={`${classes.container} ${classes.centered}`}
            style={{ maxWidth }}
          >
            {children}
          </div>
        </Scrollbar>
      </div>
    );
  }
}

export default withStyles(styles)(ScrollBase);
