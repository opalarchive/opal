import { makeStyles, Theme, withTheme } from "@material-ui/core";
import React, { useMemo } from "react";

import styles from "./index.css";

interface SpinningProps {
  background: string;
  inner: string;
  center: string;
  outer: string;
  hideText?: boolean;
}

const useStyles = makeStyles(styles);
const prefix = "3px solid ";

export const SpinningBase: React.FC<SpinningProps> = ({
  background,
  inner,
  center,
  outer,
  hideText,
}) => {
  // style classes
  const classes = useStyles();

  const overrideColor = useMemo(
    () => ({
      borderLeft: prefix + background,
      borderRight: prefix + background,
    }),
    [background]
  );

  return (
    <div
      style={{
        position: "relative",
        marginTop: "2rem",
        marginBottom: "2rem",
      }}
    >
      <div style={{ position: "relative", height: "8rem" }}>
        <div
          className={`${classes.ring} ${classes.inner}`}
          style={{ ...overrideColor, borderTop: prefix + inner }}
        ></div>
        <div
          className={`${classes.ring} ${classes.center}`}
          style={{ ...overrideColor, borderTop: prefix + center }}
        ></div>
        <div
          className={`${classes.ring} ${classes.outer}`}
          style={{ ...overrideColor, borderTop: prefix + outer }}
        ></div>
      </div>
      {!!hideText ? (
        ""
      ) : (
        <div className={`${classes.text}`} style={{ marginTop: "1rem" }}>
          Loading...
        </div>
      )}
    </div>
  );
};

interface LoadingProps {
  background: string;
  hideText?: boolean;
  theme: Theme;
}

const Loading: React.FC<LoadingProps> = ({ background, hideText, theme }) => {
  return (
    <SpinningBase
      background={background}
      inner={theme.palette.primary.light}
      center={theme.palette.primary.dark}
      outer={theme.palette.secondary.dark}
      hideText={hideText}
    />
  );
};

export default withTheme(Loading);
