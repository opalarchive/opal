import { makeStyles } from "@material-ui/core";
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

const ScrollBase: React.FC<ScrollBaseProps> = ({
  maxWidth,
  background,
  customScrollTop,
  onScrollTopChange,
  children,
}) => {
  const classes = makeStyles(styles)();

  const setScroll = ((
    scrollValues: ScrollState,
    prevScrollState: ScrollState
  ) => {
    !!onScrollTopChange && onScrollTopChange(scrollValues.scrollTop);
  }) as ((event: React.UIEvent<HTMLDivElement, UIEvent>) => void) & // which is clearly impossible since a function cannot have 2 different numbers of required parameters // (event: React.UIEvent<HTMLDivElement, UIEvent>) => void) & ((scrollValues: ScrollState, prevScrollState: ScrollState) => void // with different function parameters, but the type of onScroll is given as // jsx has a default onScroll prop while the custom scrollbar has a custom onScroll prop // bodge cast to get around what I assume is a typo in @types/react or react-scrollbars-custom
    ((scrollValues: ScrollState, prevScrollState: ScrollState) => void);

  return (
    <div className={classes.container} style={{ backgroundColor: background }}>
      <Scrollbar
        noScrollX
        disableTrackYWidthCompensation
        scrollTop={customScrollTop}
        onScroll={setScroll}
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
};

export default ScrollBase;
